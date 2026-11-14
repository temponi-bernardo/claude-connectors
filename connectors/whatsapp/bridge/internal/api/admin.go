package api

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"
	"unicode/utf8"

	qrcode "github.com/skip2/go-qrcode"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/bridge"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/config"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

// handleRestore answers POST /restore (snapshot in the body or X-Snapshot: none).
func (s *Server) handleRestore(w http.ResponseWriter, r *http.Request) {
	if s.b.Phase() != bridge.PhaseAwaitingRestore {
		writeError(w, http.StatusConflict, "already_restored", "The bridge has already been restored.")
		return
	}
	empty := strings.EqualFold(r.Header.Get("X-Snapshot"), "none")
	body := http.MaxBytesReader(w, r.Body, s.opts.MaxRestore)
	if empty && !bodyIsEmpty(body) {
		badRequest(w, "With X-Snapshot: none the body must be empty.")
		return
	}
	restored, gen, err := s.b.Restore(body, empty)
	switch {
	case errors.Is(err, bridge.ErrAlreadyRestored):
		writeError(w, http.StatusConflict, "already_restored", "The bridge has already been restored.")
	case errors.Is(err, bridge.ErrBadSnapshot):
		s.opts.Log.Warn("snapshot rejected", "err", err.Error())
		writeError(w, http.StatusUnprocessableEntity, "bad_snapshot", "Snapshot invalid, corrupted or encrypted with the wrong key.")
	case err != nil:
		s.internalError(w, "restore", err)
	default:
		writeJSON(w, http.StatusOK, map[string]any{"restored": restored, "generation": gen})
	}
}

// bodyIsEmpty reports whether the body has no bytes.
func bodyIsEmpty(r io.Reader) bool {
	var one [1]byte
	n, _ := io.ReadFull(r, one[:])
	return n == 0
}

// handleSnapshot answers GET /snapshot: 204 when unchanged, 200 with the encrypted file.
// ?force=1 skips the hash comparison (so the Worker can recover a snapshot it failed to store).
func (s *Server) handleSnapshot(w http.ResponseWriter, r *http.Request) {
	if r.URL.Query().Get("force") == "1" {
		s.b.ForgetSnapshotHash()
	}
	written := false
	changed, err := s.b.Snapshot(r.Context(), func(size int64, gen uint64, body io.Reader) error {
		h := w.Header()
		h.Set("Content-Type", "application/octet-stream")
		h.Set("Content-Length", strconv.FormatInt(size, 10))
		h.Set("X-Snapshot-Generation", strconv.FormatUint(gen, 10))
		w.WriteHeader(http.StatusOK)
		written = true
		_, err := io.Copy(w, body)
		return err
	})
	switch {
	case err != nil && written:
		s.opts.Log.Error("snapshot transfer interrupted", "err", err.Error())
	case err != nil:
		s.internalError(w, "snapshot", err)
	case !changed:
		w.WriteHeader(http.StatusNoContent)
	}
}

// decodeJSON reads a small JSON body into v.
func decodeJSON(w http.ResponseWriter, r *http.Request, v any) bool {
	dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, maxJSONBody))
	if err := dec.Decode(v); err != nil {
		badRequest(w, "Invalid JSON body.")
		return false
	}
	return true
}

// validPhone accepts digits only, 8 to 15 of them.
func validPhone(p string) bool {
	if len(p) < 8 || len(p) > 15 {
		return false
	}
	for _, c := range p {
		if c < '0' || c > '9' {
			return false
		}
	}
	return true
}

// handlePairCode answers POST /pair/code.
func (s *Server) handlePairCode(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Phone string `json:"phone"`
	}
	if !decodeJSON(w, r, &body) {
		return
	}
	if !validPhone(body.Phone) {
		badRequest(w, "phone must have digits only (8 to 15), including the country code.")
		return
	}
	code, err := s.client().PairCode(r.Context(), body.Phone)
	switch {
	case errors.Is(err, wa.ErrAlreadyPaired):
		writeError(w, http.StatusConflict, "already_paired", "A WhatsApp session already exists.")
	case errors.Is(err, wa.ErrNotConnected):
		writeError(w, http.StatusServiceUnavailable, "not_connected", "Could not reach WhatsApp right now.")
	case err != nil:
		s.opts.Log.Warn("pairing by code failed", "err", wa.Redact(err.Error()))
		writeError(w, http.StatusBadGateway, "pair_failed", "WhatsApp rejected the code request.")
	default:
		writeJSON(w, http.StatusOK, map[string]string{"code": code})
	}
}

// qrPNGSize is the side of the QR PNG, in pixels.
const qrPNGSize = 256

// qrPNGBase64 renders the QR PNG in base64.
func qrPNGBase64(content string) (string, error) {
	png, err := qrcode.Encode(content, qrcode.Medium, qrPNGSize)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(png), nil
}

// handlePairQR answers GET /pair/qr with the QR text, the PNG and the expiry.
func (s *Server) handlePairQR(w http.ResponseWriter, r *http.Request) {
	qr, err := s.client().QR()
	switch {
	case errors.Is(err, wa.ErrAlreadyPaired):
		writeError(w, http.StatusConflict, "already_paired", "A WhatsApp session already exists.")
		return
	case err != nil:
		writeError(w, http.StatusServiceUnavailable, "qr_not_ready", "The QR has not arrived yet; try again in a few seconds.")
		return
	}
	png, err := qrPNGBase64(qr.Code)
	if err != nil {
		s.internalError(w, "qr png", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"qr": qr.Code, "png_base64": png, "expires_at": s.formatTime(qr.ExpiresAt)})
}

// handleLogout answers POST /logout.
func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	if err := s.client().Logout(r.Context()); err != nil {
		s.opts.Log.Warn("logout failed", "err", wa.Redact(err.Error()))
		writeError(w, http.StatusBadGateway, "logout_failed", "Could not delete the session.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"logged_out": true})
}

// maxSendRunes is the maximum length of the sent text.
const maxSendRunes = 4096

// maxReplyToLen is the maximum length of the quoted message id.
const maxReplyToLen = 200

// sendRequest is the body of POST /send.
type sendRequest struct {
	Recipient string `json:"recipient"`
	Text      string `json:"text"`
	ReplyTo   string `json:"reply_to"`
}

// checkSend decides a send's validation error (pure): status, code and message; status 0 = ok.
// An empty allowlist allows any contact or group; otherwise only the listed ones.
func (s *Server) checkSend(req sendRequest) (string, int, string, string) {
	if !s.opts.EnableSend {
		return "", http.StatusForbidden, "send_disabled", "Sending is turned off on this bridge."
	}
	jid, ok := config.NormalizeRecipient(req.Recipient)
	if !ok {
		return "", http.StatusBadRequest, "bad_request", "recipient must be a number with country code or a JID."
	}
	if len(s.allowlist) > 0 && !s.allowlist[jid] {
		return "", http.StatusForbidden, "recipient_not_allowed", "Recipient is not in the allowlist."
	}
	if n := utf8.RuneCountInString(req.Text); strings.TrimSpace(req.Text) == "" || n > maxSendRunes || !utf8.ValidString(req.Text) {
		return "", http.StatusBadRequest, "bad_request", "text must have 1 to 4096 characters."
	}
	if len(req.ReplyTo) > maxReplyToLen {
		return "", http.StatusBadRequest, "bad_request", "reply_to must have at most 200 characters."
	}
	return jid, 0, "", ""
}

// handleSend answers POST /send.
func (s *Server) handleSend(w http.ResponseWriter, r *http.Request) {
	var req sendRequest
	if !s.opts.EnableSend {
		writeError(w, http.StatusForbidden, "send_disabled", "Sending is turned off on this bridge.")
		return
	}
	if !decodeJSON(w, r, &req) {
		return
	}
	jid, status, code, msg := s.checkSend(req)
	if status != 0 {
		writeError(w, status, code, msg)
		return
	}
	out := wa.Outgoing{To: jid, Text: req.Text}
	if !s.resolveQuote(w, r, &out, req.ReplyTo) || !s.reserveSend(w, r) {
		return
	}
	s.deliverSend(w, r, out)
}

// resolveQuote looks up the quoted message in the same chat; if missing it answers 404 without spending the send quota.
func (s *Server) resolveQuote(w http.ResponseWriter, r *http.Request, out *wa.Outgoing, replyTo string) bool {
	if replyTo == "" {
		return true
	}
	q, err := s.st().GetQuoted(r.Context(), out.To, replyTo)
	switch {
	case errors.Is(err, store.ErrNotFound):
		writeError(w, http.StatusNotFound, "quoted_not_found", "Quoted message not found in this chat.")
		return false
	case err != nil:
		s.internalError(w, "quote", err)
		return false
	}
	out.Quote = &q
	return true
}

// reserveSend applies the hourly limit; answers 429 when exceeded.
func (s *Server) reserveSend(w http.ResponseWriter, r *http.Request) bool {
	ok, wait, err := s.st().ReserveSend(r.Context(), s.opts.Now(), s.opts.SendMaxPerHour)
	if err != nil {
		s.internalError(w, "rate limit", err)
		return false
	}
	if !ok {
		w.Header().Set("Retry-After", strconv.Itoa(wait))
		writeJSON(w, http.StatusTooManyRequests, map[string]any{"error": "rate_limited", "retry_after_seconds": wait,
			"message": "Hourly sending limit reached."})
	}
	return ok
}

// deliverSend actually sends and answers with id and timestamp.
func (s *Server) deliverSend(w http.ResponseWriter, r *http.Request, out wa.Outgoing) {
	sent, err := s.client().SendText(r.Context(), out)
	switch {
	case errors.Is(err, wa.ErrNotConnected):
		writeError(w, http.StatusServiceUnavailable, "not_connected", "WhatsApp is not connected.")
	case err != nil:
		s.opts.Log.Warn("send failed", "err", wa.Redact(err.Error()))
		writeError(w, http.StatusBadGateway, "send_failed", "WhatsApp did not accept the message.")
	default:
		writeJSON(w, http.StatusOK, map[string]string{"id": sent.ID, "timestamp": s.formatTime(sent.Timestamp)})
	}
}
