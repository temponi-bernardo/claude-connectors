// Package config lê e valida as variáveis de ambiente da ponte (ver API.md).
package config

import (
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
	_ "time/tzdata" // fusos embutidos: a imagem não tem /usr/share/zoneinfo
)

// Config reúne a configuração já validada.
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

// Getenv é a assinatura de os.Getenv, injetável em testes.
type Getenv func(string) string

const minTokenLen = 32

// Load lê e valida todas as variáveis; o erro nunca contém valores secretos.
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

// loadNumbers preenche os campos numéricos com padrão e faixa.
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

// parseToken normaliza o token (sem espaços nas pontas).
func parseToken(v string) string { return strings.TrimSpace(v) }

// checkToken exige token com pelo menos 32 caracteres.
func checkToken(v string) error {
	if len(parseToken(v)) < minTokenLen {
		return errors.New("BRIDGE_TOKEN ausente ou com menos de 32 caracteres")
	}
	return nil
}

// parseKey decodifica a chave base64 (padrão ou URL, com ou sem padding) e exige 32 bytes.
func parseKey(v string) ([]byte, error) {
	v = strings.TrimSpace(v)
	for _, enc := range []*base64.Encoding{base64.StdEncoding, base64.RawStdEncoding, base64.URLEncoding, base64.RawURLEncoding} {
		if key, err := enc.DecodeString(v); err == nil && len(key) == 32 {
			return key, nil
		}
	}
	return nil, errors.New("SNAPSHOT_KEY precisa ser 32 bytes em base64")
}

// parseInt lê um inteiro com padrão e faixa [lo, hi].
func parseInt(v string, def, lo, hi int) (int, error) {
	v = strings.TrimSpace(v)
	if v == "" {
		return def, nil
	}
	n, err := strconv.Atoi(v)
	if err != nil || n < lo || n > hi {
		return def, fmt.Errorf("precisa ser inteiro entre %d e %d", lo, hi)
	}
	return n, nil
}

// parseBool lê true/false/1/0 com padrão.
func parseBool(v string, def bool) (bool, error) {
	v = strings.TrimSpace(v)
	if v == "" {
		return def, nil
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return def, errors.New("precisa ser true ou false")
	}
	return b, nil
}

// ParseAllowlist normaliza a lista de destinatários: dígitos viram JID de usuário; JIDs são mantidos.
func ParseAllowlist(v string) ([]string, error) {
	var out []string
	for _, item := range strings.Split(v, ",") {
		item = strings.TrimSpace(item)
		if item == "" {
			continue
		}
		jid, ok := NormalizeRecipient(item)
		if !ok {
			return nil, fmt.Errorf("entrada inválida na posição %d", len(out)+1)
		}
		out = append(out, jid)
	}
	return out, nil
}

// NormalizeRecipient converte "5531999999999" ou um JID ("...@s.whatsapp.net", "...@g.us") para a forma JID.
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

// isGroupUser aceita o formato antigo de grupo "criador-timestamp".
func isGroupUser(u string) bool {
	a, b, ok := strings.Cut(u, "-")
	return ok && isDigits(a, 5, 30) && isDigits(b, 5, 30)
}

// isDigits diz se s tem só dígitos ASCII e comprimento entre lo e hi.
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

// orDefault devolve def quando v está vazio.
func orDefault(v, def string) string {
	if strings.TrimSpace(v) == "" {
		return def
	}
	return strings.TrimSpace(v)
}

// wrap prefixa o erro com o nome da variável.
func wrap(name string, err error) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", name, err)
}

// appendErr acrescenta err à lista se não for nil.
func appendErr(errs []error, err error) []error {
	if err != nil {
		return append(errs, err)
	}
	return errs
}
