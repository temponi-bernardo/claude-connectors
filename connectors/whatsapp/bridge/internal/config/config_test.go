package config

import (
	"encoding/base64"
	"strings"
	"testing"
)

func envMap(m map[string]string) Getenv { return func(k string) string { return m[k] } }

func validEnv() map[string]string {
	return map[string]string{
		"BRIDGE_TOKEN": strings.Repeat("t", 40),
		"SNAPSHOT_KEY": base64.StdEncoding.EncodeToString(make([]byte, 32)),
	}
}

func TestLoadDefaults(t *testing.T) {
	c, err := Load(envMap(validEnv()))
	if err != nil {
		t.Fatal(err)
	}
	if c.DataDir != "/data" || c.Port != 8080 || c.HistoryDays != 90 || c.MaxMediaBytes != 5242880 ||
		c.EnableSend || c.SendMaxPerHour != 10 || c.Location.String() != "America/Sao_Paulo" || len(c.SnapshotKey) != 32 {
		t.Fatalf("wrong defaults: %+v", c)
	}
}

func TestLoadOverrides(t *testing.T) {
	env := validEnv()
	env["SNAPSHOT_KEY"] = base64.RawURLEncoding.EncodeToString(make([]byte, 32))
	env["PORT"], env["TIMEZONE"], env["ENABLE_SEND"] = "9090", "UTC", "true"
	env["SEND_ALLOWLIST"] = " 5531999999999, 1203630@g.us ,"
	env["DATA_DIR"], env["SNAPSHOT_PUSH_URL"] = "/tmp/x", " https://e.x/p "
	c, err := Load(envMap(env))
	if err != nil {
		t.Fatal(err)
	}
	if c.Port != 9090 || !c.EnableSend || c.Location.String() != "UTC" || c.DataDir != "/tmp/x" || c.SnapshotPushURL != "https://e.x/p" {
		t.Fatalf("overrides ignored: %+v", c)
	}
	if len(c.SendAllowlist) != 2 || c.SendAllowlist[0] != "5531999999999@s.whatsapp.net" || c.SendAllowlist[1] != "1203630@g.us" {
		t.Fatalf("allowlist: %v", c.SendAllowlist)
	}
}

func TestLoadErrorsDoNotLeakSecrets(t *testing.T) {
	env := map[string]string{"BRIDGE_TOKEN": "short-secret", "SNAPSHOT_KEY": "invalid-key", "PORT": "0",
		"TIMEZONE": "Mars/Base", "ENABLE_SEND": "maybe", "SEND_ALLOWLIST": "abc", "HISTORY_DAYS": "x",
		"MAX_MEDIA_BYTES": "-1", "SEND_MAX_PER_HOUR": "99999"}
	_, err := Load(envMap(env))
	if err == nil {
		t.Fatal("expected an error")
	}
	msg := err.Error()
	for _, want := range []string{"BRIDGE_TOKEN", "SNAPSHOT_KEY", "PORT", "TIMEZONE", "ENABLE_SEND", "SEND_ALLOWLIST", "HISTORY_DAYS", "MAX_MEDIA_BYTES", "SEND_MAX_PER_HOUR"} {
		if !strings.Contains(msg, want) {
			t.Errorf("error without %s: %s", want, msg)
		}
	}
	if strings.Contains(msg, "short-secret") || strings.Contains(msg, "invalid-key") {
		t.Fatal("error leaked a secret")
	}
}

func TestNormalizeRecipient(t *testing.T) {
	cases := map[string]string{
		"5531999999999":                 "5531999999999@s.whatsapp.net",
		"+5531999999999":                "5531999999999@s.whatsapp.net",
		"5531999999999@s.whatsapp.net":  "5531999999999@s.whatsapp.net",
		"120363000000000000@g.us":       "120363000000000000@g.us",
		"5531999999999-1500000000@g.us": "5531999999999-1500000000@g.us",
		"123456789012@lid":              "123456789012@lid",
		"abc":                           "",
		"55@s.whatsapp.net":             "",
		"5531999999999@evil.com":        "",
		"55319999-999@s.whatsapp.net":   "",
	}
	for in, want := range cases {
		got, ok := NormalizeRecipient(in)
		if got != want || ok != (want != "") {
			t.Errorf("%q → %q,%v; expected %q", in, got, ok, want)
		}
	}
}
