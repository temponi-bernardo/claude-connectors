package store

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
)

// Cursor marca uma posição de paginação: (instante, chave de desempate).
type Cursor struct {
	TS  int64  `json:"t"`
	Key string `json:"k"`
}

// ErrBadCursor indica cursor que não foi gerado pela ponte ou foi adulterado.
var ErrBadCursor = errors.New("cursor inválido")

const (
	maxCursorLen    = 512
	maxCursorKeyLen = 256
)

// EncodeCursor serializa o cursor como base64url de JSON (opaco para o Worker).
func EncodeCursor(c Cursor) string {
	raw, _ := json.Marshal(c)
	return base64.RawURLEncoding.EncodeToString(raw)
}

// DecodeCursor valida e decodifica um cursor; "" devolve nil sem erro.
func DecodeCursor(s string) (*Cursor, error) {
	if s == "" {
		return nil, nil
	}
	if len(s) > maxCursorLen {
		return nil, ErrBadCursor
	}
	raw, err := base64.RawURLEncoding.DecodeString(s)
	if err != nil {
		return nil, ErrBadCursor
	}
	dec := json.NewDecoder(bytes.NewReader(raw))
	dec.DisallowUnknownFields()
	var c Cursor
	if err := dec.Decode(&c); err != nil || dec.More() || !validCursor(c) {
		return nil, ErrBadCursor
	}
	return &c, nil
}

// validCursor confere faixas e tamanho da chave.
func validCursor(c Cursor) bool {
	return c.TS >= 0 && c.Key != "" && len(c.Key) <= maxCursorKeyLen
}
