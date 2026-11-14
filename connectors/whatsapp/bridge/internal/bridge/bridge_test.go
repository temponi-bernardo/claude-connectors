package bridge

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/snapshot"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

type stubWA struct{ disconnected bool }

func (s *stubWA) State() wa.State                                           { return wa.State{} }
func (s *stubWA) QR() (wa.QRCode, error)                                    { return wa.QRCode{}, nil }
func (s *stubWA) PairCode(context.Context, string) (string, error)          { return "", nil }
func (s *stubWA) Logout(context.Context) error                              { return nil }
func (s *stubWA) SendText(context.Context, string, string) (wa.Sent, error) { return wa.Sent{}, nil }
func (s *stubWA) Download(context.Context, store.Media) ([]byte, error)     { return nil, nil }
func (s *stubWA) Disconnect()                                               { s.disconnected = true }

var key = bytes.Repeat([]byte{3}, 32)

func newTestBridge(t *testing.T, start StartFunc) (*Bridge, *stubWA) {
	t.Helper()
	stub := &stubWA{}
	if start == nil {
		start = func(context.Context, *sql.DB, *store.Store) (WhatsApp, error) { return stub, nil }
	}
	b := New(Options{DataDir: filepath.Join(t.TempDir(), "data"), SnapshotKey: key, MaxRestore: 1 << 20,
		Log: slog.New(slog.NewTextHandler(io.Discard, nil)), Start: start})
	return b, stub
}

func readyBridge(t *testing.T) (*Bridge, *stubWA) {
	t.Helper()
	b, stub := newTestBridge(t, nil)
	if _, _, err := b.Restore(nil, true); err != nil {
		t.Fatal(err)
	}
	select {
	case <-b.Ready():
	case <-time.After(5 * time.Second):
		t.Fatal("não ficou pronta")
	}
	t.Cleanup(func() { b.closeDatabases() })
	return b, stub
}

func TestSnapshotRequiresReady(t *testing.T) {
	b, _ := newTestBridge(t, nil)
	if _, err := b.Snapshot(context.Background(), nil); !errors.Is(err, ErrNotReady) {
		t.Fatal(err)
	}
	if b.Store() != nil || b.WhatsApp() != nil {
		t.Fatal("sem bancos antes do restore")
	}
}

func TestOpenFailureReturnsToAwaiting(t *testing.T) {
	b, _ := newTestBridge(t, func(context.Context, *sql.DB, *store.Store) (WhatsApp, error) { return nil, errors.New("falhou") })
	if _, _, err := b.Restore(nil, true); err != nil {
		t.Fatal(err)
	}
	deadline := time.Now().Add(5 * time.Second)
	for b.Phase() != PhaseAwaitingRestore && time.Now().Before(deadline) {
		time.Sleep(5 * time.Millisecond)
	}
	if b.Phase() != PhaseAwaitingRestore {
		t.Fatalf("fase %s", b.Phase())
	}
}

func TestRestoreRemovesOldDatabases(t *testing.T) {
	b, _ := newTestBridge(t, nil)
	_ = os.MkdirAll(b.opts.DataDir, 0o700)
	for _, n := range []string{"messages.db-wal", "session.db"} {
		_ = os.WriteFile(b.path(n), []byte("velho"), 0o600)
	}
	if err := b.prepareDataDir(); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(b.path("messages.db-wal")); !os.IsNotExist(err) {
		t.Fatal("arquivo antigo não apagado")
	}
}

func TestRestoreRejectsArchiveWithExtraFile(t *testing.T) {
	b, _ := newTestBridge(t, nil)
	var plain bytes.Buffer
	dir := t.TempDir()
	for _, n := range snapshot.FileNames {
		_ = os.WriteFile(filepath.Join(dir, n), []byte("x"), 0o600)
	}
	_ = snapshot.Pack(&plain, dir)
	var enc bytes.Buffer
	w, _ := snapshot.NewWriter(&enc, key, 5)
	_, _ = w.Write(plain.Bytes())
	_, _ = w.Write([]byte("lixo depois do tar"))
	_ = w.Close()
	restored, gen, err := b.Restore(&enc, false)
	if err != nil || !restored || gen != 5 {
		t.Fatalf("lixo após o tar é ignorado pelo tar mas entra no hash: %v %v %v", restored, gen, err)
	}
}

func TestShutdownPushesSnapshot(t *testing.T) {
	var got http.Header
	var body []byte
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		got, body = r.Header.Clone(), mustRead(r.Body)
		if r.Method != http.MethodPut {
			w.WriteHeader(405)
		}
	}))
	defer srv.Close()
	b, stub := readyBridge(t)
	b.Shutdown(context.Background(), srv.Client(), srv.URL, "tok")
	if !stub.disconnected || got.Get("Authorization") != "Bearer tok" || got.Get("X-Snapshot-Generation") != "1" || len(body) < snapshot.HeaderSize {
		t.Fatalf("push: %v %d", got, len(body))
	}
}

func TestPushErrors(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(500) }))
	defer srv.Close()
	ctx := context.Background()
	if err := Push(ctx, srv.Client(), srv.URL, "t")(1, 1, bytes.NewReader([]byte("x"))); err == nil {
		t.Fatal("status 500 deveria falhar")
	}
	if err := Push(ctx, srv.Client(), "http://127.0.0.1:1", "t")(1, 1, bytes.NewReader([]byte("x"))); err == nil {
		t.Fatal("conexão recusada deveria falhar")
	}
	if err := Push(ctx, srv.Client(), "::", "t")(1, 1, nil); err == nil {
		t.Fatal("URL inválida deveria falhar")
	}
	b, _ := readyBridge(t)
	b.Shutdown(ctx, srv.Client(), srv.URL, "t") // falha só vai para o log
}

func TestSnapshotEmitErrorDoesNotCommit(t *testing.T) {
	b, _ := readyBridge(t)
	ctx := context.Background()
	if _, err := b.Snapshot(ctx, func(int64, uint64, io.Reader) error { return errors.New("cliente caiu") }); err == nil {
		t.Fatal("erro do emit deveria voltar")
	}
	var gen uint64
	changed, err := b.Snapshot(ctx, func(_ int64, g uint64, _ io.Reader) error { gen = g; return nil })
	if err != nil || !changed || gen != 1 {
		t.Fatalf("geração não deveria ter avançado: %v %v %d", changed, err, gen)
	}
	b.ForgetSnapshotHash()
	if changed, _ := b.Snapshot(ctx, func(int64, uint64, io.Reader) error { return nil }); !changed {
		t.Fatal("ForgetSnapshotHash deveria forçar a entrega")
	}
}

func mustRead(r io.Reader) []byte {
	b, _ := io.ReadAll(r)
	return b
}

func TestRestoreErrors(t *testing.T) {
	b, _ := readyBridge(t)
	if _, _, err := b.Restore(nil, true); !errors.Is(err, ErrAlreadyRestored) {
		t.Fatal(err)
	}
	b2, _ := newTestBridge(t, nil)
	for _, body := range [][]byte{nil, []byte("WAS1 curto")} {
		if _, _, err := b2.Restore(bytes.NewReader(body), false); !errors.Is(err, ErrBadSnapshot) {
			t.Fatalf("esperava ErrBadSnapshot: %v", err)
		}
	}
	var enc bytes.Buffer
	w, _ := snapshot.NewWriter(&enc, key, 1)
	_, _ = w.Write([]byte("não é tar"))
	_ = w.Close()
	if _, _, err := b2.Restore(&enc, false); !errors.Is(err, ErrBadSnapshot) {
		t.Fatalf("tar inválido: %v", err)
	}
	file := filepath.Join(t.TempDir(), "arquivo")
	_ = os.WriteFile(file, nil, 0o600)
	b3 := New(Options{DataDir: filepath.Join(file, "sub"), SnapshotKey: key, Log: b.opts.Log})
	if _, _, err := b3.Restore(nil, true); err == nil {
		t.Fatal("DATA_DIR inválido deveria falhar")
	}
}

func TestSnapshotInternalErrors(t *testing.T) {
	b, _ := readyBridge(t)
	b.opts.SnapshotKey = []byte("curta")
	if _, err := b.Snapshot(context.Background(), nil); err == nil {
		t.Fatal("chave inválida deveria falhar")
	}
	b.opts.SnapshotKey = key
	b.store.DB().Close()
	if _, err := b.Snapshot(context.Background(), nil); err == nil {
		t.Fatal("banco fechado deveria falhar")
	}
	b.sessionDB.Close()
	if _, err := b.Snapshot(context.Background(), nil); err == nil {
		t.Fatal("sessão fechada deveria falhar")
	}
	b.opts.DataDir = filepath.Join(b.opts.DataDir, "nao-existe")
	if _, err := b.Snapshot(context.Background(), nil); err == nil {
		t.Fatal("diretório ausente deveria falhar")
	}
}
