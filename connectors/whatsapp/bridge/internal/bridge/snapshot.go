package bridge

import (
	"context"
	"crypto/sha256"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/snapshot"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// Emit receives the finished encrypted snapshot (size, generation and content). If it returns nil, the snapshot counts as delivered.
type Emit func(size int64, generation uint64, r io.Reader) error

// Snapshot builds a consistent snapshot (VACUUM INTO → tar → WAS1). If the tar equals the last delivered or
// restored one, it returns false without calling emit. Otherwise it calls emit and, on success, advances the generation.
func (b *Bridge) Snapshot(ctx context.Context, emit Emit) (bool, error) {
	if b.Phase() != PhaseReady {
		return false, ErrNotReady
	}
	b.mu.Lock()
	defer b.mu.Unlock()
	dir, err := os.MkdirTemp(b.opts.DataDir, ".snapshot-")
	if err != nil {
		return false, err
	}
	defer os.RemoveAll(dir)
	if err := b.vacuum(ctx, dir); err != nil {
		return false, err
	}
	gen := b.snap.generation + 1
	f, sum, err := b.seal(dir, gen)
	if err != nil {
		return false, err
	}
	defer f.Close()
	if b.snap.hasHash && sum == b.snap.hash {
		return false, nil
	}
	return true, b.deliver(f, gen, sum, emit)
}

// vacuum copies both databases into dir with VACUUM INTO.
func (b *Bridge) vacuum(ctx context.Context, dir string) error {
	if err := store.VacuumInto(ctx, b.sessionDB, filepath.Join(dir, snapshot.SessionFile)); err != nil {
		return err
	}
	return store.VacuumInto(ctx, b.store.DB(), filepath.Join(dir, snapshot.MessagesFile))
}

// seal packs and encrypts to a file in streaming, computing the SHA-256 of the plaintext tar.
func (b *Bridge) seal(dir string, gen uint64) (*os.File, [32]byte, error) {
	var sum [32]byte
	f, err := os.Create(filepath.Join(dir, "snapshot.was"))
	if err != nil {
		return nil, sum, err
	}
	err = writeSealed(f, b.opts.SnapshotKey, gen, dir, &sum)
	if err != nil {
		f.Close()
		return nil, sum, err
	}
	return f, sum, nil
}

// writeSealed writes the encrypted tar to f and fills sum with the tar hash.
func writeSealed(f *os.File, key []byte, gen uint64, dir string, sum *[32]byte) error {
	w, err := snapshot.NewWriter(f, key, gen)
	if err != nil {
		return err
	}
	h := sha256.New()
	if err := snapshot.Pack(io.MultiWriter(h, w), dir); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}
	copy(sum[:], h.Sum(nil))
	return nil
}

// deliver hands the encrypted file to emit and records generation and hash on success.
func (b *Bridge) deliver(f *os.File, gen uint64, sum [32]byte, emit Emit) error {
	size, err := f.Seek(0, io.SeekEnd)
	if err != nil {
		return err
	}
	if _, err := f.Seek(0, io.SeekStart); err != nil {
		return err
	}
	if err := emit(size, gen, f); err != nil {
		return err
	}
	b.snap = snapState{generation: gen, hash: sum, hasHash: true}
	return nil
}

// PushTimeout limits the snapshot push on SIGTERM.
const PushTimeout = 10 * time.Second

// Push returns an Emit that PUTs the snapshot to url with the Worker token.
func Push(ctx context.Context, client *http.Client, url, token string) Emit {
	return func(size int64, gen uint64, r io.Reader) error {
		req, err := http.NewRequestWithContext(ctx, http.MethodPut, url, r)
		if err != nil {
			return err
		}
		req.ContentLength = size
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Content-Type", "application/octet-stream")
		req.Header.Set("X-Snapshot-Generation", strconv.FormatUint(gen, 10))
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		resp.Body.Close()
		if resp.StatusCode/100 != 2 {
			return fmt.Errorf("snapshot push: status %d", resp.StatusCode)
		}
		return nil
	}
}

// Shutdown disconnects the client, tries to push the snapshot (when there is a URL and a change) and closes the databases.
func (b *Bridge) Shutdown(ctx context.Context, client *http.Client, url, token string) {
	if w := b.WhatsApp(); w != nil {
		w.Disconnect()
	}
	if url != "" && b.Phase() == PhaseReady {
		b.logPush("snapshot on shutdown")(b.PushSnapshot(ctx, client, url, token))
	}
	b.closeDatabases()
}

// PushSnapshot sends the snapshot to url (PUT, with PushTimeout) if it changed since the last delivered one.
func (b *Bridge) PushSnapshot(ctx context.Context, client *http.Client, url, token string) (bool, error) {
	pctx, cancel := context.WithTimeout(ctx, PushTimeout)
	defer cancel()
	return b.Snapshot(pctx, Push(pctx, client, url, token))
}

// SnapshotNotifier returns the "session changed" hook: it pushes the snapshot in the background, without waiting for
// the Worker to ask, so a new pairing survives a container restart. Without url, it does nothing.
func (b *Bridge) SnapshotNotifier(client *http.Client, url, token string) func() {
	return func() {
		if url == "" {
			return
		}
		go func() {
			b.logPush("snapshot after session change")(b.PushSnapshot(context.Background(), client, url, token))
		}()
	}
}

// logPush logs the result of a snapshot push with the given label.
func (b *Bridge) logPush(label string) func(bool, error) {
	return func(changed bool, err error) {
		if err != nil {
			b.opts.Log.Error(label+" failed", "err", err.Error())
			return
		}
		b.opts.Log.Info(label, "sent", changed)
	}
}

// closeDatabases closes the open databases.
func (b *Bridge) closeDatabases() {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.store != nil {
		b.store.Close()
	}
	if b.sessionDB != nil {
		b.sessionDB.Close()
	}
}

// ForgetSnapshotHash makes the next snapshot be delivered even without changes (GET /snapshot?force=1).
func (b *Bridge) ForgetSnapshotHash() {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.snap.hasHash = false
}
