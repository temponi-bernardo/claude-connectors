// Package bridge controla o ciclo de vida da ponte: fases, restauração, snapshots e o cliente do WhatsApp.
package bridge

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/snapshot"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

// Fases da ponte (ver API.md).
const (
	PhaseAwaitingRestore = "awaiting_restore"
	PhaseStarting        = "starting"
	PhaseReady           = "ready"
)

// WhatsApp é o que a API e o ciclo de vida usam do cliente (implementado por *wa.Manager).
type WhatsApp interface {
	State() wa.State
	QR() (wa.QRCode, error)
	PairCode(ctx context.Context, phone string) (string, error)
	Logout(ctx context.Context) error
	SendText(ctx context.Context, out wa.Outgoing) (wa.Sent, error)
	Download(ctx context.Context, md store.Media) ([]byte, error)
	Disconnect()
}

// StartFunc cria e inicia o cliente do WhatsApp sobre os bancos abertos.
type StartFunc func(ctx context.Context, sessionDB *sql.DB, st *store.Store) (WhatsApp, error)

// Options configura a ponte.
type Options struct {
	DataDir     string
	SnapshotKey []byte
	MaxRestore  int64 // teto do snapshot e de cada arquivo extraído
	Log         *slog.Logger
	Start       StartFunc
}

// Bridge guarda fase, bancos abertos, cliente e o estado do último snapshot.
type Bridge struct {
	opts      Options
	phase     atomic.Value
	mu        sync.Mutex // serializa restauração, snapshot e encerramento
	sessionDB *sql.DB
	store     *store.Store
	wa        WhatsApp
	snap      snapState
	ready     chan struct{}
}

// snapState é a geração e o hash do último snapshot entregue ou restaurado.
type snapState struct {
	generation uint64
	hash       [32]byte
	hasHash    bool
}

var (
	// ErrAlreadyRestored indica /restore fora da fase awaiting_restore.
	ErrAlreadyRestored = errors.New("a ponte já foi restaurada")
	// ErrBadSnapshot indica snapshot inválido (MAC, versão, truncado ou tar inesperado).
	ErrBadSnapshot = errors.New("snapshot inválido")
	// ErrNotReady indica operação que exige a fase ready.
	ErrNotReady = errors.New("a ponte ainda não está pronta")
)

// New cria a ponte na fase awaiting_restore.
func New(opts Options) *Bridge {
	b := &Bridge{opts: opts, ready: make(chan struct{})}
	b.phase.Store(PhaseAwaitingRestore)
	return b
}

// Phase devolve a fase atual.
func (b *Bridge) Phase() string { return b.phase.Load().(string) }

// Store devolve o banco de mensagens (nil antes de ready).
func (b *Bridge) Store() *store.Store {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.store
}

// WhatsApp devolve o cliente (nil antes de ready).
func (b *Bridge) WhatsApp() WhatsApp {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.wa
}

// Ready é fechado quando a ponte chega à fase ready.
func (b *Bridge) Ready() <-chan struct{} { return b.ready }

// path devolve o caminho de um arquivo dentro de DATA_DIR.
func (b *Bridge) path(name string) string { return filepath.Join(b.opts.DataDir, name) }

// removeDatabases apaga os bancos e seus arquivos -wal/-shm de DATA_DIR.
func (b *Bridge) removeDatabases() error {
	for _, name := range snapshot.FileNames {
		for _, suffix := range []string{"", "-wal", "-shm", "-journal"} {
			if err := os.Remove(b.path(name + suffix)); err != nil && !errors.Is(err, os.ErrNotExist) {
				return err
			}
		}
	}
	return nil
}
