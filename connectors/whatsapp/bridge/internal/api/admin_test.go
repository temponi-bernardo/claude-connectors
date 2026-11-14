package api

import (
	"bytes"
	"encoding/base64"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

func TestPairCode(t *testing.T) {
	e := newEnv(t, nil).ready()
	expect(t, e.postJSON("/pair/code", "{"), 400, "bad_request")
	for _, p := range []string{"123", "55319999999999999", "5531a9999999", ""} {
		expect(t, e.postJSON("/pair/code", `{"phone":"`+p+`"}`), 400, "bad_request")
	}
	e.fake.pairCode = "ABCD-EFGH"
	if m := decode(t, e.postJSON("/pair/code", `{"phone":"5531999999999"}`)); m["code"] != "ABCD-EFGH" {
		t.Fatalf("%v", m)
	}
	e.fake.pairErr = wa.ErrAlreadyPaired
	expect(t, e.postJSON("/pair/code", `{"phone":"5531999999999"}`), 409, "already_paired")
	e.fake.pairErr = wa.ErrNotConnected
	expect(t, e.postJSON("/pair/code", `{"phone":"5531999999999"}`), 503, "not_connected")
	e.fake.pairErr = errors.New("400 do servidor")
	expect(t, e.postJSON("/pair/code", `{"phone":"5531999999999"}`), 502, "pair_failed")
}

func TestPairQR(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.fake.qrErr = wa.ErrNoQR
	expect(t, e.get("/pair/qr"), 503, "qr_not_ready")
	e.fake.qrErr = wa.ErrAlreadyPaired
	expect(t, e.get("/pair/qr"), 409, "already_paired")
	e.fake.qrErr, e.fake.qr = nil, wa.QRCode{Code: "2@abc,def", ExpiresAt: time.Unix(1_763_123_460, 0)}
	m := decode(t, e.get("/pair/qr"))
	png, err := base64.StdEncoding.DecodeString(m["png_base64"].(string))
	if err != nil || !bytes.HasPrefix(png, []byte("\x89PNG")) || m["qr"] != "2@abc,def" || m["expires_at"] != "2025-11-14T09:31:00-03:00" {
		t.Fatalf("%v %v", m["qr"], m["expires_at"])
	}
}

func TestLogout(t *testing.T) {
	e := newEnv(t, nil).ready()
	if m := decode(t, e.do("POST", "/logout", nil, nil)); m["logged_out"] != true {
		t.Fatalf("%v", m)
	}
	e.fake.logoutErr = errors.New("x")
	expect(t, e.do("POST", "/logout", nil, nil), 502, "logout_failed")
}

func TestSendDisabled(t *testing.T) {
	e := newEnv(t, func(o *Options) { o.EnableSend = false }).ready()
	expect(t, e.postJSON("/send", `{"recipient":"5531999990001","text":"oi"}`), 403, "send_disabled")
}

func TestSendValidationAndRateLimit(t *testing.T) {
	e := newEnv(t, nil).ready()
	cases := []struct {
		body   string
		status int
		code   string
	}{
		{`{`, 400, "bad_request"},
		{`{"recipient":"abc","text":"oi"}`, 400, "bad_request"},
		{`{"recipient":"5531999990009","text":"oi"}`, 403, "recipient_not_allowed"},
		{`{"recipient":"5531999990001","text":"  "}`, 400, "bad_request"},
		{`{"recipient":"5531999990001","text":"` + strings.Repeat("é", 4097) + `"}`, 400, "bad_request"},
	}
	for _, c := range cases {
		expect(t, e.postJSON("/send", c.body), c.status, c.code)
	}
	ok := `{"recipient":"+5531999990001","text":"olá"}`
	m := decode(t, e.postJSON("/send", ok))
	if m["id"] != "SENT1" || m["timestamp"] != "2025-11-14T09:30:00-03:00" || e.fake.sent[0] != "5531999990001@s.whatsapp.net|olá" {
		t.Fatalf("%v %v", m, e.fake.sent)
	}
	e.fake.sendErr = wa.ErrNotConnected
	expect(t, e.postJSON("/send", ok), 503, "not_connected")
	rec := e.postJSON("/send", ok)
	m = expect(t, rec, 429, "rate_limited")
	if m["retry_after_seconds"].(float64) < 1 || rec.Header().Get("Retry-After") == "" {
		t.Fatalf("%v", m)
	}
}

func TestSendFailure(t *testing.T) {
	e := newEnv(t, nil).ready()
	e.fake.sendErr = errors.New("recusado")
	expect(t, e.postJSON("/send", `{"recipient":"5531999990001","text":"oi"}`), 502, "send_failed")
}

func TestSendWithoutAllowlistReachesAnyContactAndGroups(t *testing.T) {
	e := newEnv(t, func(o *Options) { o.Allowlist = nil; o.SendMaxPerHour = 5 }).ready()
	for _, to := range []string{"5511988887777", "120363000000000001@g.us", "123456789012345@lid"} {
		if m := decode(t, e.postJSON("/send", `{"recipient":"`+to+`","text":"oi"}`)); m["id"] != "SENT1" {
			t.Fatalf("%s: %v", to, m)
		}
	}
	want := "5511988887777@s.whatsapp.net|oi"
	if len(e.fake.sent) != 3 || e.fake.sent[0] != want || e.fake.sent[1] != "120363000000000001@g.us|oi" {
		t.Fatalf("%v", e.fake.sent)
	}
	expect(t, e.postJSON("/send", `{"recipient":"status@broadcast","text":"oi"}`), 400, "bad_request")
}

func TestSendReplyQuotesStoredMessage(t *testing.T) {
	e := newEnv(t, func(o *Options) { o.Allowlist = nil; o.SendMaxPerHour = 1 }).ready()
	e.seed()
	missing := `{"recipient":"5531999990001","text":"oi","reply_to":"G1"}`
	expect(t, e.postJSON("/send", missing), 404, "quoted_not_found")
	tooLong := `{"recipient":"5531999990001","text":"oi","reply_to":"` + strings.Repeat("x", 201) + `"}`
	expect(t, e.postJSON("/send", tooLong), 400, "bad_request")
	ok := `{"recipient":"120363000000000001@g.us","text":"combinado","reply_to":"G1"}`
	if m := decode(t, e.postJSON("/send", ok)); m["id"] != "SENT1" {
		t.Fatalf("%v", m)
	}
	if e.fake.sent[0] != "120363000000000001@g.us|combinado|quote:G1" {
		t.Fatalf("%v", e.fake.sent)
	}
}
