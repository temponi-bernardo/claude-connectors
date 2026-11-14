package store

import (
	"context"
	"database/sql"
	"errors"
)

// ErrNotFound signals a missing chat or message.
var ErrNotFound = errors.New("not found")

// MediaInfo is the public part of the media metadata.
type MediaInfo struct {
	Mime     string
	Size     int64
	Filename string
}

// MessageView is a message ready for the API (resolved names, cleaned text).
type MessageView struct {
	ID         string
	ChatJID    string
	ChatName   string
	SenderJID  string
	SenderName string
	FromMe     bool
	Timestamp  int64
	Type       string
	Text       string
	Media      *MediaInfo
}

// ChatView is a chat ready for the API.
type ChatView struct {
	JID     string
	Name    string
	IsGroup bool
	LastTS  int64
	Last    *MessageView
}

// ContactView is a contact ready for the API.
type ContactView struct {
	JID      string
	Name     string
	PushName string
	Phone    string
}

// SelfName is the sender name shown for messages sent by the account itself.
const SelfName = "You"

// displayName picks the first non-empty name; with none, it uses the JID's phone number.
func displayName(jid string, names ...string) string {
	for _, n := range names {
		if c := Clean(n); c != "" {
			return c
		}
	}
	return PhoneFromJID(jid)
}

// senderName decides the sender name of a message.
func senderName(fromMe bool, jid string, names ...string) string {
	if fromMe {
		return SelfName
	}
	return displayName(jid, names...)
}

// messageSelect is the base message query with resolved sender and chat names.
const messageSelect = `SELECT m.id, m.chat_jid, m.sender_jid, m.from_me, m.ts, m.type, m.text,
	m.media_mime, m.media_size, m.media_filename, m.media_kind,
	COALESCE(sc.full_name, ''), COALESCE(sc.push_name, ''), m.sender_push,
	COALESCE(c.name, ''), COALESCE(cc.full_name, ''), COALESCE(cc.push_name, '')
FROM messages m
LEFT JOIN contacts sc ON sc.jid = m.sender_jid
LEFT JOIN chats c ON c.jid = m.chat_jid
LEFT JOIN contacts cc ON cc.jid = m.chat_jid `

// scanner is the common part of *sql.Row and *sql.Rows.
type scanner interface{ Scan(dest ...any) error }

// scanMessage reads one messageSelect row.
func scanMessage(sc scanner) (MessageView, error) {
	var m MessageView
	var mime, filename, kind sql.NullString
	var size sql.NullInt64
	var sFull, sPush, mPush, cName, cFull, cPush string
	err := sc.Scan(&m.ID, &m.ChatJID, &m.SenderJID, &m.FromMe, &m.Timestamp, &m.Type, &m.Text,
		&mime, &size, &filename, &kind, &sFull, &sPush, &mPush, &cName, &cFull, &cPush)
	if err != nil {
		return m, err
	}
	m.Text = Clean(m.Text)
	m.SenderName = senderName(m.FromMe, m.SenderJID, sFull, sPush, mPush)
	m.ChatName = displayName(m.ChatJID, cName, cFull, cPush)
	if kind.Valid {
		m.Media = &MediaInfo{Mime: Clean(mime.String), Size: size.Int64, Filename: Clean(filename.String)}
	}
	return m, nil
}

// queryMessages runs a message query and reads all rows.
func (s *Store) queryMessages(ctx context.Context, query string, args ...any) ([]MessageView, error) {
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []MessageView
	for rows.Next() {
		m, err := scanMessage(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, m)
	}
	return out, rows.Err()
}

// GetChat returns a chat (without its last message) or ErrNotFound.
func (s *Store) GetChat(ctx context.Context, jid string) (ChatView, error) {
	var c ChatView
	var name, full, push string
	err := s.db.QueryRowContext(ctx, `SELECT c.jid, c.name, c.is_group, c.last_message_ts,
		COALESCE(ct.full_name, ''), COALESCE(ct.push_name, '')
		FROM chats c LEFT JOIN contacts ct ON ct.jid = c.jid WHERE c.jid = ?`, jid).
		Scan(&c.JID, &name, &c.IsGroup, &c.LastTS, &full, &push)
	if errors.Is(err, sql.ErrNoRows) {
		return c, ErrNotFound
	}
	c.Name = displayName(c.JID, name, full, push)
	return c, err
}

// ListMessages returns up to limit messages of the chat, newest first, before the cursor.
// The second return value is the next-page cursor (nil at the end).
func (s *Store) ListMessages(ctx context.Context, chatJID string, limit int, before *Cursor) ([]MessageView, *Cursor, error) {
	has, ts, key := cursorArgs(before)
	msgs, err := s.queryMessages(ctx, messageSelect+`WHERE m.chat_jid = ?
		AND (? = 0 OR m.ts < ? OR (m.ts = ? AND m.id < ?))
		ORDER BY m.ts DESC, m.id DESC LIMIT ?`, chatJID, has, ts, ts, key, limit+1)
	if err != nil {
		return nil, nil, err
	}
	page, next := splitPage(msgs, limit, func(m MessageView) Cursor { return Cursor{TS: m.Timestamp, Key: m.ID} })
	return page, next, nil
}

// SearchMessages searches text (case- and accent-insensitive) in all chats or in one.
func (s *Store) SearchMessages(ctx context.Context, query, chatJID string, limit int) ([]MessageView, error) {
	return s.queryMessages(ctx, messageSelect+`WHERE (? = '' OR m.chat_jid = ?)
		AND m.text_fold LIKE ? ESCAPE '\'
		ORDER BY m.ts DESC, m.id DESC LIMIT ?`, chatJID, chatJID, ContainsPattern(query), limit)
}

// GetMedia returns a message's full media metadata, or ErrNotFound.
func (s *Store) GetMedia(ctx context.Context, chatJID, id string) (Media, error) {
	var m Media
	var kind, mime, filename, path sql.NullString
	var size sql.NullInt64
	err := s.db.QueryRowContext(ctx, `SELECT media_kind, media_mime, media_size, media_filename, media_direct_path,
		media_key, media_sha256, media_enc_sha256 FROM messages WHERE chat_jid = ? AND id = ?`, chatJID, id).
		Scan(&kind, &mime, &size, &filename, &path, &m.MediaKey, &m.FileSHA256, &m.FileEncSHA256)
	if errors.Is(err, sql.ErrNoRows) || (err == nil && (!kind.Valid || !path.Valid)) {
		return m, ErrNotFound
	}
	m.Kind, m.Mime, m.Size, m.Filename, m.DirectPath = kind.String, mime.String, size.Int64, filename.String, path.String
	return m, err
}

// Quoted is the minimum of a stored message needed to quote it in a reply.
type Quoted struct {
	ID        string
	SenderJID string
	FromMe    bool
	Text      string
}

// GetQuoted returns message id of chat chatJID to be quoted, or ErrNotFound.
func (s *Store) GetQuoted(ctx context.Context, chatJID, id string) (Quoted, error) {
	q := Quoted{ID: id}
	err := s.db.QueryRowContext(ctx, `SELECT sender_jid, from_me, text FROM messages WHERE chat_jid = ? AND id = ?`,
		chatJID, id).Scan(&q.SenderJID, &q.FromMe, &q.Text)
	if errors.Is(err, sql.ErrNoRows) {
		return q, ErrNotFound
	}
	return q, err
}

// Counts returns the total number of chats and messages.
func (s *Store) Counts(ctx context.Context) (chats, messages int64, err error) {
	err = s.db.QueryRowContext(ctx, `SELECT (SELECT COUNT(*) FROM chats), (SELECT COUNT(*) FROM messages)`).
		Scan(&chats, &messages)
	return chats, messages, err
}

// cursorArgs turns an optional cursor into the query parameters (has, ts, key).
func cursorArgs(c *Cursor) (int, int64, string) {
	if c == nil {
		return 0, 0, ""
	}
	return 1, c.TS, c.Key
}

// splitPage trims the list read with limit+1 and decides the next-page cursor.
func splitPage[T any](items []T, limit int, cursorOf func(T) Cursor) ([]T, *Cursor) {
	if len(items) <= limit {
		return items, nil
	}
	items = items[:limit]
	c := cursorOf(items[limit-1])
	return items, &c
}
