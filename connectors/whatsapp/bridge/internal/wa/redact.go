package wa

import (
	"context"
	"fmt"
	"log/slog"
	"regexp"
	"strings"

	waLog "go.mau.fi/whatsmeow/util/log"
)

// MaskPhone masks a number for display: "+55 31 9****-**12" (Brazil) or "+44 *******89" (others).
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

// longDigits matches sequences that may be a phone number or a user identifier.
var longDigits = regexp.MustCompile(`\d{6,}`)

// Redact replaces long digit sequences with masked versions (logs never carry a full number).
func Redact(s string) string {
	return longDigits.ReplaceAllStringFunc(s, func(d string) string {
		return d[:2] + strings.Repeat("*", len(d)-4) + d[len(d)-2:]
	})
}

// slogLogger adapts the whatsmeow log to slog, with redaction and without the debug level.
type slogLogger struct {
	log    *slog.Logger
	module string
}

// NewLogger creates the whatsmeow logger from a slog.Logger.
func NewLogger(l *slog.Logger, module string) waLog.Logger {
	return &slogLogger{log: l, module: module}
}

// emit formats, redacts and logs at the requested level.
func (s *slogLogger) emit(level slog.Level, msg string, args ...any) {
	s.log.Log(context.Background(), level, Redact(fmt.Sprintf(msg, args...)), "module", s.module)
}

// Errorf logs an error.
func (s *slogLogger) Errorf(msg string, args ...any) { s.emit(slog.LevelError, msg, args...) }

// Warnf logs a warning.
func (s *slogLogger) Warnf(msg string, args ...any) { s.emit(slog.LevelWarn, msg, args...) }

// Infof logs an info message.
func (s *slogLogger) Infof(msg string, args ...any) { s.emit(slog.LevelInfo, msg, args...) }

// Debugf is discarded: whatsmeow debug output may contain message content.
func (s *slogLogger) Debugf(string, ...any) {}

// Sub creates a sublogger for a module.
func (s *slogLogger) Sub(module string) waLog.Logger {
	return &slogLogger{log: s.log, module: s.module + "/" + module}
}
