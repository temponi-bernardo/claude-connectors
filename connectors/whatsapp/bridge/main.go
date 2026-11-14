// Command bridge: internal HTTP bridge between the Worker (Durable Object) and WhatsApp via whatsmeow.
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

// maxRestore caps the snapshot received on /restore and each extracted database.
const maxRestore = 1 << 30

// memoryLimit is the GC heap target (the lite container has 256 MiB in total).
const memoryLimit = 160 << 20

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	if err := run(log); err != nil {
		log.Error("the bridge stopped with an error", "err", err.Error())
		os.Exit(1)
	}
}

// run loads the configuration, starts HTTP and waits for SIGTERM.
func run(log *slog.Logger) error {
	cfg, err := config.Load(os.Getenv)
	if err != nil {
		return err
	}
	if os.Getenv("GOMEMLIMIT") == "" {
		debug.SetMemoryLimit(memoryLimit)
	}
	b := newBridge(cfg, log)
	srv := api.NewHTTPServer(":"+strconv.Itoa(cfg.Port), api.New(b, apiOptions(cfg, log)).Handler())
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
	defer stop()
	errCh := make(chan error, 1)
	go func() { errCh <- srv.ListenAndServe() }()
	log.Info("bridge listening", "port", cfg.Port)
	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
	}
	shutdown(srv, b, cfg, log)
	return nil
}

// newBridge creates the bridge; every session change (paired, connected, logged out) pushes the snapshot to the Worker right away.
func newBridge(cfg config.Config, log *slog.Logger) *bridge.Bridge {
	var b *bridge.Bridge
	onChange := func() {
		b.SnapshotNotifier(&http.Client{Timeout: bridge.PushTimeout}, cfg.SnapshotPushURL, cfg.Token)()
	}
	b = bridge.New(bridge.Options{DataDir: cfg.DataDir, SnapshotKey: cfg.SnapshotKey, MaxRestore: maxRestore, Log: log,
		Start: startWhatsApp(cfg.HistoryDays, log, onChange)})
	return b
}

// apiOptions maps the configuration to the API options.
func apiOptions(cfg config.Config, log *slog.Logger) api.Options {
	return api.Options{Token: cfg.Token, Location: cfg.Location, MaxMediaBytes: cfg.MaxMediaBytes, MaxRestore: maxRestore,
		EnableSend: cfg.EnableSend, Allowlist: cfg.SendAllowlist, SendMaxPerHour: cfg.SendMaxPerHour, Log: log}
}

// startWhatsApp creates the StartFunc that wires whatsmeow to the restored databases.
// onChange is called when the session changes (paired, connected, logged out), to push the snapshot right away.
func startWhatsApp(historyDays int, log *slog.Logger, onChange func()) bridge.StartFunc {
	return func(ctx context.Context, sessionDB *sql.DB, st *store.Store) (bridge.WhatsApp, error) {
		m, err := wa.New(ctx, wa.Options{SessionDB: sessionDB, Store: st, HistoryDays: historyDays, Log: log,
			OnSessionChange: onChange})
		if err != nil {
			return nil, err
		}
		m.Start()
		return m, nil
	}
}

// shutdown stops accepting requests, disconnects and pushes the snapshot best-effort.
func shutdown(srv *http.Server, b *bridge.Bridge, cfg config.Config, log *slog.Logger) {
	log.Info("SIGTERM received; shutting down")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Warn("HTTP shutdown", "err", err.Error())
	}
	b.Shutdown(context.Background(), &http.Client{Timeout: bridge.PushTimeout}, cfg.SnapshotPushURL, cfg.Token)
}
