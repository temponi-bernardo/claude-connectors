package api

import (
	"errors"
	"net/url"
	"strings"
	"testing"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

func TestStatusAndSyncWait(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.seed()
	e.fake.state = wa.State{Connected: true, LoggedIn: true, Account: "+55 31 9****-**01"}
	m := decode(t, e.get("/status"))
	if m["phase"] != "ready" || m["connected"] != true || m["account"] != "+55 31 9****-**01" || m["chats"] != float64(2) ||
		m["messages"] != float64(4) || m["send_enabled"] != true || m["last_event_at"] != nil {
		t.Fatalf("status: %v", m)
	}
	m = decode(t, e.do("POST", "/sync/wait?timeout_ms=0", nil, nil))
	if m["partial"] != true {
		t.Fatalf("should be partial: %v", m)
	}
	e.fake.state.OfflineSyncComplete = true
	m = decode(t, e.do("POST", "/sync/wait?timeout_ms=99999", nil, nil))
	if _, has := m["partial"]; has || m["offline_sync_complete"] != true {
		t.Fatalf("should finish: %v", m)
	}
	expect(t, e.do("POST", "/sync/wait?timeout_ms=x", nil, nil), 400, "bad_request")
}

func TestSyncWaitPolls(t *testing.T) {
	e := newEnv(t, nil).ready()
	go func() {
		e.fake.mu.Lock()
		e.fake.state.NeedsPairing = true
		e.fake.mu.Unlock()
	}()
	if m := decode(t, e.do("POST", "/sync/wait?timeout_ms=3000", nil, nil)); m["needs_pairing"] != true || m["partial"] != nil {
		t.Fatalf("%v", m)
	}
}

func TestChats(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.seed()
	m := decode(t, e.get("/chats?limit=1"))
	chats := m["chats"].([]any)
	first := chats[0].(map[string]any)
	if len(chats) != 1 || first["name"] != "Maria" || first["last_message_at"] != "2025-11-14T09:31:40-03:00" || m["next_cursor"] == nil {
		t.Fatalf("%v", m)
	}
	last := first["last_message"].(map[string]any)
	if last["from_me"] != true || last["sender_name"] != "You" || last["type"] != "image" {
		t.Fatalf("last: %v", last)
	}
	m = decode(t, e.get("/chats?limit=1&cursor="+m["next_cursor"].(string)))
	if g := m["chats"].([]any)[0].(map[string]any); g["name"] != "Família" || g["is_group"] != true || m["next_cursor"] != nil {
		t.Fatalf("page 2: %v", m)
	}
	if m := decode(t, e.get("/chats?query="+url.QueryEscape("famí"))); len(m["chats"].([]any)) != 1 {
		t.Fatalf("query: %v", m)
	}
	for _, q := range []string{"limit=0", "limit=101", "limit=x", "cursor=%21%21", "query=" + strings.Repeat("a", 201)} {
		expect(t, e.get("/chats?"+q), 400, "bad_request")
	}
}

func TestMessages(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.seed()
	m := decode(t, e.get("/messages?chat_jid=5531999990001@s.whatsapp.net&limit=2"))
	msgs := m["messages"].([]any)
	if len(msgs) != 2 || m["next_before"] == nil || m["chat"].(map[string]any)["name"] != "Maria" {
		t.Fatalf("%v", m)
	}
	img := msgs[0].(map[string]any)
	media := img["media"].(map[string]any)
	if img["id"] != "A2" || img["timestamp"] != "2025-11-14T09:31:40-03:00" || media["filename"] != "férias.jpg" || media["size"] != float64(50) {
		t.Fatalf("image: %v", img)
	}
	if _, has := img["chat_name"]; has {
		t.Fatal("chat_name only in search")
	}
	m = decode(t, e.get("/messages?chat_jid=5531999990001@s.whatsapp.net&limit=2&before="+m["next_before"].(string)))
	rest := m["messages"].([]any)
	if len(rest) != 1 || rest[0].(map[string]any)["id"] != "BIG" || m["next_before"] != nil {
		t.Fatalf("page 2: %v", m)
	}
	if msgs[1].(map[string]any)["text"] != "Oi" {
		t.Fatal("bidi override not removed")
	}
	expect(t, e.get("/messages?chat_jid=x@s.whatsapp.net"), 404, "chat_not_found")
	for _, q := range []string{"", "chat_jid=noat", "chat_jid=a@b&limit=500", "chat_jid=a@b&before=zz"} {
		expect(t, e.get("/messages?"+q), 400, "bad_request")
	}
}

func TestSearchAndContacts(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.seed()
	m := decode(t, e.get("/search?query="+url.QueryEscape("REUNIAO")))
	msgs := m["messages"].([]any)
	if len(msgs) != 1 || msgs[0].(map[string]any)["chat_name"] != "Família" || msgs[0].(map[string]any)["sender_name"] != "João" {
		t.Fatalf("%v", m)
	}
	if m := decode(t, e.get("/search?query=oi&chat_jid=120363000000000001@g.us")); len(m["messages"].([]any)) != 0 {
		t.Fatalf("chat filter: %v", m)
	}
	for _, q := range []string{"", "query=", "query=a&chat_jid=x", "query=a&limit=0"} {
		expect(t, e.get("/search?"+q), 400, "bad_request")
	}
	c := decode(t, e.get("/contacts?query=maria"))["contacts"].([]any)
	if len(c) != 1 || c[0].(map[string]any)["phone"] != "+5531999990001" || c[0].(map[string]any)["push_name"] != nil {
		t.Fatalf("%v", c)
	}
	if c := decode(t, e.get("/contacts?query=joao"))["contacts"].([]any); len(c) != 1 || c[0].(map[string]any)["push_name"] != "João" {
		t.Fatalf("push name: %v", c)
	}
	expect(t, e.get("/contacts"), 400, "bad_request")
}

func TestMedia(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.seed()
	base := "/media?chat_jid=5531999990001@s.whatsapp.net&message_id="
	expect(t, e.get(base+"missing"), 404, "not_found")
	expect(t, e.get(base+"A1"), 404, "not_found")
	expect(t, e.get(base+"BIG"), 413, "too_large")
	expect(t, e.get("/media?chat_jid=x"), 400, "bad_request")
	e.fake.mediaErr = wa.ErrMediaExpired
	expect(t, e.get(base+"A2"), 410, "media_expired")
	e.fake.mediaErr = wa.ErrNotConnected
	expect(t, e.get(base+"A2"), 503, "not_connected")
	e.fake.mediaErr = errors.New("network")
	expect(t, e.get(base+"A2"), 502, "download_failed")
	e.fake.mediaErr, e.fake.media = nil, make([]byte, 101)
	expect(t, e.get(base+"A2"), 413, "too_large")
	e.fake.media = []byte("jpeg!")
	rec := e.get(base + "A2")
	if rec.Code != 200 || rec.Body.String() != "jpeg!" || rec.Header().Get("Content-Type") != "image/jpeg" ||
		rec.Header().Get("X-Media-Filename") != "f%C3%A9rias.jpg" || rec.Header().Get("Content-Length") != "5" {
		t.Fatalf("%d %v", rec.Code, rec.Header())
	}
}

func TestSafeMimeAndValidJID(t *testing.T) {
	if safeMime("audio/ogg; codecs=opus") != "audio/ogg; codecs=opus" || safeMime("x\r\ny") != "application/octet-stream" || safeMime("") != "application/octet-stream" {
		t.Fatal("safeMime")
	}
	for jid, want := range map[string]bool{"a@b": true, "@b": false, "a@": false, "a@b@c": false, "ab": false} {
		if validJID(jid) != want {
			t.Errorf("validJID(%q)", jid)
		}
	}
}
