package api

import (
	"net/http"
	"strconv"
	"time"
	"unicode/utf8"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// lastMessageJSON summarizes the last message of a chat.
type lastMessageJSON struct {
	FromMe     bool   `json:"from_me"`
	SenderName string `json:"sender_name"`
	Text       string `json:"text"`
	Type       string `json:"type"`
}

// chatJSON is a chat in the /chats response.
type chatJSON struct {
	JID           string           `json:"jid"`
	Name          string           `json:"name"`
	IsGroup       bool             `json:"is_group"`
	LastMessageAt *string          `json:"last_message_at"`
	LastMessage   *lastMessageJSON `json:"last_message"`
}

// mediaJSON is the public media metadata.
type mediaJSON struct {
	Mime     string  `json:"mime"`
	Size     int64   `json:"size"`
	Filename *string `json:"filename"`
}

// messageJSON is a message in /messages and /search.
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

// formatTime converts to RFC 3339 in the configured time zone.
func (s *Server) formatTime(t time.Time) string {
	return t.In(s.opts.Location).Format(time.RFC3339)
}

// formatUnix is formatTime for unix seconds; 0 becomes null.
func (s *Server) formatUnix(ts int64) *string {
	if ts <= 0 {
		return nil
	}
	v := s.formatTime(time.Unix(ts, 0))
	return &v
}

// toChatJSON converts a chat from the database.
func (s *Server) toChatJSON(c store.ChatView) chatJSON {
	out := chatJSON{JID: c.JID, Name: c.Name, IsGroup: c.IsGroup, LastMessageAt: s.formatUnix(c.LastTS)}
	if c.Last != nil {
		out.LastMessage = &lastMessageJSON{FromMe: c.Last.FromMe, SenderName: c.Last.SenderName, Text: c.Last.Text, Type: c.Last.Type}
	}
	return out
}

// toMessageJSON converts a message from the database; withChat includes chat_name (search).
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

// toMessagesJSON converts a list of messages (never returns null).
func (s *Server) toMessagesJSON(msgs []store.MessageView, withChat bool) []messageJSON {
	out := make([]messageJSON, 0, len(msgs))
	for _, m := range msgs {
		out = append(out, s.toMessageJSON(m, withChat))
	}
	return out
}

// nilIfEmpty returns nil for "".
func nilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// encodeNext serializes the next-page cursor (null at the end).
func encodeNext(c *store.Cursor) *string {
	if c == nil {
		return nil
	}
	v := store.EncodeCursor(*c)
	return &v
}

// parseLimit reads limit (1–100) with a default.
func parseLimit(r *http.Request, def int) (int, bool) {
	v := r.URL.Query().Get("limit")
	if v == "" {
		return def, true
	}
	n, err := strconv.Atoi(v)
	return n, err == nil && n >= 1 && n <= 100
}

// parseQuery reads query with a maximum length; required demands a non-empty value.
func parseQuery(r *http.Request, required bool) (string, bool) {
	q := r.URL.Query().Get("query")
	n := utf8.RuneCountInString(q)
	return q, utf8.ValidString(q) && n <= maxQueryLen && (!required || n >= 1)
}

// maxQueryLen is the maximum search length (API.md: 1–200 characters).
const maxQueryLen = 200

// validJID is a cheap format check for a JID coming from the query.
func validJID(jid string) bool {
	return len(jid) >= 3 && len(jid) <= 128 && utf8.ValidString(jid) && containsAt(jid)
}

// containsAt reports whether there is exactly one "@" that is not at either end.
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
