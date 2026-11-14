package store

import (
	"context"
	"database/sql"
)

// Media is the metadata needed to show and download a media file later.
type Media struct {
	Kind          string // image, video, audio, document, sticker
	Mime          string
	Size          int64
	Filename      string
	DirectPath    string
	MediaKey      []byte
	FileSHA256    []byte
	FileEncSHA256 []byte
}

// Message is a message already converted from whatsmeow (text/caption only + media metadata).
type Message struct {
	ChatJID    string
	ID         string
	SenderJID  string
	SenderPush string
	FromMe     bool
	Timestamp  int64 // unix, seconds
	Type       string
	Text       string
	Media      *Media
}

// Chat is the chat as it arrives from events.
type Chat struct {
	JID    string
	Name   string
	LastTS int64
}

// Contact combines the address book name and the push name.
type Contact struct {
	JID      string
	FullName string
	PushName string
}

// HistoryBatch is what a history sync event produces.
type HistoryBatch struct {
	Chats    []Chat
	Messages []Message
	Contacts []Contact
}

// execer is the common part of *sql.DB and *sql.Tx.
type execer interface {
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
}

const upsertChatSQL = `INSERT INTO chats (jid, name, is_group, last_message_ts) VALUES (?, ?, ?, ?)
ON CONFLICT (jid) DO UPDATE SET
	name = CASE WHEN excluded.name <> '' THEN excluded.name ELSE chats.name END,
	last_message_ts = MAX(chats.last_message_ts, excluded.last_message_ts)`

const upsertMessageSQL = `INSERT INTO messages (chat_jid, id, sender_jid, sender_push, from_me, ts, type, text, text_fold,
	media_kind, media_mime, media_size, media_filename, media_direct_path, media_key, media_sha256, media_enc_sha256)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT (chat_jid, id) DO UPDATE SET text = excluded.text, text_fold = excluded.text_fold, type = excluded.type,
	sender_push = CASE WHEN excluded.sender_push <> '' THEN excluded.sender_push ELSE messages.sender_push END`

const upsertContactSQL = `INSERT INTO contacts (jid, full_name, push_name) VALUES (?, ?, ?)
ON CONFLICT (jid) DO UPDATE SET
	full_name = CASE WHEN excluded.full_name <> '' THEN excluded.full_name ELSE contacts.full_name END,
	push_name = CASE WHEN excluded.push_name <> '' THEN excluded.push_name ELSE contacts.push_name END`

// upsertChat creates or updates the chat without erasing a known name or moving the date backwards.
func upsertChat(ctx context.Context, ex execer, c Chat) error {
	_, err := ex.ExecContext(ctx, upsertChatSQL, c.JID, c.Name, IsGroupJID(c.JID), c.LastTS)
	return err
}

// upsertMessage stores the message (history repeats only update the text).
func upsertMessage(ctx context.Context, ex execer, m Message) error {
	md := m.Media
	if md == nil {
		md = &Media{}
	}
	_, err := ex.ExecContext(ctx, upsertMessageSQL, m.ChatJID, m.ID, m.SenderJID, m.SenderPush, m.FromMe, m.Timestamp,
		m.Type, m.Text, Fold(m.Text), nullIfEmpty(md.Kind), nullIfEmpty(md.Mime), md.Size, nullIfEmpty(md.Filename),
		nullIfEmpty(md.DirectPath), md.MediaKey, md.FileSHA256, md.FileEncSHA256)
	return err
}

// upsertContact stores names without erasing known ones.
func upsertContact(ctx context.Context, ex execer, c Contact) error {
	if c.FullName == "" && c.PushName == "" {
		return nil
	}
	_, err := ex.ExecContext(ctx, upsertContactSQL, c.JID, c.FullName, c.PushName)
	return err
}

// nullIfEmpty converts "" to NULL.
func nullIfEmpty(s string) any {
	if s == "" {
		return nil
	}
	return s
}

// SaveMessage stores a new message and updates the chat and the sender's push name.
func (s *Store) SaveMessage(ctx context.Context, m Message) error {
	return s.SaveHistory(ctx, HistoryBatch{Messages: []Message{m}})
}

// SaveHistory stores a batch (chats, messages, contacts) in one transaction.
func (s *Store) SaveHistory(ctx context.Context, b HistoryBatch) error {
	return s.inTx(ctx, func(tx *sql.Tx) error {
		for _, c := range b.Chats {
			if err := upsertChat(ctx, tx, c); err != nil {
				return err
			}
		}
		for _, c := range b.Contacts {
			if err := upsertContact(ctx, tx, c); err != nil {
				return err
			}
		}
		return saveMessages(ctx, tx, b.Messages)
	})
}

// saveMessages stores each message with its chat and the sender's push name.
func saveMessages(ctx context.Context, tx *sql.Tx, msgs []Message) error {
	for _, m := range msgs {
		if err := upsertChat(ctx, tx, Chat{JID: m.ChatJID, LastTS: m.Timestamp}); err != nil {
			return err
		}
		if err := upsertMessage(ctx, tx, m); err != nil {
			return err
		}
		if !m.FromMe && m.SenderJID != "" {
			if err := upsertContact(ctx, tx, Contact{JID: m.SenderJID, PushName: m.SenderPush}); err != nil {
				return err
			}
		}
	}
	return nil
}

// UpsertContacts stores contact names (address book, push names).
func (s *Store) UpsertContacts(ctx context.Context, cs []Contact) error {
	return s.SaveHistory(ctx, HistoryBatch{Contacts: cs})
}

// SetChatName sets a chat's name (e.g. a group name).
func (s *Store) SetChatName(ctx context.Context, jid, name string) error {
	return upsertChat(ctx, s.db, Chat{JID: jid, Name: name})
}

// EditMessage replaces the text of an edited message.
func (s *Store) EditMessage(ctx context.Context, chatJID, id, text string) error {
	_, err := s.db.ExecContext(ctx, `UPDATE messages SET text = ?, text_fold = ? WHERE chat_jid = ? AND id = ?`,
		text, Fold(text), chatJID, id)
	return err
}

// DeleteMessage removes a message deleted for everyone.
func (s *Store) DeleteMessage(ctx context.Context, chatJID, id string) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM messages WHERE chat_jid = ? AND id = ?`, chatJID, id)
	return err
}

// inTx runs fn in a transaction, with commit or rollback.
func (s *Store) inTx(ctx context.Context, fn func(*sql.Tx) error) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}
	return tx.Commit()
}
