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

// Emit recebe o snapshot cifrado pronto (tamanho, geração e conteúdo). Se devolver nil, o snapshot conta como entregue.
type Emit func(size int64, generation uint64, r io.Reader) error

// Snapshot gera um snapshot consistente (VACUUM INTO → tar → WAS1). Se o tar for igual ao último entregue ou
// restaurado, devolve false sem chamar emit. Senão chama emit e, com sucesso, avança a geração.
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

// vacuum copia os dois bancos para dir com VACUUM INTO.
func (b *Bridge) vacuum(ctx context.Context, dir string) error {
	if err := store.VacuumInto(ctx, b.sessionDB, filepath.Join(dir, snapshot.SessionFile)); err != nil {
		return err
	}
	return store.VacuumInto(ctx, b.store.DB(), filepath.Join(dir, snapshot.MessagesFile))
}

// seal empacota e cifra em streaming para um arquivo, calculando o SHA-256 do tar em claro.
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

// writeSealed grava o tar cifrado em f e preenche sum com o hash do tar.
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

// deliver entrega o arquivo cifrado a emit e registra geração e hash quando der certo.
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

// PushTimeout é o limite do envio do snapshot no SIGTERM.
const PushTimeout = 10 * time.Second

// Push devolve um Emit que faz PUT do snapshot em url com o token do Worker.
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
			return fmt.Errorf("push do snapshot: status %d", resp.StatusCode)
		}
		return nil
	}
}

// Shutdown desconecta o cliente, tenta enviar o snapshot (se houver URL e mudança) e fecha os bancos.
func (b *Bridge) Shutdown(ctx context.Context, client *http.Client, url, token string) {
	if w := b.WhatsApp(); w != nil {
		w.Disconnect()
	}
	if url != "" && b.Phase() == PhaseReady {
		pctx, cancel := context.WithTimeout(ctx, PushTimeout)
		changed, err := b.Snapshot(pctx, Push(pctx, client, url, token))
		cancel()
		if err != nil {
			b.opts.Log.Error("snapshot no encerramento falhou", "err", err.Error())
		} else {
			b.opts.Log.Info("snapshot no encerramento", "enviado", changed)
		}
	}
	b.closeDatabases()
}

// closeDatabases fecha os bancos abertos.
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

// ForgetSnapshotHash faz o próximo snapshot ser entregue mesmo sem mudança (GET /snapshot?force=1).
func (b *Bridge) ForgetSnapshotHash() {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.snap.hasHash = false
}
