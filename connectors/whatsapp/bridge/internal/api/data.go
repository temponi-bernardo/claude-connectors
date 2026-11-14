package api

import (
	"context"
	"errors"
	"mime"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

// statusJSON é o corpo de /status e /sync/wait.
type statusJSON struct {
	Phase               string  `json:"phase"`
	Connected           bool    `json:"connected"`
	LoggedIn            bool    `json:"logged_in"`
	NeedsPairing        bool    `json:"needs_pairing"`
	Account             *string `json:"account"`
	OfflineSyncComplete bool    `json:"offline_sync_complete"`
	LastEventAt         *string `json:"last_event_at"`
	Chats               int64   `json:"chats"`
	Messages            int64   `json:"messages"`
	SendEnabled         bool    `json:"send_enabled"`
	Partial             bool    `json:"partial,omitempty"`
}

// buildStatus junta fase, estado do cliente e contagens do banco.
func (s *Server) buildStatus(ctx context.Context) (statusJSON, error) {
	st := s.client().State()
	chats, msgs, err := s.st().Counts(ctx)
	out := statusJSON{Phase: s.b.Phase(), Connected: st.Connected, LoggedIn: st.LoggedIn, NeedsPairing: st.NeedsPairing,
		Account: nilIfEmpty(st.Account), OfflineSyncComplete: st.OfflineSyncComplete, Chats: chats, Messages: msgs,
		SendEnabled: s.opts.EnableSend}
	if !st.LastEventAt.IsZero() {
		v := s.formatTime(st.LastEventAt)
		out.LastEventAt = &v
	}
	return out, err
}

// handleStatus responde GET /status.
func (s *Server) handleStatus(w http.ResponseWriter, r *http.Request) {
	out, err := s.buildStatus(r.Context())
	if err != nil {
		s.internalError(w, "status", err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

// Limites de POST /sync/wait.
const (
	defaultSyncWait = 10 * time.Second
	maxSyncWait     = 20 * time.Second
	syncPoll        = 250 * time.Millisecond
)

// parseWait lê timeout_ms (padrão 10000, teto 20000).
func parseWait(v string) (time.Duration, bool) {
	if v == "" {
		return defaultSyncWait, true
	}
	n, err := strconv.Atoi(v)
	if err != nil || n < 0 {
		return 0, false
	}
	return min(time.Duration(n)*time.Millisecond, maxSyncWait), true
}

// syncDone decide se a espera acabou: sincronizado ou precisando parear (função pura).
func syncDone(st wa.State) bool {
	return st.NeedsPairing || (st.Connected && st.OfflineSyncComplete)
}

// handleSyncWait espera a sincronização offline terminar (ou o tempo acabar).
func (s *Server) handleSyncWait(w http.ResponseWriter, r *http.Request) {
	wait, ok := parseWait(r.URL.Query().Get("timeout_ms"))
	if !ok {
		badRequest(w, "timeout_ms precisa ser um inteiro não negativo.")
		return
	}
	partial := !s.waitSync(r.Context(), wait)
	out, err := s.buildStatus(r.Context())
	if err != nil {
		s.internalError(w, "sync/wait", err)
		return
	}
	out.Partial = partial
	writeJSON(w, http.StatusOK, out)
}

// waitSync faz polling do estado até syncDone ou o prazo; devolve se terminou.
func (s *Server) waitSync(ctx context.Context, wait time.Duration) bool {
	deadline := time.Now().Add(wait)
	for {
		if syncDone(s.client().State()) {
			return true
		}
		if time.Now().After(deadline) {
			return false
		}
		select {
		case <-ctx.Done():
			return false
		case <-time.After(syncPoll):
		}
	}
}

// handleChats responde GET /chats.
func (s *Server) handleChats(w http.ResponseWriter, r *http.Request) {
	limit, okL := parseLimit(r, 20)
	query, okQ := parseQuery(r, false)
	cursor, err := store.DecodeCursor(r.URL.Query().Get("cursor"))
	if !okL || !okQ || err != nil {
		badRequest(w, "Parâmetros inválidos (limit 1–100, query até 200 caracteres, cursor da página anterior).")
		return
	}
	chats, next, err := s.st().ListChats(r.Context(), query, limit, cursor)
	if err != nil {
		s.internalError(w, "chats", err)
		return
	}
	out := make([]chatJSON, 0, len(chats))
	for _, c := range chats {
		out = append(out, s.toChatJSON(c))
	}
	writeJSON(w, http.StatusOK, map[string]any{"chats": out, "next_cursor": encodeNext(next)})
}

// handleMessages responde GET /messages.
func (s *Server) handleMessages(w http.ResponseWriter, r *http.Request) {
	jid := r.URL.Query().Get("chat_jid")
	limit, okL := parseLimit(r, 30)
	before, err := store.DecodeCursor(r.URL.Query().Get("before"))
	if !validJID(jid) || !okL || err != nil {
		badRequest(w, "Parâmetros inválidos (chat_jid obrigatório, limit 1–100, before da página anterior).")
		return
	}
	chat, err := s.st().GetChat(r.Context(), jid)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "chat_not_found", "Conversa não encontrada.")
		return
	}
	msgs, next, err2 := s.st().ListMessages(r.Context(), jid, limit, before)
	if err = errors.Join(err, err2); err != nil {
		s.internalError(w, "messages", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"chat": map[string]any{"jid": chat.JID, "name": chat.Name, "is_group": chat.IsGroup},
		"messages": s.toMessagesJSON(msgs, false), "next_before": encodeNext(next)})
}

// handleSearch responde GET /search.
func (s *Server) handleSearch(w http.ResponseWriter, r *http.Request) {
	query, okQ := parseQuery(r, true)
	limit, okL := parseLimit(r, 20)
	jid := r.URL.Query().Get("chat_jid")
	if !okQ || !okL || (jid != "" && !validJID(jid)) {
		badRequest(w, "Parâmetros inválidos (query de 1 a 200 caracteres, limit 1–100).")
		return
	}
	msgs, err := s.st().SearchMessages(r.Context(), query, jid, limit)
	if err != nil {
		s.internalError(w, "search", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"messages": s.toMessagesJSON(msgs, true)})
}

// contactJSON é um contato em /contacts.
type contactJSON struct {
	JID      string  `json:"jid"`
	Name     *string `json:"name"`
	PushName *string `json:"push_name"`
	Phone    *string `json:"phone"`
}

// handleContacts responde GET /contacts.
func (s *Server) handleContacts(w http.ResponseWriter, r *http.Request) {
	query, okQ := parseQuery(r, true)
	limit, okL := parseLimit(r, 20)
	if !okQ || !okL {
		badRequest(w, "Parâmetros inválidos (query de 1 a 200 caracteres, limit 1–100).")
		return
	}
	cs, err := s.st().SearchContacts(r.Context(), query, limit)
	if err != nil {
		s.internalError(w, "contacts", err)
		return
	}
	out := make([]contactJSON, 0, len(cs))
	for _, c := range cs {
		out = append(out, contactJSON{JID: c.JID, Name: nilIfEmpty(c.Name), PushName: nilIfEmpty(c.PushName), Phone: nilIfEmpty(c.Phone)})
	}
	writeJSON(w, http.StatusOK, map[string]any{"contacts": out})
}

// handleMedia responde GET /media com os bytes da mídia.
func (s *Server) handleMedia(w http.ResponseWriter, r *http.Request) {
	jid, id := r.URL.Query().Get("chat_jid"), r.URL.Query().Get("message_id")
	if !validJID(jid) || id == "" || len(id) > 128 {
		badRequest(w, "chat_jid e message_id são obrigatórios.")
		return
	}
	md, err := s.st().GetMedia(r.Context(), jid, id)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "Mensagem não encontrada ou sem mídia.")
		return
	} else if err != nil {
		s.internalError(w, "media", err)
		return
	}
	if md.Size > s.opts.MaxMediaBytes {
		writeError(w, http.StatusRequestEntityTooLarge, "too_large", "A mídia passa do limite configurado.")
		return
	}
	s.sendMedia(w, r, md)
}

// sendMedia baixa a mídia e grava a resposta.
func (s *Server) sendMedia(w http.ResponseWriter, r *http.Request, md store.Media) {
	data, err := s.client().Download(r.Context(), md)
	switch {
	case errors.Is(err, wa.ErrMediaExpired):
		writeError(w, http.StatusGone, "media_expired", "O WhatsApp não tem mais este arquivo.")
		return
	case errors.Is(err, wa.ErrNotConnected):
		writeError(w, http.StatusServiceUnavailable, "not_connected", "O WhatsApp não está conectado.")
		return
	case err != nil:
		s.opts.Log.Warn("download de mídia falhou", "err", wa.Redact(err.Error()))
		writeError(w, http.StatusBadGateway, "download_failed", "Não foi possível baixar a mídia.")
		return
	case int64(len(data)) > s.opts.MaxMediaBytes:
		writeError(w, http.StatusRequestEntityTooLarge, "too_large", "A mídia passa do limite configurado.")
		return
	}
	writeMediaHeaders(w.Header(), md, len(data))
	_, _ = w.Write(data)
}

// writeMediaHeaders define tipo, tamanho e nome do arquivo (percent-encoded em UTF-8).
func writeMediaHeaders(h http.Header, md store.Media, size int) {
	h.Set("Content-Type", safeMime(md.Mime))
	h.Set("Content-Length", strconv.Itoa(size))
	h.Set("X-Content-Type-Options", "nosniff")
	if name := store.Clean(md.Filename); name != "" {
		h.Set("X-Media-Filename", url.PathEscape(name))
	}
}

// safeMime aceita só tipos MIME bem formados; o resto vira application/octet-stream.
func safeMime(v string) string {
	if t, params, err := mime.ParseMediaType(v); err == nil {
		return mime.FormatMediaType(t, params)
	}
	return "application/octet-stream"
}
