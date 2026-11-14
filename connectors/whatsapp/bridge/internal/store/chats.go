package store

import (
	"context"
	"database/sql"
)

// chatSelect lista conversas com a última mensagem (pela rowid do índice por conversa) e nomes resolvidos.
const chatSelect = `SELECT c.jid, c.name, COALESCE(ct.full_name, ''), COALESCE(ct.push_name, ''), c.is_group, c.last_message_ts,
	m.id, m.from_me, m.sender_jid, m.type, m.text, COALESCE(sc.full_name, ''), COALESCE(sc.push_name, ''), m.sender_push
FROM chats c
LEFT JOIN contacts ct ON ct.jid = c.jid
LEFT JOIN messages m ON m.rowid = (SELECT rowid FROM messages WHERE chat_jid = c.jid ORDER BY ts DESC, id DESC LIMIT 1)
LEFT JOIN contacts sc ON sc.jid = m.sender_jid
WHERE (? = '' OR wa_fold(c.name) LIKE ? ESCAPE '\' OR wa_fold(ct.full_name) LIKE ? ESCAPE '\'
	OR wa_fold(ct.push_name) LIKE ? ESCAPE '\' OR (? <> '' AND c.jid LIKE ?))
AND (? = 0 OR c.last_message_ts < ? OR (c.last_message_ts = ? AND c.jid < ?))
ORDER BY c.last_message_ts DESC, c.jid DESC LIMIT ?`

// chatQueryArgs monta os parâmetros de chatSelect (função pura).
func chatQueryArgs(query string, limit int, after *Cursor) []any {
	pat, digits := ContainsPattern(query), searchDigits(query)
	has, ts, key := cursorArgs(after)
	return []any{query, pat, pat, pat, digits, "%" + digits + "%", has, ts, ts, key, limit + 1}
}

// ListChats devolve conversas pela última mensagem (mais recente primeiro), filtrando por nome ou número.
func (s *Store) ListChats(ctx context.Context, query string, limit int, after *Cursor) ([]ChatView, *Cursor, error) {
	rows, err := s.db.QueryContext(ctx, chatSelect, chatQueryArgs(query, limit, after)...)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	var out []ChatView
	for rows.Next() {
		c, err := scanChat(rows)
		if err != nil {
			return nil, nil, err
		}
		out = append(out, c)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, err
	}
	page, next := splitPage(out, limit, func(c ChatView) Cursor { return Cursor{TS: c.LastTS, Key: c.JID} })
	return page, next, nil
}

// scanChat lê uma linha de chatSelect.
func scanChat(sc scanner) (ChatView, error) {
	var c ChatView
	var name, full, push string
	var id, sender, typ, text, sFull, sPush, mPush sql.NullString
	var fromMe sql.NullBool
	err := sc.Scan(&c.JID, &name, &full, &push, &c.IsGroup, &c.LastTS,
		&id, &fromMe, &sender, &typ, &text, &sFull, &sPush, &mPush)
	if err != nil {
		return c, err
	}
	c.Name = displayName(c.JID, name, full, push)
	if id.Valid {
		c.Last = &MessageView{ID: id.String, ChatJID: c.JID, FromMe: fromMe.Bool, SenderJID: sender.String,
			Type: typ.String, Text: Clean(text.String),
			SenderName: senderName(fromMe.Bool, sender.String, sFull.String, sPush.String, mPush.String)}
	}
	return c, nil
}

// SearchContacts busca pessoas (não grupos) por nome salvo, push name ou número.
func (s *Store) SearchContacts(ctx context.Context, query string, limit int) ([]ContactView, error) {
	pat, digits := ContainsPattern(query), searchDigits(query)
	rows, err := s.db.QueryContext(ctx, `SELECT jid, full_name, push_name FROM contacts
		WHERE jid NOT LIKE '%@g.us' AND (wa_fold(full_name) LIKE ? ESCAPE '\' OR wa_fold(push_name) LIKE ? ESCAPE '\'
			OR (? <> '' AND jid LIKE ?))
		ORDER BY full_name = '', full_name, push_name, jid LIMIT ?`, pat, pat, digits, "%"+digits+"%", limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []ContactView
	for rows.Next() {
		var c ContactView
		if err := rows.Scan(&c.JID, &c.Name, &c.PushName); err != nil {
			return nil, err
		}
		c.Name, c.PushName, c.Phone = Clean(c.Name), Clean(c.PushName), PhoneFromJID(c.JID)
		out = append(out, c)
	}
	return out, rows.Err()
}

// searchDigits devolve os dígitos da busca quando são pelo menos 3 (senão "", e o número não é filtrado).
func searchDigits(query string) string {
	if d := Digits(query); len(d) >= 3 {
		return d
	}
	return ""
}
