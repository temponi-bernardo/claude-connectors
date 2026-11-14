// Package config reads and validates the bridge environment variables (see API.md).
package config

import (
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
	_ "time/tzdata" // embedded time zones: the image has no /usr/share/zoneinfo
)

// Config holds the validated configuration.
type Config struct {
	Token           string
	SnapshotKey     []byte
	DataDir         string
	Port            int
	Location        *time.Location
	HistoryDays     int
	MaxMediaBytes   int64
	EnableSend      bool
	SendAllowlist   []string
	SendMaxPerHour  int
	SnapshotPushURL string
}

// Getenv is the os.Getenv signature, injectable in tests.
type Getenv func(string) string

const minTokenLen = 32

// Load reads and validates every variable; the error never contains secret values.
func Load(env Getenv) (Config, error) {
	c := Config{DataDir: orDefault(env("DATA_DIR"), "/data"), SnapshotPushURL: strings.TrimSpace(env("SNAPSHOT_PUSH_URL"))}
	var errs []error
	c.Token, errs = parseToken(env("BRIDGE_TOKEN")), appendErr(errs, checkToken(env("BRIDGE_TOKEN")))
	key, err := parseKey(env("SNAPSHOT_KEY"))
	c.SnapshotKey, errs = key, appendErr(errs, err)
	c.Location, err = time.LoadLocation(orDefault(env("TIMEZONE"), "America/Sao_Paulo"))
	errs = appendErr(errs, wrap("TIMEZONE", err))
	errs = appendErr(errs, loadNumbers(&c, env))
	c.EnableSend, err = parseBool(env("ENABLE_SEND"), false)
	errs = appendErr(errs, wrap("ENABLE_SEND", err))
	c.SendAllowlist, err = ParseAllowlist(env("SEND_ALLOWLIST"))
	errs = appendErr(errs, wrap("SEND_ALLOWLIST", err))
	return c, errors.Join(errs...)
}

// loadNumbers fills the numeric fields with a default and a range.
func loadNumbers(c *Config, env Getenv) error {
	var errs []error
	var err error
	c.Port, err = parseInt(env("PORT"), 8080, 1, 65535)
	errs = appendErr(errs, wrap("PORT", err))
	c.HistoryDays, err = parseInt(env("HISTORY_DAYS"), 90, 1, 3650)
	errs = appendErr(errs, wrap("HISTORY_DAYS", err))
	media, err := parseInt(env("MAX_MEDIA_BYTES"), 5242880, 1, 100<<20)
	c.MaxMediaBytes = int64(media)
	errs = appendErr(errs, wrap("MAX_MEDIA_BYTES", err))
	c.SendMaxPerHour, err = parseInt(env("SEND_MAX_PER_HOUR"), 10, 0, 1000)
	errs = appendErr(errs, wrap("SEND_MAX_PER_HOUR", err))
	return errors.Join(errs...)
}

// parseToken normalizes the token (no surrounding whitespace).
func parseToken(v string) string { return strings.TrimSpace(v) }

// checkToken requires a token of at least 32 characters.
func checkToken(v string) error {
	if len(parseToken(v)) < minTokenLen {
		return errors.New("BRIDGE_TOKEN missing or shorter than 32 characters")
	}
	return nil
}

// parseKey decodes the base64 key (standard or URL, with or without padding) and requires 32 bytes.
func parseKey(v string) ([]byte, error) {
	v = strings.TrimSpace(v)
	for _, enc := range []*base64.Encoding{base64.StdEncoding, base64.RawStdEncoding, base64.URLEncoding, base64.RawURLEncoding} {
		if key, err := enc.DecodeString(v); err == nil && len(key) == 32 {
			return key, nil
		}
	}
	return nil, errors.New("SNAPSHOT_KEY must be 32 bytes in base64")
}

// parseInt reads an integer with a default and a range [lo, hi].
func parseInt(v string, def, lo, hi int) (int, error) {
	v = strings.TrimSpace(v)
	if v == "" {
		return def, nil
	}
	n, err := strconv.Atoi(v)
	if err != nil || n < lo || n > hi {
		return def, fmt.Errorf("must be an integer between %d and %d", lo, hi)
	}
	return n, nil
}

// parseBool reads true/false/1/0 with a default.
func parseBool(v string, def bool) (bool, error) {
	v = strings.TrimSpace(v)
	if v == "" {
		return def, nil
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return def, errors.New("must be true or false")
	}
	return b, nil
}

// ParseAllowlist normalizes the recipient list: digits become a user JID; JIDs are kept.
func ParseAllowlist(v string) ([]string, error) {
	var out []string
	for _, item := range strings.Split(v, ",") {
		item = strings.TrimSpace(item)
		if item == "" {
			continue
		}
		jid, ok := NormalizeRecipient(item)
		if !ok {
			return nil, fmt.Errorf("invalid entry at position %d", len(out)+1)
		}
		out = append(out, jid)
	}
	return out, nil
}

// NormalizeRecipient converts "5531999999999" or a JID ("...@s.whatsapp.net", "...@g.us") to JID form.
func NormalizeRecipient(v string) (string, bool) {
	v = strings.TrimPrefix(strings.TrimSpace(v), "+")
	user, server, hasAt := strings.Cut(v, "@")
	if !hasAt {
		server = "s.whatsapp.net"
	}
	if !isDigits(user, 5, 30) && !(server == "g.us" && isGroupUser(user)) {
		return "", false
	}
	switch server {
	case "s.whatsapp.net", "g.us", "lid":
		return user + "@" + server, true
	}
	return "", false
}

// isGroupUser accepts the legacy group format "creator-timestamp".
func isGroupUser(u string) bool {
	a, b, ok := strings.Cut(u, "-")
	return ok && isDigits(a, 5, 30) && isDigits(b, 5, 30)
}

// isDigits reports whether s has only ASCII digits and a length between lo and hi.
func isDigits(s string, lo, hi int) bool {
	if len(s) < lo || len(s) > hi {
		return false
	}
	for _, r := range s {
		if r < '0' || r > '9' {
			return false
		}
	}
	return true
}

// orDefault returns def when v is empty.
func orDefault(v, def string) string {
	if strings.TrimSpace(v) == "" {
		return def
	}
	return strings.TrimSpace(v)
}

// wrap prefixes the error with the variable name.
func wrap(name string, err error) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", name, err)
}

// appendErr appends err to the list when it is not nil.
func appendErr(errs []error, err error) []error {
	if err != nil {
		return append(errs, err)
	}
	return errs
}
