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

// State é o retrato do cliente para o /status.
type State struct {
	Connected           bool
	LoggedIn            bool
	NeedsPairing        bool
	OfflineSyncComplete bool
	Account             string
	LastEventAt         time.Time
}

// QRCode é o QR de pareamento atual.
type QRCode struct {
	Code      string
	ExpiresAt time.Time
}

// Sent é o resultado de um envio.
type Sent struct {
	ID        string
	Timestamp time.Time
}

var (
	// ErrAlreadyPaired indica que já existe sessão.
	ErrAlreadyPaired = errors.New("já existe uma sessão do WhatsApp")
	// ErrNoQR indica que o QR ainda não chegou.
	ErrNoQR = errors.New("o QR de pareamento ainda não está disponível")
	// ErrMediaExpired indica que o WhatsApp não tem mais o arquivo.
	ErrMediaExpired = errors.New("a mídia expirou no WhatsApp")
	// ErrNotConnected indica cliente sem login ou sem conexão.
	ErrNotConnected = errors.New("o WhatsApp não está conectado")
)

// Options configura o Manager.
type Options struct {
	SessionDB   *sql.DB
	Store       *store.Store
	HistoryDays int
	Log         *slog.Logger
}

// Manager é dono do *whatsmeow.Client e traduz eventos em gravações no banco.
type Manager struct {
	opts      Options
	container *sqlstore.Container
	bg        context.Context
	cancel    context.CancelFunc
	mu        sync.RWMutex
	connectMu sync.Mutex
	client    *whatsmeow.Client
	qr        QRCode
	dial      func() error // conecta; trocado por no-op nos testes para não usar rede

	connected   atomic.Bool
	offlineSync atomic.Bool
	lastEvent   atomic.Int64
}

// pairDisplayName é o nome do cliente exigido pelo PairPhone ("Navegador (SO)").
const pairDisplayName = "Chrome (Linux)"

// ConfigureDevice ajusta o nome do aparelho vinculado e o limite de dias do histórico pedido ao celular.
func ConfigureDevice(historyDays int) {
	wastore.SetOSInfo("Claude", [3]uint32{1, 0, 0})
	wastore.DeviceProps.RequireFullSync = proto.Bool(false)
	wastore.DeviceProps.HistorySyncConfig.FullSyncDaysLimit = proto.Uint32(uint32(historyDays))
	wastore.DeviceProps.HistorySyncConfig.RecentSyncDaysLimit = proto.Uint32(uint32(historyDays))
}

// New prepara o sqlstore do whatsmeow em session.db e cria o cliente (sem conectar).
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

// Start conecta em segundo plano (com QR se não houver sessão).
func (m *Manager) Start() {
	go m.logConnect()
}

// setClient troca o cliente atual por um novo, ligado ao device dado.
func (m *Manager) setClient(device *wastore.Device) {
	cli := whatsmeow.NewClient(device, NewLogger(m.opts.Log, "client"))
	cli.AddEventHandler(m.handleEvent)
	m.mu.Lock()
	m.client, m.qr = cli, QRCode{}
	m.mu.Unlock()
}

// current devolve o cliente atual.
func (m *Manager) current() *whatsmeow.Client {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.client
}

// logConnect conecta e só registra falhas (uso em goroutine).
func (m *Manager) logConnect() {
	if err := m.dial(); err != nil {
		m.opts.Log.Warn("falha ao conectar ao WhatsApp", "err", Redact(err.Error()))
	}
}

// connect abre o websocket; sem sessão, liga antes o canal de QR.
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

// consumeQR guarda o QR mais recente enquanto o canal durar.
func (m *Manager) consumeQR(cli *whatsmeow.Client, ch <-chan whatsmeow.QRChannelItem) {
	for item := range ch {
		m.mu.Lock()
		if m.client == cli {
			m.qr = qrFromItem(item, time.Now())
		}
		m.mu.Unlock()
		if item.Event != whatsmeow.QRChannelEventCode {
			m.opts.Log.Info("pareamento", "evento", item.Event)
		}
	}
}

// qrFromItem decide o QR guardado a partir de um item do canal (função pura).
func qrFromItem(item whatsmeow.QRChannelItem, now time.Time) QRCode {
	if item.Event != whatsmeow.QRChannelEventCode {
		return QRCode{}
	}
	return QRCode{Code: item.Code, ExpiresAt: now.Add(item.Timeout)}
}

// State devolve o estado atual do cliente.
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

// QR devolve o QR vigente; sem QR válido, reabre a conexão de pareamento e devolve ErrNoQR.
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

// PairCode pede ao WhatsApp um código de pareamento por número de telefone.
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

// waitQR espera o primeiro QR (sinal de websocket pronto para parear).
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

// Logout desloga no servidor (ou só localmente, se offline) e prepara um device novo para parear.
func (m *Manager) Logout(ctx context.Context) error {
	cli := m.current()
	if cli.Store.ID != nil {
		if err := cli.Logout(ctx); err != nil {
			m.opts.Log.Warn("logout remoto falhou; apagando a sessão local", "err", Redact(err.Error()))
			if derr := cli.Store.Delete(ctx); derr != nil {
				return derr
			}
		}
	}
	cli.Disconnect()
	m.resetDevice()
	return nil
}

// resetDevice zera o estado e cria um cliente novo, já esperando pareamento.
func (m *Manager) resetDevice() {
	m.connected.Store(false)
	m.offlineSync.Store(false)
	m.setClient(m.container.NewDevice())
	go m.logConnect()
}

// Outgoing é uma mensagem de texto a enviar: destinatário (JID), texto e, opcionalmente, a mensagem citada.
type Outgoing struct {
	To    string
	Text  string
	Quote *store.Quoted
}

// buildOutgoing monta o protobuf do texto (função pura); com citação, usa ExtendedTextMessage + ContextInfo.
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

// SendText envia texto (opcionalmente citando outra mensagem) e grava a mensagem enviada no banco.
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
	m.logErr("gravar mensagem enviada", saveErr)
	return Sent{ID: resp.ID, Timestamp: resp.Timestamp}, nil
}

// mediaTypes mapeia o tipo guardado para o tipo de chave do whatsmeow.
var mediaTypes = map[string]whatsmeow.MediaType{
	"image": whatsmeow.MediaImage, "sticker": whatsmeow.MediaImage, "video": whatsmeow.MediaVideo,
	"audio": whatsmeow.MediaAudio, "document": whatsmeow.MediaDocument,
}

// Download baixa e decifra uma mídia a partir dos metadados guardados.
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

// isExpired decide se o erro de download significa mídia indisponível no servidor.
func isExpired(err error) bool {
	return errors.Is(err, whatsmeow.ErrMediaDownloadFailedWith404) || errors.Is(err, whatsmeow.ErrMediaDownloadFailedWith410) ||
		errors.Is(err, whatsmeow.ErrMediaDownloadFailedWith403)
}

// Disconnect encerra a conexão (usado no SIGTERM).
func (m *Manager) Disconnect() {
	m.current().Disconnect()
	m.cancel()
}

// logErr registra falhas internas sem conteúdo de mensagem.
func (m *Manager) logErr(what string, err error) {
	if err != nil {
		m.opts.Log.Error("falha ao "+what, "err", Redact(err.Error()))
	}
}
