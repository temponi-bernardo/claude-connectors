package api

import (
	"net/http"
	"strconv"
	"time"
	"unicode/utf8"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// lastMessageJSON é o resumo da última mensagem de uma conversa.
type lastMessageJSON struct {
	FromMe     bool   `json:"from_me"`
	SenderName string `json:"sender_name"`
	Text       string `json:"text"`
	Type       string `json:"type"`
}

// chatJSON é uma conversa na resposta de /chats.
type chatJSON struct {
	JID           string           `json:"jid"`
	Name          string           `json:"name"`
	IsGroup       bool             `json:"is_group"`
	LastMessageAt *string          `json:"last_message_at"`
	LastMessage   *lastMessageJSON `json:"last_message"`
}

// mediaJSON são os metadados públicos de mídia.
type mediaJSON struct {
	Mime     string  `json:"mime"`
	Size     int64   `json:"size"`
	Filename *string `json:"filename"`
}

// messageJSON é uma mensagem em /messages e /search.
type messageJSON struct {
	ID         string     `json:"id"`
	ChatJID    string     `json:"chat_jid"`
	ChatName   *string    `json:"chat_name,omitempty"`
	SenderJID  string     `json:"sender_jid"`
	SenderName string     `json:"sender_name"`
	FromMe     bool       `json:"from_me"`
	Timestamp  string     `json:"timestamp"`
	Type       string     `json:"type"`
	Text       string     `json:"text"`
	Media      *mediaJSON `json:"media,omitempty"`
}

// formatTime converte unix em RFC 3339 com o fuso configurado.
func (s *Server) formatTime(t time.Time) string {
	return t.In(s.opts.Location).Format(time.RFC3339)
}

// formatUnix é formatTime para segundos unix; 0 vira null.
func (s *Server) formatUnix(ts int64) *string {
	if ts <= 0 {
		return nil
	}
	v := s.formatTime(time.Unix(ts, 0))
	return &v
}

// toChatJSON converte uma conversa do banco.
func (s *Server) toChatJSON(c store.ChatView) chatJSON {
	out := chatJSON{JID: c.JID, Name: c.Name, IsGroup: c.IsGroup, LastMessageAt: s.formatUnix(c.LastTS)}
	if c.Last != nil {
		out.LastMessage = &lastMessageJSON{FromMe: c.Last.FromMe, SenderName: c.Last.SenderName, Text: c.Last.Text, Type: c.Last.Type}
	}
	return out
}

// toMessageJSON converte uma mensagem do banco; withChat inclui chat_name (busca).
func (s *Server) toMessageJSON(m store.MessageView, withChat bool) messageJSON {
	out := messageJSON{ID: m.ID, ChatJID: m.ChatJID, SenderJID: m.SenderJID, SenderName: m.SenderName, FromMe: m.FromMe,
		Timestamp: s.formatTime(time.Unix(m.Timestamp, 0)), Type: m.Type, Text: m.Text}
	if withChat {
		out.ChatName = &m.ChatName
	}
	if m.Media != nil {
		out.Media = &mediaJSON{Mime: m.Media.Mime, Size: m.Media.Size, Filename: nilIfEmpty(m.Media.Filename)}
	}
	return out
}

// toMessagesJSON converte uma lista de mensagens (nunca devolve null).
func (s *Server) toMessagesJSON(msgs []store.MessageView, withChat bool) []messageJSON {
	out := make([]messageJSON, 0, len(msgs))
	for _, m := range msgs {
		out = append(out, s.toMessageJSON(m, withChat))
	}
	return out
}

// nilIfEmpty devolve nil para "".
func nilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// encodeNext serializa o cursor da próxima página (null no fim).
func encodeNext(c *store.Cursor) *string {
	if c == nil {
		return nil
	}
	v := store.EncodeCursor(*c)
	return &v
}

// parseLimit lê limit (1–100) com padrão.
func parseLimit(r *http.Request, def int) (int, bool) {
	v := r.URL.Query().Get("limit")
	if v == "" {
		return def, true
	}
	n, err := strconv.Atoi(v)
	return n, err == nil && n >= 1 && n <= 100
}

// parseQuery lê query com tamanho máximo; required exige não vazio.
func parseQuery(r *http.Request, required bool) (string, bool) {
	q := r.URL.Query().Get("query")
	n := utf8.RuneCountInString(q)
	return q, utf8.ValidString(q) && n <= maxQueryLen && (!required || n >= 1)
}

// maxQueryLen é o tamanho máximo de busca (API.md: 1–200 caracteres).
const maxQueryLen = 200

// validJID faz uma checagem barata de formato de JID vindo da query.
func validJID(jid string) bool {
	return len(jid) >= 3 && len(jid) <= 128 && utf8.ValidString(jid) && containsAt(jid)
}

// containsAt diz se há exatamente um "@" que não está nas pontas.
func containsAt(s string) bool {
	i := -1
	for idx, r := range s {
		if r == '@' {
			if i >= 0 {
				return false
			}
			i = idx
		}
	}
	return i > 0 && i < len(s)-1
}
