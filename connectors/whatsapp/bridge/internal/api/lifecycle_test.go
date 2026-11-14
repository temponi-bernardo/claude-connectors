package api

import (
	"bytes"
	"net/http/httptest"
	"testing"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/bridge"
)

func TestHealthAndAuth(t *testing.T) {
	e := newEnv(t, nil)
	rec := httptest.NewRecorder()
	e.h.ServeHTTP(rec, httptest.NewRequest("GET", "/health", nil))
	if rec.Code != 200 || decode(t, rec)["phase"] != bridge.PhaseAwaitingRestore {
		t.Fatalf("health: %d %s", rec.Code, rec.Body)
	}
	for _, header := range []string{"", "Bearer wrong", "Basic " + testToken, testToken} {
		req := httptest.NewRequest("GET", "/status", nil)
		if header != "" {
			req.Header.Set("Authorization", header)
		}
		rec := httptest.NewRecorder()
		e.h.ServeHTTP(rec, req)
		expect(t, rec, 401, "unauthorized")
	}
}

func TestNotReadyBeforeRestore(t *testing.T) {
	e := newEnv(t, nil)
	for _, path := range []string{"/status", "/chats", "/snapshot", "/pair/qr"} {
		m := expect(t, e.get(path), 503, "not_ready")
		if m["phase"] != bridge.PhaseAwaitingRestore {
			t.Fatalf("%s: phase %v", path, m["phase"])
		}
	}
}

func TestRestoreEmptyAndConflict(t *testing.T) {
	e := newEnv(t, nil)
	expect(t, e.do("POST", "/restore", []byte("garbage"), map[string]string{"X-Snapshot": "none"}), 400, "bad_request")
	rec := e.do("POST", "/restore", nil, map[string]string{"X-Snapshot": "none"})
	m := decode(t, rec)
	if rec.Code != 200 || m["restored"] != false || m["generation"] != float64(0) {
		t.Fatalf("%d %v", rec.Code, m)
	}
	e.waitReady()
	expect(t, e.do("POST", "/restore", nil, map[string]string{"X-Snapshot": "none"}), 409, "already_restored")
	if decode(t, e.get("/health"))["phase"] != bridge.PhaseReady {
		t.Fatal("should be ready")
	}
}

func TestSnapshotRoundTripThroughRestore(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.seed()
	rec := e.get("/snapshot")
	if rec.Code != 200 || rec.Header().Get("X-Snapshot-Generation") != "1" || rec.Header().Get("Content-Type") != "application/octet-stream" ||
		rec.Header().Get("Content-Length") == "" {
		t.Fatalf("snapshot: %d %v", rec.Code, rec.Header())
	}
	snap := rec.Body.Bytes()
	if r := e.get("/snapshot"); r.Code != 204 {
		t.Fatalf("unchanged should be 204, got %d", r.Code)
	}
	forced := e.get("/snapshot?force=1")
	if forced.Code != 200 || forced.Header().Get("X-Snapshot-Generation") != "2" {
		t.Fatalf("force: %d %v", forced.Code, forced.Header())
	}

	e2 := newEnv(t, nil)
	m := decode(t, e2.do("POST", "/restore", snap, nil))
	if m["restored"] != true || m["generation"] != float64(1) {
		t.Fatalf("restore: %v", m)
	}
	e2.waitReady()
	if decode(t, e2.get("/status"))["messages"] != float64(4) {
		t.Fatal("messages not restored")
	}
	if r := e2.get("/snapshot"); r.Code != 204 {
		t.Fatalf("right after restore, unchanged, should be 204; got %d", r.Code)
	}
	if err := e2.b.Store().SetChatName(t.Context(), "120363000000000001@g.us", "Other"); err != nil {
		t.Fatal(err)
	}
	if r := e2.get("/snapshot"); r.Code != 200 || r.Header().Get("X-Snapshot-Generation") != "2" {
		t.Fatalf("changed: %d %v", r.Code, r.Header())
	}
}

func TestRestoreBadSnapshotKeepsAwaiting(t *testing.T) {
	e := newEnv(t, nil).ready()
	snap := e.get("/snapshot").Body.Bytes()
	cases := map[string][]byte{
		"empty":     nil,
		"garbage":   bytes.Repeat([]byte{1}, 500),
		"truncated": snap[:len(snap)-40],
		"tampered":  flip(snap, len(snap)/2),
		"version":   flip(snap, 4),
	}
	if full := 63 + 65536 + 16; len(snap) > full {
		cases["no final chunk"] = snap[:full]
	}
	for name, body := range cases {
		e2 := newEnv(t, nil)
		expect(t, e2.do("POST", "/restore", body, nil), 422, "bad_snapshot")
		if e2.b.Phase() != bridge.PhaseAwaitingRestore {
			t.Fatalf("%s: phase %s", name, e2.b.Phase())
		}
		e2.ready()
	}
	wrongKey := newEnv(t, nil)
	wrongKey.b = bridge.New(bridge.Options{DataDir: t.TempDir(), SnapshotKey: bytes.Repeat([]byte{1}, 32), Log: quietLog(), MaxRestore: 1 << 30})
	wrongKey.h = New(wrongKey.b, Options{Token: testToken, Log: quietLog(), MaxRestore: 1 << 30}).Handler()
	expect(t, wrongKey.do("POST", "/restore", snap, nil), 422, "bad_snapshot")
}

func flip(b []byte, pos int) []byte {
	c := bytes.Clone(b)
	c[pos] ^= 0xff
	return c
}
