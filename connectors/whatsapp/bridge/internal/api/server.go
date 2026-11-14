// Package api exposes the bridge over internal HTTP (contract in API.md).
package api

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/json"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/bridge"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// Options configures the API.
type Options struct {
	Token          string
	Location       *time.Location
	MaxMediaBytes  int64
	MaxRestore     int64
	EnableSend     bool
	Allowlist      []string // already normalized JIDs
	SendMaxPerHour int
	Log            *slog.Logger
	Now            func() time.Time
}

// Server wires the routes to the bridge.
type Server struct {
	opts      Options
	b         *bridge.Bridge
	allowlist map[string]bool
	tokenHash [32]byte
}

// maxJSONBody limits JSON bodies (pairing, sending).
const maxJSONBody = 64 << 10

// New creates the API server.
func New(b *bridge.Bridge, opts Options) *Server {
	if opts.Now == nil {
		opts.Now = time.Now
	}
	s := &Server{opts: opts, b: b, allowlist: map[string]bool{}, tokenHash: sha256.Sum256([]byte(opts.Token))}
	for _, jid := range opts.Allowlist {
		s.allowlist[jid] = true
	}
	return s
}

// Handler builds the router with authentication, phase check and access log.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.Handle("POST /restore", s.auth(http.HandlerFunc(s.handleRestore)))
	for pattern, h := range s.readyRoutes() {
		mux.Handle(pattern, s.auth(s.requireReady(h)))
	}
	return s.logRequests(mux)
}

// readyRoutes lists the routes that only work in the ready phase.
func (s *Server) readyRoutes() map[string]http.HandlerFunc {
	return map[string]http.HandlerFunc{
		"GET /snapshot":   s.handleSnapshot,
		"GET /status":     s.handleStatus,
		"POST /sync/wait": s.handleSyncWait,
		"GET /chats":      s.handleChats,
		"GET /messages":   s.handleMessages,
		"GET /search":     s.handleSearch,
		"GET /contacts":   s.handleContacts,
		"GET /media":      s.handleMedia,
		"POST /pair/code": s.handlePairCode,
		"GET /pair/qr":    s.handlePairQR,
		"POST /logout":    s.handleLogout,
		"POST /send":      s.handleSend,
	}
}

// NewHTTPServer creates the http.Server with timeouts (/restore and /snapshot can be large).
func NewHTTPServer(addr string, h http.Handler) *http.Server {
	return &http.Server{Addr: addr, Handler: h, ReadHeaderTimeout: 10 * time.Second, ReadTimeout: 10 * time.Minute,
		WriteTimeout: 10 * time.Minute, IdleTimeout: 2 * time.Minute, MaxHeaderBytes: 16 << 10}
}

// tokenMatches compares the token in constant time (hashed first, so the length does not leak).
func (s *Server) tokenMatches(header string) bool {
	token, ok := strings.CutPrefix(header, "Bearer ")
	if !ok {
		return false
	}
	got := sha256.Sum256([]byte(token))
	return subtle.ConstantTimeCompare(got[:], s.tokenHash[:]) == 1
}

// auth requires the Worker's Bearer token.
func (s *Server) auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !s.tokenMatches(r.Header.Get("Authorization")) {
			writeError(w, http.StatusUnauthorized, "unauthorized", "Missing or invalid token.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// requireReady answers 503 with the phase while the bridge is not ready.
func (s *Server) requireReady(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if phase := s.b.Phase(); phase != bridge.PhaseReady {
			writeJSON(w, http.StatusServiceUnavailable, map[string]any{"error": "not_ready", "phase": phase,
				"message": "The bridge is still starting."})
			return
		}
		next(w, r)
	})
}

// handleHealth returns the phase (no authentication).
func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"phase": s.b.Phase()})
}

// st and client are shortcuts to the database and the client (valid in the ready phase).
func (s *Server) st() *store.Store        { return s.b.Store() }
func (s *Server) client() bridge.WhatsApp { return s.b.WhatsApp() }

// statusRecorder keeps the status for the access log.
type statusRecorder struct {
	http.ResponseWriter
	status int
}

// WriteHeader records the status and passes it on.
func (r *statusRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

// logRequests logs method, path (without the query, which may hold names and numbers), status and duration.
func (s *Server) logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		s.opts.Log.Info("http", "method", r.Method, "path", r.URL.Path, "status", rec.status, "ms", time.Since(start).Milliseconds())
	})
}

// writeJSON writes v as JSON with the given status.
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// writeError writes the error as {"error","message"}.
func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]string{"error": code, "message": message})
}

// badRequest is the shortcut for 400.
func badRequest(w http.ResponseWriter, message string) {
	writeError(w, http.StatusBadRequest, "bad_request", message)
}

// internalError logs the failure and answers 500 without details.
func (s *Server) internalError(w http.ResponseWriter, what string, err error) {
	s.opts.Log.Error(what, "err", err.Error())
	writeError(w, http.StatusInternalServerError, "internal", "Internal bridge error.")
}
