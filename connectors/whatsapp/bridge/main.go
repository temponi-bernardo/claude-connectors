// Comando bridge: ponte HTTP interna entre o Worker (Durable Object) e o WhatsApp via whatsmeow.
package main

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"runtime/debug"
	"strconv"
	"syscall"
	"time"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/api"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/bridge"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/config"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/wa"
)

// maxRestore é o teto do snapshot recebido no /restore e de cada banco extraído.
const maxRestore = 1 << 30

// memoryLimit é o alvo de heap do GC (o container lite tem 256 MiB no total).
const memoryLimit = 160 << 20

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	if err := run(log); err != nil {
		log.Error("a ponte parou com erro", "err", err.Error())
		os.Exit(1)
	}
}

// run carrega a configuração, sobe o HTTP e espera o SIGTERM.
func run(log *slog.Logger) error {
	cfg, err := config.Load(os.Getenv)
	if err != nil {
		return err
	}
	if os.Getenv("GOMEMLIMIT") == "" {
		debug.SetMemoryLimit(memoryLimit)
	}
	b := bridge.New(bridge.Options{DataDir: cfg.DataDir, SnapshotKey: cfg.SnapshotKey, MaxRestore: maxRestore, Log: log,
		Start: startWhatsApp(cfg.HistoryDays, log)})
	srv := api.NewHTTPServer(":"+strconv.Itoa(cfg.Port), api.New(b, apiOptions(cfg, log)).Handler())
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
	defer stop()
	errCh := make(chan error, 1)
	go func() { errCh <- srv.ListenAndServe() }()
	log.Info("ponte ouvindo", "porta", cfg.Port)
	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
	}
	shutdown(srv, b, cfg, log)
	return nil
}

// apiOptions traduz a configuração para a API.
func apiOptions(cfg config.Config, log *slog.Logger) api.Options {
	return api.Options{Token: cfg.Token, Location: cfg.Location, MaxMediaBytes: cfg.MaxMediaBytes, MaxRestore: maxRestore,
		EnableSend: cfg.EnableSend, Allowlist: cfg.SendAllowlist, SendMaxPerHour: cfg.SendMaxPerHour, Log: log}
}

// startWhatsApp cria o StartFunc que liga o whatsmeow aos bancos restaurados.
func startWhatsApp(historyDays int, log *slog.Logger) bridge.StartFunc {
	return func(ctx context.Context, sessionDB *sql.DB, st *store.Store) (bridge.WhatsApp, error) {
		m, err := wa.New(ctx, wa.Options{SessionDB: sessionDB, Store: st, HistoryDays: historyDays, Log: log})
		if err != nil {
			return nil, err
		}
		m.Start()
		return m, nil
	}
}

// shutdown para de aceitar requisições, desconecta e faz o push best-effort do snapshot.
func shutdown(srv *http.Server, b *bridge.Bridge, cfg config.Config, log *slog.Logger) {
	log.Info("SIGTERM recebido; encerrando")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Warn("encerramento do HTTP", "err", err.Error())
	}
	b.Shutdown(context.Background(), &http.Client{Timeout: bridge.PushTimeout}, cfg.SnapshotPushURL, cfg.Token)
}
