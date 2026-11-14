package store

import (
	"context"
	"database/sql"
)

// Media são os metadados necessários para mostrar e baixar uma mídia depois.
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

// Message é uma mensagem já convertida do whatsmeow (só texto/legenda + metadados de mídia).
type Message struct {
	ChatJID    string
	ID         string
	SenderJID  string
	SenderPush string
	FromMe     bool
	Timestamp  int64 // unix, segundos
	Type       string
	Text       string
	Media      *Media
}

// Chat é a conversa como chega dos eventos.
type Chat struct {
	JID    string
	Name   string
	LastTS int64
}

// Contact junta nome salvo na agenda e push name.
type Contact struct {
	JID      string
	FullName string
	PushName string
}

// HistoryBatch é o que um evento de sincronização de histórico produz.
type HistoryBatch struct {
	Chats    []Chat
	Messages []Message
	Contacts []Contact
}

// execer é o pedaço comum de *sql.DB e *sql.Tx.
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

// upsertChat cria ou atualiza a conversa sem apagar nome conhecido nem regredir a data.
func upsertChat(ctx context.Context, ex execer, c Chat) error {
	_, err := ex.ExecContext(ctx, upsertChatSQL, c.JID, c.Name, IsGroupJID(c.JID), c.LastTS)
	return err
}

// upsertMessage grava a mensagem (repetições do histórico só atualizam o texto).
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

// upsertContact grava nomes sem apagar os já conhecidos.
func upsertContact(ctx context.Context, ex execer, c Contact) error {
	if c.FullName == "" && c.PushName == "" {
		return nil
	}
	_, err := ex.ExecContext(ctx, upsertContactSQL, c.JID, c.FullName, c.PushName)
	return err
}

// nullIfEmpty converte "" em NULL.
func nullIfEmpty(s string) any {
	if s == "" {
		return nil
	}
	return s
}

// SaveMessage grava uma mensagem nova e atualiza a conversa e o push name do remetente.
func (s *Store) SaveMessage(ctx context.Context, m Message) error {
	return s.SaveHistory(ctx, HistoryBatch{Messages: []Message{m}})
}

// SaveHistory grava um lote (conversas, mensagens, contatos) numa transação.
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

// saveMessages grava cada mensagem com sua conversa e o push name do remetente.
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

// UpsertContacts grava nomes de contatos (agenda, push names).
func (s *Store) UpsertContacts(ctx context.Context, cs []Contact) error {
	return s.SaveHistory(ctx, HistoryBatch{Contacts: cs})
}

// SetChatName define o nome de uma conversa (ex.: nome de grupo).
func (s *Store) SetChatName(ctx context.Context, jid, name string) error {
	return upsertChat(ctx, s.db, Chat{JID: jid, Name: name})
}

// EditMessage troca o texto de uma mensagem editada.
func (s *Store) EditMessage(ctx context.Context, chatJID, id, text string) error {
	_, err := s.db.ExecContext(ctx, `UPDATE messages SET text = ?, text_fold = ? WHERE chat_jid = ? AND id = ?`,
		text, Fold(text), chatJID, id)
	return err
}

// DeleteMessage remove uma mensagem apagada para todos.
func (s *Store) DeleteMessage(ctx context.Context, chatJID, id string) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM messages WHERE chat_jid = ? AND id = ?`, chatJID, id)
	return err
}

// inTx roda fn numa transação, com commit ou rollback.
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
