package wa

import (
	"context"
	"fmt"
	"log/slog"
	"regexp"
	"strings"

	waLog "go.mau.fi/whatsmeow/util/log"
)

// MaskPhone mascara um número para exibição: "+55 31 9****-**12" (Brasil) ou "+44 *******89" (demais).
func MaskPhone(digits string) string {
	if len(digits) < 6 {
		return strings.Repeat("*", len(digits))
	}
	last := digits[len(digits)-2:]
	if strings.HasPrefix(digits, "55") && (len(digits) == 12 || len(digits) == 13) {
		local := digits[4:]
		return fmt.Sprintf("+55 %s %c%s-**%s", digits[2:4], local[0], strings.Repeat("*", len(local)-5), last)
	}
	return fmt.Sprintf("+%s %s%s", digits[:2], strings.Repeat("*", len(digits)-4), last)
}

// longDigits casa sequências que podem ser telefone ou identificador de usuário.
var longDigits = regexp.MustCompile(`\d{6,}`)

// Redact troca sequências longas de dígitos por versões mascaradas (logs nunca levam número completo).
func Redact(s string) string {
	return longDigits.ReplaceAllStringFunc(s, func(d string) string {
		return d[:2] + strings.Repeat("*", len(d)-4) + d[len(d)-2:]
	})
}

// slogLogger adapta o log do whatsmeow ao slog, com redação e sem nível debug.
type slogLogger struct {
	log    *slog.Logger
	module string
}

// NewLogger cria o logger do whatsmeow a partir de um slog.Logger.
func NewLogger(l *slog.Logger, module string) waLog.Logger {
	return &slogLogger{log: l, module: module}
}

// emit formata, aplica a redação e grava no nível pedido.
func (s *slogLogger) emit(level slog.Level, msg string, args ...any) {
	s.log.Log(context.Background(), level, Redact(fmt.Sprintf(msg, args...)), "module", s.module)
}

// Errorf grava um erro.
func (s *slogLogger) Errorf(msg string, args ...any) { s.emit(slog.LevelError, msg, args...) }

// Warnf grava um aviso.
func (s *slogLogger) Warnf(msg string, args ...any) { s.emit(slog.LevelWarn, msg, args...) }

// Infof grava uma informação.
func (s *slogLogger) Infof(msg string, args ...any) { s.emit(slog.LevelInfo, msg, args...) }

// Debugf é descartado: o debug do whatsmeow pode conter conteúdo de mensagens.
func (s *slogLogger) Debugf(string, ...any) {}

// Sub cria um sublogger para um módulo.
func (s *slogLogger) Sub(module string) waLog.Logger {
	return &slogLogger{log: s.log, module: s.module + "/" + module}
}
