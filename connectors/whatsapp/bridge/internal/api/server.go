// Package api expõe a ponte por HTTP interno (contrato em API.md).
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

// Options configura a API.
type Options struct {
	Token          string
	Location       *time.Location
	MaxMediaBytes  int64
	MaxRestore     int64
	EnableSend     bool
	Allowlist      []string // JIDs já normalizados
	SendMaxPerHour int
	Log            *slog.Logger
	Now            func() time.Time
}

// Server liga as rotas à ponte.
type Server struct {
	opts      Options
	b         *bridge.Bridge
	allowlist map[string]bool
	tokenHash [32]byte
}

// maxJSONBody é o limite dos corpos JSON (pareamento, envio).
const maxJSONBody = 64 << 10

// New cria o servidor da API.
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

// Handler monta o roteador com autenticação, fase e log de acesso.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.Handle("POST /restore", s.auth(http.HandlerFunc(s.handleRestore)))
	for pattern, h := range s.readyRoutes() {
		mux.Handle(pattern, s.auth(s.requireReady(h)))
	}
	return s.logRequests(mux)
}

// readyRoutes lista as rotas que só funcionam na fase ready.
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

// NewHTTPServer cria o http.Server com timeouts (o /restore e o /snapshot podem ser grandes).
func NewHTTPServer(addr string, h http.Handler) *http.Server {
	return &http.Server{Addr: addr, Handler: h, ReadHeaderTimeout: 10 * time.Second, ReadTimeout: 10 * time.Minute,
		WriteTimeout: 10 * time.Minute, IdleTimeout: 2 * time.Minute, MaxHeaderBytes: 16 << 10}
}

// tokenMatches compara o token em tempo constante (hash antes, para não vazar o tamanho).
func (s *Server) tokenMatches(header string) bool {
	token, ok := strings.CutPrefix(header, "Bearer ")
	if !ok {
		return false
	}
	got := sha256.Sum256([]byte(token))
	return subtle.ConstantTimeCompare(got[:], s.tokenHash[:]) == 1
}

// auth exige o Bearer token do Worker.
func (s *Server) auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !s.tokenMatches(r.Header.Get("Authorization")) {
			writeError(w, http.StatusUnauthorized, "unauthorized", "Token ausente ou inválido.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// requireReady responde 503 com a fase enquanto a ponte não estiver pronta.
func (s *Server) requireReady(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if phase := s.b.Phase(); phase != bridge.PhaseReady {
			writeJSON(w, http.StatusServiceUnavailable, map[string]any{"error": "not_ready", "phase": phase,
				"message": "A ponte ainda está iniciando."})
			return
		}
		next(w, r)
	})
}

// handleHealth devolve a fase (sem autenticação).
func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"phase": s.b.Phase()})
}

// st e client são atalhos para o banco e o cliente (válidos na fase ready).
func (s *Server) st() *store.Store        { return s.b.Store() }
func (s *Server) client() bridge.WhatsApp { return s.b.WhatsApp() }

// statusRecorder guarda o status para o log de acesso.
type statusRecorder struct {
	http.ResponseWriter
	status int
}

// WriteHeader registra o status e repassa.
func (r *statusRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

// logRequests registra método, caminho (sem query, que pode ter nomes e números), status e duração.
func (s *Server) logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		s.opts.Log.Info("http", "method", r.Method, "path", r.URL.Path, "status", rec.status, "ms", time.Since(start).Milliseconds())
	})
}

// writeJSON grava v como JSON com o status dado.
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// writeError grava o erro no formato {"error","message"}.
func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]string{"error": code, "message": message})
}

// badRequest é o atalho para 400.
func badRequest(w http.ResponseWriter, message string) {
	writeError(w, http.StatusBadRequest, "bad_request", message)
}

// internalError registra a falha e responde 500 sem detalhes.
func (s *Server) internalError(w http.ResponseWriter, what string, err error) {
	s.opts.Log.Error(what, "err", err.Error())
	writeError(w, http.StatusInternalServerError, "internal", "Erro interno da ponte.")
}
