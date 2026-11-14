package wa

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"
	"sync"
	"sync/atomic"
	"time"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	wastore "go.mau.fi/whatsmeow/store"
	"go.mau.fi/whatsmeow/store/sqlstore"
	"go.mau.fi/whatsmeow/types"
	"google.golang.org/protobuf/proto"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// State is the client snapshot for /status.
type State struct {
	Connected           bool
	LoggedIn            bool
	NeedsPairing        bool
	OfflineSyncComplete bool
	Account             string
	LastEventAt         time.Time
}

// QRCode is the current pairing QR.
type QRCode struct {
	Code      string
	ExpiresAt time.Time
}

// Sent is the result of a send.
type Sent struct {
	ID        string
	Timestamp time.Time
}

var (
	// ErrAlreadyPaired signals that a session already exists.
	ErrAlreadyPaired = errors.New("a WhatsApp session already exists")
	// ErrNoQR signals that the QR has not arrived yet.
	ErrNoQR = errors.New("the pairing QR is not available yet")
	// ErrMediaExpired signals that WhatsApp no longer has the file.
	ErrMediaExpired = errors.New("the media expired on WhatsApp")
	// ErrNotConnected signals a client that is not logged in or not connected.
	ErrNotConnected = errors.New("WhatsApp is not connected")
)

// Options configures the Manager.
type Options struct {
	SessionDB   *sql.DB
	Store       *store.Store
	HistoryDays int
	Log         *slog.Logger
	// OnSessionChange is called (in the background) when the device session changes: paired, connected or logged out.
	OnSessionChange func()
}

// Manager owns the *whatsmeow.Client and turns events into database writes.
type Manager struct {
	opts      Options
	container *sqlstore.Container
	bg        context.Context
	cancel    context.CancelFunc
	mu        sync.RWMutex
	connectMu sync.Mutex
	client    *whatsmeow.Client
	qr        QRCode
	dial      func() error // connects; replaced by a no-op in tests to avoid the network

	connected   atomic.Bool
	offlineSync atomic.Bool
	lastEvent   atomic.Int64
}

// pairDisplayName is the client name required by PairPhone ("Browser (OS)").
const pairDisplayName = "Chrome (Linux)"

// ConfigureDevice sets the linked device name and the history day limit requested from the phone.
func ConfigureDevice(historyDays int) {
	wastore.SetOSInfo("Claude", [3]uint32{1, 0, 0})
	wastore.DeviceProps.RequireFullSync = proto.Bool(false)
	wastore.DeviceProps.HistorySyncConfig.FullSyncDaysLimit = proto.Uint32(uint32(historyDays))
	wastore.DeviceProps.HistorySyncConfig.RecentSyncDaysLimit = proto.Uint32(uint32(historyDays))
}

// New prepares the whatsmeow sqlstore in session.db and creates the client (without connecting).
func New(ctx context.Context, opts Options) (*Manager, error) {
	ConfigureDevice(opts.HistoryDays)
	c := sqlstore.NewWithDB(opts.SessionDB, store.DriverName, NewLogger(opts.Log, "store"))
	if err := c.Upgrade(ctx); err != nil {
		return nil, fmt.Errorf("sqlstore: %w", err)
	}
	device, err := c.GetFirstDevice(ctx)
	if err != nil {
		return nil, fmt.Errorf("sqlstore: %w", err)
	}
	m := &Manager{opts: opts, container: c}
	m.dial = m.connect
	m.bg, m.cancel = context.WithCancel(context.Background())
	m.setClient(device)
	return m, nil
}

// Start connects in the background (with a QR if there is no session).
func (m *Manager) Start() {
	go m.logConnect()
}

// setClient replaces the current client with a new one bound to the given device.
func (m *Manager) setClient(device *wastore.Device) {
	cli := whatsmeow.NewClient(device, NewLogger(m.opts.Log, "client"))
	cli.AddEventHandler(m.handleEvent)
	m.mu.Lock()
	m.client, m.qr = cli, QRCode{}
	m.mu.Unlock()
}

// current returns the current client.
func (m *Manager) current() *whatsmeow.Client {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.client
}

// logConnect connects and only logs failures (for use in a goroutine).
func (m *Manager) logConnect() {
	if err := m.dial(); err != nil {
		m.opts.Log.Warn("failed to connect to WhatsApp", "err", Redact(err.Error()))
	}
}

// connect opens the websocket; without a session it first sets up the QR channel.
func (m *Manager) connect() error {
	m.connectMu.Lock()
	defer m.connectMu.Unlock()
	cli := m.current()
	if cli.IsConnected() {
		return nil
	}
	if cli.Store.ID == nil {
		ch, err := cli.GetQRChannel(m.bg)
		if err != nil {
			return err
		}
		go m.consumeQR(cli, ch)
	}
	return cli.Connect()
}

// consumeQR keeps the most recent QR while the channel lasts.
func (m *Manager) consumeQR(cli *whatsmeow.Client, ch <-chan whatsmeow.QRChannelItem) {
	for item := range ch {
		m.mu.Lock()
		if m.client == cli {
			m.qr = qrFromItem(item, time.Now())
		}
		m.mu.Unlock()
		if item.Event != whatsmeow.QRChannelEventCode {
			m.opts.Log.Info("pairing", "event", item.Event)
		}
	}
}

// qrFromItem decides the stored QR from a channel item (pure).
func qrFromItem(item whatsmeow.QRChannelItem, now time.Time) QRCode {
	if item.Event != whatsmeow.QRChannelEventCode {
		return QRCode{}
	}
	return QRCode{Code: item.Code, ExpiresAt: now.Add(item.Timeout)}
}

// State returns the current client state.
func (m *Manager) State() State {
	cli := m.current()
	st := State{Connected: m.connected.Load() && cli.IsConnected(), LoggedIn: cli.IsLoggedIn(),
		NeedsPairing: cli.Store.ID == nil, OfflineSyncComplete: m.offlineSync.Load()}
	if cli.Store.ID != nil {
		st.Account = MaskPhone(cli.Store.ID.User)
	}
	if ts := m.lastEvent.Load(); ts > 0 {
		st.LastEventAt = time.Unix(ts, 0)
	}
	return st
}

// QR returns the current QR; without a valid QR it reopens the pairing connection and returns ErrNoQR.
func (m *Manager) QR() (QRCode, error) {
	cli := m.current()
	if cli.Store.ID != nil {
		return QRCode{}, ErrAlreadyPaired
	}
	m.mu.RLock()
	qr := m.qr
	m.mu.RUnlock()
	if qr.Code == "" || time.Now().After(qr.ExpiresAt) {
		go m.logConnect()
		return QRCode{}, ErrNoQR
	}
	return qr, nil
}

// PairCode asks WhatsApp for a pairing code by phone number.
func (m *Manager) PairCode(ctx context.Context, phone string) (string, error) {
	cli := m.current()
	if cli.Store.ID != nil {
		return "", ErrAlreadyPaired
	}
	if err := m.dial(); err != nil {
		return "", err
	}
	if err := m.waitQR(ctx, 15*time.Second); err != nil {
		return "", err
	}
	return cli.PairPhone(ctx, phone, true, whatsmeow.PairClientChrome, pairDisplayName)
}

// waitQR waits for the first QR (a sign that the websocket is ready to pair).
func (m *Manager) waitQR(ctx context.Context, limit time.Duration) error {
	deadline := time.Now().Add(limit)
	for time.Now().Before(deadline) {
		m.mu.RLock()
		ready := m.qr.Code != ""
		m.mu.RUnlock()
		if ready {
			return nil
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(200 * time.Millisecond):
		}
	}
	return ErrNotConnected
}

// Logout logs out on the server (or only locally, if offline) and prepares a new device for pairing.
func (m *Manager) Logout(ctx context.Context) error {
	cli := m.current()
	if cli.Store.ID != nil {
		if err := cli.Logout(ctx); err != nil {
			m.opts.Log.Warn("remote logout failed; deleting the local session", "err", Redact(err.Error()))
			if derr := cli.Store.Delete(ctx); derr != nil {
				return derr
			}
		}
	}
	cli.Disconnect()
	m.resetDevice()
	return nil
}

// resetDevice resets the state and creates a new client, already waiting for pairing.
func (m *Manager) resetDevice() {
	m.connected.Store(false)
	m.offlineSync.Store(false)
	m.setClient(m.container.NewDevice())
	go m.logConnect()
}

// Outgoing is a text message to send: recipient (JID), text and, optionally, the quoted message.
type Outgoing struct {
	To    string
	Text  string
	Quote *store.Quoted
}

// buildOutgoing builds the text protobuf (pure); with a quote it uses ExtendedTextMessage + ContextInfo.
func buildOutgoing(text string, q *store.Quoted, own string) *waE2E.Message {
	if q == nil {
		return &waE2E.Message{Conversation: proto.String(text)}
	}
	participant := q.SenderJID
	if q.FromMe || participant == "" {
		participant = own
	}
	return &waE2E.Message{ExtendedTextMessage: &waE2E.ExtendedTextMessage{Text: proto.String(text),
		ContextInfo: &waE2E.ContextInfo{StanzaID: proto.String(q.ID), Participant: proto.String(participant),
			QuotedMessage: &waE2E.Message{Conversation: proto.String(q.Text)}}}}
}

// SendText sends text (optionally quoting another message) and stores the sent message in the database.
func (m *Manager) SendText(ctx context.Context, out Outgoing) (Sent, error) {
	cli := m.current()
	if !cli.IsLoggedIn() {
		return Sent{}, ErrNotConnected
	}
	jid, err := types.ParseJID(out.To)
	if err != nil {
		return Sent{}, err
	}
	own := cli.Store.GetJID().ToNonAD().String()
	resp, err := cli.SendMessage(ctx, jid, buildOutgoing(out.Text, out.Quote, own))
	if err != nil {
		return Sent{}, err
	}
	saveErr := m.opts.Store.SaveMessage(ctx, store.Message{ChatJID: jid.ToNonAD().String(), ID: resp.ID, SenderJID: own,
		FromMe: true, Timestamp: resp.Timestamp.Unix(), Type: "text", Text: out.Text})
	m.logErr("store sent message", saveErr)
	return Sent{ID: resp.ID, Timestamp: resp.Timestamp}, nil
}

// mediaTypes maps the stored type to the whatsmeow key type.
var mediaTypes = map[string]whatsmeow.MediaType{
	"image": whatsmeow.MediaImage, "sticker": whatsmeow.MediaImage, "video": whatsmeow.MediaVideo,
	"audio": whatsmeow.MediaAudio, "document": whatsmeow.MediaDocument,
}

// Download downloads and decrypts a media file from the stored metadata.
func (m *Manager) Download(ctx context.Context, md store.Media) ([]byte, error) {
	cli := m.current()
	if !cli.IsLoggedIn() {
		return nil, ErrNotConnected
	}
	data, err := cli.DownloadMediaWithPath(ctx, md.DirectPath, md.FileEncSHA256, md.FileSHA256, md.MediaKey,
		mediaTypes[md.Kind], "", false)
	if isExpired(err) {
		return nil, ErrMediaExpired
	}
	return data, err
}

// isExpired decides whether the download error means the media is gone from the server.
func isExpired(err error) bool {
	return errors.Is(err, whatsmeow.ErrMediaDownloadFailedWith404) || errors.Is(err, whatsmeow.ErrMediaDownloadFailedWith410) ||
		errors.Is(err, whatsmeow.ErrMediaDownloadFailedWith403)
}

// Disconnect closes the connection (used on SIGTERM).
func (m *Manager) Disconnect() {
	m.current().Disconnect()
	m.cancel()
}

// logErr logs internal failures without message content.
func (m *Manager) logErr(what string, err error) {
	if err != nil {
		m.opts.Log.Error("failed to "+what, "err", Redact(err.Error()))
	}
}
