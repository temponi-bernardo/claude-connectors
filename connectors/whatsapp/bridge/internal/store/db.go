// Package store keeps chats, messages, contacts and sends in messages.db (SQLite, pure Go driver).
package store

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"net/url"
	"os"
	"sync"

	"modernc.org/sqlite"
)

// DriverName is the name of the modernc.org/sqlite driver in database/sql.
const DriverName = "sqlite"

const foldFunc = "wa_fold"

var registerOnce sync.Once

// registerFold registers the SQL function wa_fold(text) once in the driver.
func registerFold() {
	registerOnce.Do(func() {
		err := sqlite.RegisterDeterministicScalarFunction(foldFunc, 1, func(_ *sqlite.FunctionContext, args []driver.Value) (driver.Value, error) {
			s, _ := args[0].(string)
			return Fold(s), nil
		})
		if err != nil {
			panic(err)
		}
	})
}

// DSN builds the connection string with WAL, busy timeout, foreign keys and a small cache (256 MiB of RAM).
func DSN(path string) string {
	q := url.Values{}
	for _, p := range []string{"busy_timeout(10000)", "journal_mode(WAL)", "foreign_keys(1)", "synchronous(NORMAL)", "cache_size(-2000)", "temp_store(FILE)"} {
		q.Add("_pragma", p)
	}
	return "file:" + path + "?" + q.Encode()
}

// OpenDB opens a SQLite database at path with the bridge's default pragmas.
func OpenDB(path string) (*sql.DB, error) {
	registerFold()
	db, err := sql.Open(DriverName, DSN(path))
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(4)
	db.SetMaxIdleConns(2)
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}
	return db, nil
}

// VacuumInto writes to dst a consistent, compact copy of the database, with a normalized header.
func VacuumInto(ctx context.Context, db *sql.DB, dst string) error {
	if _, err := db.ExecContext(ctx, "VACUUM INTO ?", dst); err != nil {
		return fmt.Errorf("vacuum into: %w", err)
	}
	return normalizeHeaderFile(dst)
}

// sqliteMagic starts every SQLite file.
const sqliteMagic = "SQLite format 3\x00"

// normalizeHeader resets, in the 100-byte header, what changes without changing the content: format version
// (WAL/legacy, bytes 18–19), change counter (24 and 92) and schema cookie (40, which VACUUM INTO
// increments). This way the same content yields the same bytes, even after a restore (pure).
func normalizeHeader(h []byte) error {
	if len(h) < 100 || string(h[:16]) != sqliteMagic {
		return errors.New("invalid SQLite header")
	}
	h[18], h[19] = 1, 1
	for _, off := range []int{24, 40, 92} {
		binary.BigEndian.PutUint32(h[off:off+4], 1)
	}
	return nil
}

// normalizeHeaderFile applies normalizeHeader to the file (nobody has the copied database open yet).
func normalizeHeaderFile(path string) error {
	f, err := os.OpenFile(path, os.O_RDWR, 0)
	if err != nil {
		return err
	}
	defer f.Close()
	h := make([]byte, 100)
	if _, err := io.ReadFull(f, h); err != nil {
		return err
	}
	if err := normalizeHeader(h); err != nil {
		return err
	}
	_, err = f.WriteAt(h, 0)
	return err
}

// Store is the access to messages.db.
type Store struct {
	db     *sql.DB
	sendMu sync.Mutex
}

// Open opens (creating if needed) messages.db and applies the schema.
func Open(ctx context.Context, path string) (*Store, error) {
	db, err := OpenDB(path)
	if err != nil {
		return nil, err
	}
	if _, err := db.ExecContext(ctx, schema); err != nil {
		db.Close()
		return nil, fmt.Errorf("schema: %w", err)
	}
	return &Store{db: db}, nil
}

// DB exposes the *sql.DB (used by the snapshot).
func (s *Store) DB() *sql.DB { return s.db }

// Close closes the database.
func (s *Store) Close() error { return s.db.Close() }

const schema = `
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT OR IGNORE INTO meta (key, value) VALUES ('schema_version', '1');
CREATE TABLE IF NOT EXISTS chats (
	jid TEXT PRIMARY KEY,
	name TEXT NOT NULL DEFAULT '',
	is_group INTEGER NOT NULL DEFAULT 0,
	last_message_ts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS chats_by_last ON chats (last_message_ts DESC, jid DESC);
CREATE TABLE IF NOT EXISTS messages (
	chat_jid TEXT NOT NULL,
	id TEXT NOT NULL,
	sender_jid TEXT NOT NULL DEFAULT '',
	sender_push TEXT NOT NULL DEFAULT '',
	from_me INTEGER NOT NULL DEFAULT 0,
	ts INTEGER NOT NULL,
	type TEXT NOT NULL,
	text TEXT NOT NULL DEFAULT '',
	text_fold TEXT NOT NULL DEFAULT '', -- Fold(text): case/accent-insensitive search with native LIKE (8x faster than a Go function)
	media_kind TEXT,
	media_mime TEXT,
	media_size INTEGER,
	media_filename TEXT,
	media_direct_path TEXT,
	media_key BLOB,
	media_sha256 BLOB,
	media_enc_sha256 BLOB,
	PRIMARY KEY (chat_jid, id)
);
CREATE INDEX IF NOT EXISTS messages_by_chat_ts ON messages (chat_jid, ts DESC, id DESC);
CREATE INDEX IF NOT EXISTS messages_by_ts ON messages (ts DESC);
CREATE TABLE IF NOT EXISTS contacts (
	jid TEXT PRIMARY KEY,
	full_name TEXT NOT NULL DEFAULT '',
	push_name TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS sends (id INTEGER PRIMARY KEY, ts INTEGER NOT NULL);
`
