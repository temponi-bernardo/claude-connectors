// Package store guarda conversas, mensagens, contatos e envios em messages.db (SQLite, driver Go puro).
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

// DriverName é o nome do driver modernc.org/sqlite no database/sql.
const DriverName = "sqlite"

const foldFunc = "wa_fold"

var registerOnce sync.Once

// registerFold registra a função SQL wa_fold(texto) uma única vez no driver.
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

// DSN monta a string de conexão com WAL, busy timeout, chaves estrangeiras e cache pequeno (256 MiB de RAM).
func DSN(path string) string {
	q := url.Values{}
	for _, p := range []string{"busy_timeout(10000)", "journal_mode(WAL)", "foreign_keys(1)", "synchronous(NORMAL)", "cache_size(-2000)", "temp_store(FILE)"} {
		q.Add("_pragma", p)
	}
	return "file:" + path + "?" + q.Encode()
}

// OpenDB abre um banco SQLite em path com as pragmas padrão da ponte.
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

// VacuumInto grava em dst uma cópia consistente e compacta do banco, com o cabeçalho normalizado.
func VacuumInto(ctx context.Context, db *sql.DB, dst string) error {
	if _, err := db.ExecContext(ctx, "VACUUM INTO ?", dst); err != nil {
		return fmt.Errorf("vacuum into: %w", err)
	}
	return normalizeHeaderFile(dst)
}

// sqliteMagic abre todo arquivo SQLite.
const sqliteMagic = "SQLite format 3\x00"

// normalizeHeader zera no cabeçalho de 100 bytes o que muda sem mudar o conteúdo: versão de formato
// (WAL/legado, bytes 18–19), contador de mudanças (24 e 92) e schema cookie (40, que o VACUUM INTO
// incrementa). Assim o mesmo conteúdo gera os mesmos bytes, mesmo depois de restaurar (função pura).
func normalizeHeader(h []byte) error {
	if len(h) < 100 || string(h[:16]) != sqliteMagic {
		return errors.New("cabeçalho SQLite inválido")
	}
	h[18], h[19] = 1, 1
	for _, off := range []int{24, 40, 92} {
		binary.BigEndian.PutUint32(h[off:off+4], 1)
	}
	return nil
}

// normalizeHeaderFile aplica normalizeHeader no arquivo (o banco copiado ainda não está aberto por ninguém).
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

// Store é o acesso a messages.db.
type Store struct {
	db     *sql.DB
	sendMu sync.Mutex
}

// Open abre (criando se preciso) messages.db e aplica o esquema.
func Open(ctx context.Context, path string) (*Store, error) {
	db, err := OpenDB(path)
	if err != nil {
		return nil, err
	}
	if _, err := db.ExecContext(ctx, schema); err != nil {
		db.Close()
		return nil, fmt.Errorf("esquema: %w", err)
	}
	return &Store{db: db}, nil
}

// DB expõe o *sql.DB (usado pelo snapshot).
func (s *Store) DB() *sql.DB { return s.db }

// Close fecha o banco.
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
	text_fold TEXT NOT NULL DEFAULT '', -- Fold(text): busca sem caixa/acento com LIKE nativo (8x mais rápido que função Go)
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
