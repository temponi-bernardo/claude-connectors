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

// handleRestore responde POST /restore (snapshot no corpo ou X-Snapshot: none).
func (s *Server) handleRestore(w http.ResponseWriter, r *http.Request) {
	if s.b.Phase() != bridge.PhaseAwaitingRestore {
		writeError(w, http.StatusConflict, "already_restored", "A ponte já foi restaurada.")
		return
	}
	empty := strings.EqualFold(r.Header.Get("X-Snapshot"), "none")
	body := http.MaxBytesReader(w, r.Body, s.opts.MaxRestore)
	if empty && !bodyIsEmpty(body) {
		badRequest(w, "Com X-Snapshot: none o corpo precisa ser vazio.")
		return
	}
	restored, gen, err := s.b.Restore(body, empty)
	switch {
	case errors.Is(err, bridge.ErrAlreadyRestored):
		writeError(w, http.StatusConflict, "already_restored", "A ponte já foi restaurada.")
	case errors.Is(err, bridge.ErrBadSnapshot):
		s.opts.Log.Warn("snapshot rejeitado", "err", err.Error())
		writeError(w, http.StatusUnprocessableEntity, "bad_snapshot", "Snapshot inválido, corrompido ou com chave errada.")
	case err != nil:
		s.internalError(w, "restore", err)
	default:
		writeJSON(w, http.StatusOK, map[string]any{"restored": restored, "generation": gen})
	}
}

// bodyIsEmpty diz se o corpo não tem nenhum byte.
func bodyIsEmpty(r io.Reader) bool {
	var one [1]byte
	n, _ := io.ReadFull(r, one[:])
	return n == 0
}

// handleSnapshot responde GET /snapshot: 204 sem mudança, 200 com o arquivo cifrado.
// ?force=1 ignora a comparação de hash (para o Worker recuperar um snapshot que não conseguiu gravar).
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
		s.opts.Log.Error("envio do snapshot interrompido", "err", err.Error())
	case err != nil:
		s.internalError(w, "snapshot", err)
	case !changed:
		w.WriteHeader(http.StatusNoContent)
	}
}

// decodeJSON lê um corpo JSON pequeno em v.
func decodeJSON(w http.ResponseWriter, r *http.Request, v any) bool {
	dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, maxJSONBody))
	if err := dec.Decode(v); err != nil {
		badRequest(w, "Corpo JSON inválido.")
		return false
	}
	return true
}

// validPhone aceita só dígitos, de 8 a 15.
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

// handlePairCode responde POST /pair/code.
func (s *Server) handlePairCode(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Phone string `json:"phone"`
	}
	if !decodeJSON(w, r, &body) {
		return
	}
	if !validPhone(body.Phone) {
		badRequest(w, "phone precisa ter só dígitos (8 a 15), com DDI.")
		return
	}
	code, err := s.client().PairCode(r.Context(), body.Phone)
	switch {
	case errors.Is(err, wa.ErrAlreadyPaired):
		writeError(w, http.StatusConflict, "already_paired", "Já existe uma sessão do WhatsApp.")
	case errors.Is(err, wa.ErrNotConnected):
		writeError(w, http.StatusServiceUnavailable, "not_connected", "Não foi possível falar com o WhatsApp agora.")
	case err != nil:
		s.opts.Log.Warn("pareamento por código falhou", "err", wa.Redact(err.Error()))
		writeError(w, http.StatusBadGateway, "pair_failed", "O WhatsApp recusou o pedido de código.")
	default:
		writeJSON(w, http.StatusOK, map[string]string{"code": code})
	}
}

// qrPNGSize é o lado do PNG do QR, em pixels.
const qrPNGSize = 256

// qrPNGBase64 gera o PNG do QR em base64.
func qrPNGBase64(content string) (string, error) {
	png, err := qrcode.Encode(content, qrcode.Medium, qrPNGSize)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(png), nil
}

// handlePairQR responde GET /pair/qr com o texto do QR, o PNG e a validade.
func (s *Server) handlePairQR(w http.ResponseWriter, r *http.Request) {
	qr, err := s.client().QR()
	switch {
	case errors.Is(err, wa.ErrAlreadyPaired):
		writeError(w, http.StatusConflict, "already_paired", "Já existe uma sessão do WhatsApp.")
		return
	case err != nil:
		writeError(w, http.StatusServiceUnavailable, "qr_not_ready", "O QR ainda não chegou; tente de novo em alguns segundos.")
		return
	}
	png, err := qrPNGBase64(qr.Code)
	if err != nil {
		s.internalError(w, "qr png", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"qr": qr.Code, "png_base64": png, "expires_at": s.formatTime(qr.ExpiresAt)})
}

// handleLogout responde POST /logout.
func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	if err := s.client().Logout(r.Context()); err != nil {
		s.opts.Log.Warn("logout falhou", "err", wa.Redact(err.Error()))
		writeError(w, http.StatusBadGateway, "logout_failed", "Não foi possível apagar a sessão.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"logged_out": true})
}

// maxSendRunes é o tamanho máximo do texto enviado.
const maxSendRunes = 4096

// maxReplyToLen é o tamanho máximo do id da mensagem citada.
const maxReplyToLen = 200

// sendRequest é o corpo de POST /send.
type sendRequest struct {
	Recipient string `json:"recipient"`
	Text      string `json:"text"`
	ReplyTo   string `json:"reply_to"`
}

// checkSend decide o erro de validação de um envio (função pura): status, código e mensagem; status 0 = ok.
// Allowlist vazia libera qualquer contato ou grupo; com itens, só eles.
func (s *Server) checkSend(req sendRequest) (string, int, string, string) {
	if !s.opts.EnableSend {
		return "", http.StatusForbidden, "send_disabled", "O envio está desligado nesta ponte."
	}
	jid, ok := config.NormalizeRecipient(req.Recipient)
	if !ok {
		return "", http.StatusBadRequest, "bad_request", "recipient precisa ser um número com DDI ou um JID."
	}
	if len(s.allowlist) > 0 && !s.allowlist[jid] {
		return "", http.StatusForbidden, "recipient_not_allowed", "Destinatário fora da lista permitida."
	}
	if n := utf8.RuneCountInString(req.Text); strings.TrimSpace(req.Text) == "" || n > maxSendRunes || !utf8.ValidString(req.Text) {
		return "", http.StatusBadRequest, "bad_request", "text precisa ter de 1 a 4096 caracteres."
	}
	if len(req.ReplyTo) > maxReplyToLen {
		return "", http.StatusBadRequest, "bad_request", "reply_to precisa ter até 200 caracteres."
	}
	return jid, 0, "", ""
}

// handleSend responde POST /send.
func (s *Server) handleSend(w http.ResponseWriter, r *http.Request) {
	var req sendRequest
	if !s.opts.EnableSend {
		writeError(w, http.StatusForbidden, "send_disabled", "O envio está desligado nesta ponte.")
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

// resolveQuote busca a mensagem citada na mesma conversa; ausente responde 404 sem gastar a cota de envios.
func (s *Server) resolveQuote(w http.ResponseWriter, r *http.Request, out *wa.Outgoing, replyTo string) bool {
	if replyTo == "" {
		return true
	}
	q, err := s.st().GetQuoted(r.Context(), out.To, replyTo)
	switch {
	case errors.Is(err, store.ErrNotFound):
		writeError(w, http.StatusNotFound, "quoted_not_found", "Mensagem citada não encontrada nesta conversa.")
		return false
	case err != nil:
		s.internalError(w, "quote", err)
		return false
	}
	out.Quote = &q
	return true
}

// reserveSend aplica o limite por hora; responde 429 quando estourado.
func (s *Server) reserveSend(w http.ResponseWriter, r *http.Request) bool {
	ok, wait, err := s.st().ReserveSend(r.Context(), s.opts.Now(), s.opts.SendMaxPerHour)
	if err != nil {
		s.internalError(w, "rate limit", err)
		return false
	}
	if !ok {
		w.Header().Set("Retry-After", strconv.Itoa(wait))
		writeJSON(w, http.StatusTooManyRequests, map[string]any{"error": "rate_limited", "retry_after_seconds": wait,
			"message": "Limite de envios por hora atingido."})
	}
	return ok
}

// deliverSend envia de fato e responde com id e horário.
func (s *Server) deliverSend(w http.ResponseWriter, r *http.Request, out wa.Outgoing) {
	sent, err := s.client().SendText(r.Context(), out)
	switch {
	case errors.Is(err, wa.ErrNotConnected):
		writeError(w, http.StatusServiceUnavailable, "not_connected", "O WhatsApp não está conectado.")
	case err != nil:
		s.opts.Log.Warn("envio falhou", "err", wa.Redact(err.Error()))
		writeError(w, http.StatusBadGateway, "send_failed", "O WhatsApp não aceitou a mensagem.")
	default:
		writeJSON(w, http.StatusOK, map[string]string{"id": sent.ID, "timestamp": s.formatTime(sent.Timestamp)})
	}
}
