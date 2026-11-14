package api

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/bridge"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

const testToken = "token-de-teste-com-mais-de-32-caracteres"

var testKey = bytes.Repeat([]byte{9}, 32)

// fakeWA substitui o whatsmeow nos testes (sem rede).
type fakeWA struct {
	mu           sync.Mutex
	state        wa.State
	qr           wa.QRCode
	qrErr        error
	pairCode     string
	pairErr      error
	logoutErr    error
	sendErr      error
	sent         []string
	media        []byte
	mediaErr     error
	disconnected bool
}

func (f *fakeWA) State() wa.State {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.state
}
func (f *fakeWA) QR() (wa.QRCode, error) { return f.qr, f.qrErr }
func (f *fakeWA) PairCode(context.Context, string) (string, error) {
	return f.pairCode, f.pairErr
}
func (f *fakeWA) Logout(context.Context) error { return f.logoutErr }
func (f *fakeWA) SendText(_ context.Context, out wa.Outgoing) (wa.Sent, error) {
	if f.sendErr != nil {
		return wa.Sent{}, f.sendErr
	}
	entry := out.To + "|" + out.Text
	if out.Quote != nil {
		entry += "|quote:" + out.Quote.ID
	}
	f.sent = append(f.sent, entry)
	return wa.Sent{ID: "SENT1", Timestamp: time.Unix(1_763_123_400, 0)}, nil
}
func (f *fakeWA) Download(context.Context, store.Media) ([]byte, error) { return f.media, f.mediaErr }
func (f *fakeWA) Disconnect()                                           { f.disconnected = true }

// env é um servidor de teste completo: ponte real (bancos em t.TempDir) + whatsmeow falso.
type env struct {
	t    *testing.T
	b    *bridge.Bridge
	fake *fakeWA
	h    http.Handler
	dir  string
}

func quietLog() *slog.Logger { return slog.New(slog.NewTextHandler(io.Discard, nil)) }

func newEnv(t *testing.T, mutate func(*Options)) *env {
	t.Helper()
	e := &env{t: t, fake: &fakeWA{}, dir: t.TempDir()}
	e.b = bridge.New(bridge.Options{DataDir: e.dir, SnapshotKey: testKey, MaxRestore: 1 << 30, Log: quietLog(),
		Start: func(context.Context, *sql.DB, *store.Store) (bridge.WhatsApp, error) { return e.fake, nil }})
	loc, _ := time.LoadLocation("America/Sao_Paulo")
	opts := Options{Token: testToken, Location: loc, MaxMediaBytes: 100, MaxRestore: 1 << 30, Log: quietLog(), SendMaxPerHour: 2,
		EnableSend: true, Allowlist: []string{"5531999990001@s.whatsapp.net"}}
	if mutate != nil {
		mutate(&opts)
	}
	e.h = New(e.b, opts).Handler()
	t.Cleanup(func() { e.b.Shutdown(context.Background(), http.DefaultClient, "", "") })
	return e
}

// ready restaura do zero e espera a fase ready.
func (e *env) ready() *env {
	e.t.Helper()
	rec := e.do("POST", "/restore", nil, map[string]string{"X-Snapshot": "none"})
	if rec.Code != 200 {
		e.t.Fatalf("restore: %d %s", rec.Code, rec.Body)
	}
	e.waitReady()
	return e
}

func (e *env) waitReady() {
	e.t.Helper()
	select {
	case <-e.b.Ready():
	case <-time.After(5 * time.Second):
		e.t.Fatal("ponte não ficou pronta")
	}
}

// do faz uma requisição autenticada.
func (e *env) do(method, path string, body []byte, headers map[string]string) *httptest.ResponseRecorder {
	e.t.Helper()
	req := httptest.NewRequest(method, path, bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+testToken)
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	rec := httptest.NewRecorder()
	e.h.ServeHTTP(rec, req)
	return rec
}

func (e *env) get(path string) *httptest.ResponseRecorder { return e.do("GET", path, nil, nil) }

func (e *env) postJSON(path, body string) *httptest.ResponseRecorder {
	return e.do("POST", path, []byte(body), map[string]string{"Content-Type": "application/json"})
}

// decode lê a resposta JSON num mapa.
func decode(t *testing.T, rec *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var m map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &m); err != nil {
		t.Fatalf("JSON inválido (%d): %s", rec.Code, rec.Body)
	}
	return m
}

// expect confere status e, se dado, o código de erro.
func expect(t *testing.T, rec *httptest.ResponseRecorder, status int, code string) map[string]any {
	t.Helper()
	if rec.Code != status {
		t.Fatalf("status %d (esperava %d): %s", rec.Code, status, rec.Body)
	}
	if code == "" {
		return nil
	}
	m := decode(t, rec)
	if m["error"] != code {
		t.Fatalf("erro %v (esperava %s)", m["error"], code)
	}
	if !strings.Contains(rec.Header().Get("Content-Type"), "application/json") {
		t.Fatal("content-type de erro deveria ser JSON")
	}
	return m
}

// seed grava dados de exemplo no banco da ponte.
func (e *env) seed() {
	e.t.Helper()
	err := e.b.Store().SaveHistory(context.Background(), store.HistoryBatch{
		Chats:    []store.Chat{{JID: "120363000000000001@g.us", Name: "Família"}},
		Contacts: []store.Contact{{JID: "5531999990001@s.whatsapp.net", FullName: "Maria"}},
		Messages: []store.Message{
			{ChatJID: "5531999990001@s.whatsapp.net", ID: "A1", SenderJID: "5531999990001@s.whatsapp.net", Timestamp: 1_763_123_400, Type: "text", Text: "Oi‮"},
			{ChatJID: "5531999990001@s.whatsapp.net", ID: "A2", FromMe: true, Timestamp: 1_763_123_500, Type: "image", Text: "foto",
				Media: &store.Media{Kind: "image", Mime: "image/jpeg", Size: 50, Filename: "férias.jpg", DirectPath: "/p"}},
			{ChatJID: "5531999990001@s.whatsapp.net", ID: "BIG", Timestamp: 1_763_000_000, Type: "video", Media: &store.Media{Kind: "video", Size: 1000, DirectPath: "/v"}},
			{ChatJID: "120363000000000001@g.us", ID: "G1", SenderJID: "5531999990002@s.whatsapp.net", SenderPush: "João", Timestamp: 1_763_100_000, Type: "text", Text: "reunião às 10"},
		},
	})
	if err != nil {
		e.t.Fatal(err)
	}
}
