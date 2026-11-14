package bridge

import (
	"context"
	"crypto/sha256"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/snapshot"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// Restore prepara DATA_DIR: do zero (empty) ou a partir do snapshot em body. Com sucesso, passa para starting
// e abre bancos e cliente em segundo plano. Snapshot inválido mantém a fase awaiting_restore.
func (b *Bridge) Restore(body io.Reader, empty bool) (bool, uint64, error) {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.Phase() != PhaseAwaitingRestore {
		return false, 0, ErrAlreadyRestored
	}
	if err := b.prepareDataDir(); err != nil {
		return false, 0, err
	}
	var st snapState
	if !empty {
		var err error
		if st, err = b.extract(body); err != nil {
			return false, 0, err
		}
	}
	b.snap = st
	b.phase.Store(PhaseStarting)
	go b.open()
	return !empty, st.generation, nil
}

// prepareDataDir garante o diretório e apaga bancos anteriores.
func (b *Bridge) prepareDataDir() error {
	if err := os.MkdirAll(b.opts.DataDir, 0o700); err != nil {
		return err
	}
	return b.removeDatabases()
}

// extract decifra e valida o snapshot numa pasta temporária e só então move os bancos para DATA_DIR.
func (b *Bridge) extract(body io.Reader) (snapState, error) {
	staging, err := os.MkdirTemp(b.opts.DataDir, ".restore-")
	if err != nil {
		return snapState{}, err
	}
	defer os.RemoveAll(staging)
	st, err := b.decryptInto(body, staging)
	if err != nil {
		return snapState{}, fmt.Errorf("%w: %w", ErrBadSnapshot, err)
	}
	for _, name := range snapshot.FileNames {
		if err := os.Rename(filepath.Join(staging, name), b.path(name)); err != nil {
			return snapState{}, err
		}
	}
	return st, nil
}

// decryptInto decifra body, extrai o tar em dir e confere o bloco final; devolve geração e hash do tar.
func (b *Bridge) decryptInto(body io.Reader, dir string) (snapState, error) {
	r, err := snapshot.NewReader(body, b.opts.SnapshotKey)
	if err != nil {
		return snapState{}, err
	}
	h := sha256.New()
	tee := io.TeeReader(r, h)
	if err := snapshot.Unpack(tee, dir, b.opts.MaxRestore); err != nil {
		return snapState{}, err
	}
	if _, err := io.Copy(io.Discard, tee); err != nil {
		return snapState{}, err
	}
	st := snapState{generation: r.Generation(), hasHash: true}
	copy(st.hash[:], h.Sum(nil))
	return st, nil
}

// open abre os bancos e inicia o cliente; com falha, volta para awaiting_restore.
func (b *Bridge) open() {
	if err := b.openAll(context.Background()); err != nil {
		b.opts.Log.Error("falha ao abrir os bancos ou o cliente", "err", err.Error())
		b.phase.Store(PhaseAwaitingRestore)
		return
	}
	b.phase.Store(PhaseReady)
	close(b.ready)
}

// openAll abre session.db e messages.db e cria o cliente do WhatsApp.
func (b *Bridge) openAll(ctx context.Context) error {
	b.mu.Lock()
	defer b.mu.Unlock()
	sess, err := store.OpenDB(b.path(snapshot.SessionFile))
	if err != nil {
		return err
	}
	st, err := store.Open(ctx, b.path(snapshot.MessagesFile))
	if err != nil {
		sess.Close()
		return err
	}
	w, err := b.opts.Start(ctx, sess, st)
	if err != nil {
		st.Close()
		sess.Close()
		return err
	}
	b.sessionDB, b.store, b.wa = sess, st, w
	return nil
}
