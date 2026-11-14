// Package bridge controls the bridge lifecycle: phases, restore, snapshots and the WhatsApp client.
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

// Bridge phases (see API.md).
const (
	PhaseAwaitingRestore = "awaiting_restore"
	PhaseStarting        = "starting"
	PhaseReady           = "ready"
)

// WhatsApp is what the API and the lifecycle use from the client (implemented by *wa.Manager).
type WhatsApp interface {
	State() wa.State
	QR() (wa.QRCode, error)
	PairCode(ctx context.Context, phone string) (string, error)
	Logout(ctx context.Context) error
	SendText(ctx context.Context, out wa.Outgoing) (wa.Sent, error)
	Download(ctx context.Context, md store.Media) ([]byte, error)
	Disconnect()
}

// StartFunc creates and starts the WhatsApp client on top of the open databases.
type StartFunc func(ctx context.Context, sessionDB *sql.DB, st *store.Store) (WhatsApp, error)

// Options configures the bridge.
type Options struct {
	DataDir     string
	SnapshotKey []byte
	MaxRestore  int64 // cap for the snapshot and each extracted file
	Log         *slog.Logger
	Start       StartFunc
}

// Bridge holds the phase, open databases, client and the last snapshot state.
type Bridge struct {
	opts      Options
	phase     atomic.Value
	mu        sync.Mutex // serializes restore, snapshot and shutdown
	sessionDB *sql.DB
	store     *store.Store
	wa        WhatsApp
	snap      snapState
	ready     chan struct{}
}

// snapState is the generation and hash of the last delivered or restored snapshot.
type snapState struct {
	generation uint64
	hash       [32]byte
	hasHash    bool
}

var (
	// ErrAlreadyRestored signals /restore outside the awaiting_restore phase.
	ErrAlreadyRestored = errors.New("the bridge has already been restored")
	// ErrBadSnapshot signals an invalid snapshot (MAC, version, truncated or unexpected tar).
	ErrBadSnapshot = errors.New("invalid snapshot")
	// ErrNotReady signals an operation that requires the ready phase.
	ErrNotReady = errors.New("the bridge is not ready yet")
)

// New creates the bridge in the awaiting_restore phase.
func New(opts Options) *Bridge {
	b := &Bridge{opts: opts, ready: make(chan struct{})}
	b.phase.Store(PhaseAwaitingRestore)
	return b
}

// Phase returns the current phase.
func (b *Bridge) Phase() string { return b.phase.Load().(string) }

// Store returns the message database (nil before ready).
func (b *Bridge) Store() *store.Store {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.store
}

// WhatsApp returns the client (nil before ready).
func (b *Bridge) WhatsApp() WhatsApp {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.wa
}

// Ready is closed when the bridge reaches the ready phase.
func (b *Bridge) Ready() <-chan struct{} { return b.ready }

// path returns the path of a file inside DATA_DIR.
func (b *Bridge) path(name string) string { return filepath.Join(b.opts.DataDir, name) }

// removeDatabases deletes the databases and their -wal/-shm files from DATA_DIR.
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
