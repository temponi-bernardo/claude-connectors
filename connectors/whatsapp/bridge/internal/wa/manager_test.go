package wa

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"path/filepath"
	"testing"
	"time"

	"go.mau.fi/whatsmeow/proto/waCommon"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/proto/waHistorySync"
	"go.mau.fi/whatsmeow/proto/waSyncAction"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"
	"google.golang.org/protobuf/proto"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// newOfflineManager cria um Manager real (sqlstore em modernc) sem nunca abrir conexão de rede.
func newOfflineManager(t *testing.T) (*Manager, *store.Store) {
	t.Helper()
	dir := t.TempDir()
	st, err := store.Open(context.Background(), filepath.Join(dir, "messages.db"))
	if err != nil {
		t.Fatal(err)
	}
	sess, err := store.OpenDB(filepath.Join(dir, "session.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { st.Close(); sess.Close() })
	m, err := New(context.Background(), Options{SessionDB: sess, Store: st, HistoryDays: 30, Log: slog.New(slog.NewTextHandler(io.Discard, nil))})
	if err != nil {
		t.Fatal(err)
	}
	m.dial = func() error { return nil }
	t.Cleanup(m.Disconnect)
	return m, st
}

func TestNewManagerNeedsPairing(t *testing.T) {
	m, _ := newOfflineManager(t)
	m.Start()
	st := m.State()
	if !st.NeedsPairing || st.LoggedIn || st.Connected || st.Account != "" {
		t.Fatalf("estado inicial: %+v", st)
	}
	if _, err := m.QR(); !errors.Is(err, ErrNoQR) {
		t.Fatalf("QR: %v", err)
	}
	m.mu.Lock()
	m.qr = QRCode{Code: "2@abc", ExpiresAt: time.Now().Add(time.Minute)}
	m.mu.Unlock()
	if qr, err := m.QR(); err != nil || qr.Code != "2@abc" {
		t.Fatalf("QR guardado: %v %v", qr, err)
	}
}

func TestOperationsRequireLogin(t *testing.T) {
	m, _ := newOfflineManager(t)
	ctx := context.Background()
	if _, err := m.SendText(ctx, Outgoing{To: alice.String(), Text: "oi"}); !errors.Is(err, ErrNotConnected) {
		t.Fatal(err)
	}
	if _, err := m.Download(ctx, store.Media{Kind: "image", DirectPath: "/x"}); !errors.Is(err, ErrNotConnected) {
		t.Fatal(err)
	}
	cctx, cancel := context.WithCancel(ctx)
	cancel()
	if _, err := m.PairCode(cctx, "5531999999999"); err == nil {
		t.Fatal("PairCode sem QR deveria falhar")
	}
	if err := m.waitQR(ctx, 10*time.Millisecond); !errors.Is(err, ErrNotConnected) {
		t.Fatal(err)
	}
	if err := m.Logout(ctx); err != nil || !m.State().NeedsPairing {
		t.Fatal("Logout sem sessão deveria só recriar o device", err)
	}
}

func TestHandleEventsWriteToStore(t *testing.T) {
	m, st := newOfflineManager(t)
	ctx := context.Background()
	m.handleEvent(msgEvent(alice, "M1", &waE2E.Message{Conversation: proto.String("olá")}))
	m.handleEvent(&events.PushName{JID: alice, NewPushName: "Alice P"})
	m.handleEvent(&events.Contact{JID: alice, Action: &waSyncAction.ContactAction{FullName: proto.String("Alice Agenda")}})
	m.handleEvent(&events.Contact{JID: alice})
	m.handleEvent(&events.GroupInfo{JID: grp, Name: &types.GroupName{Name: "Grupo"}})
	m.handleEvent(&events.HistorySync{Data: &waHistorySync.HistorySync{Pushnames: []*waHistorySync.Pushname{{ID: proto.String(alice.String()), Pushname: proto.String("Ali")}}}})
	msgs, _, err := st.ListMessages(ctx, alice.String(), 10, nil)
	if err != nil || len(msgs) != 1 || msgs[0].Text != "olá" || msgs[0].SenderName != "Alice Agenda" {
		t.Fatalf("%+v %v", msgs, err)
	}
	if c, err := st.GetChat(ctx, grp.String()); err != nil || c.Name != "Grupo" {
		t.Fatalf("grupo: %+v %v", c, err)
	}
	m.handleEvent(msgEvent(alice, "E", &waE2E.Message{ProtocolMessage: &waE2E.ProtocolMessage{Type: waE2E.ProtocolMessage_MESSAGE_EDIT.Enum(),
		Key: &waCommonKey, EditedMessage: &waE2E.Message{Conversation: proto.String("editada")}}}))
	if msgs, _, _ := st.ListMessages(ctx, alice.String(), 10, nil); msgs[0].Text != "editada" {
		t.Fatal("edição não aplicada")
	}
	m.handleEvent(msgEvent(alice, "R", &waE2E.Message{ProtocolMessage: &waE2E.ProtocolMessage{Type: waE2E.ProtocolMessage_REVOKE.Enum(), Key: &waCommonKey}}))
	if msgs, _, _ := st.ListMessages(ctx, alice.String(), 10, nil); len(msgs) != 0 {
		t.Fatal("apagamento não aplicado")
	}
	if m.State().LastEventAt.IsZero() {
		t.Fatal("last_event_at não atualizado")
	}
}

func TestConnectionEvents(t *testing.T) {
	m, _ := newOfflineManager(t)
	m.handleEvent(&events.Connected{})
	m.handleEvent(&events.OfflineSyncCompleted{})
	if !m.connected.Load() || !m.State().OfflineSyncComplete {
		t.Fatal("Connected/OfflineSyncCompleted")
	}
	m.handleEvent(&events.Disconnected{})
	m.handleEvent(&events.AppStateSyncComplete{})
	m.handleEvent(&events.PairSuccess{})
	if m.connected.Load() {
		t.Fatal("Disconnected")
	}
	old := m.current()
	m.handleEvent(&events.LoggedOut{})
	deadline := time.Now().Add(2 * time.Second)
	for m.current() == old && time.Now().Before(deadline) {
		time.Sleep(10 * time.Millisecond)
	}
	if m.current() == old || m.State().OfflineSyncComplete {
		t.Fatal("LoggedOut deveria trocar o cliente e zerar o estado")
	}
}

func TestResolveKeepsNonLID(t *testing.T) {
	m, _ := newOfflineManager(t)
	withDevice := types.JID{User: "5531999990001", Server: types.DefaultUserServer, Device: 3}
	if got := m.resolve(withDevice); got != alice {
		t.Fatal(got)
	}
	lid := types.NewJID("123456", types.HiddenUserServer)
	if got := m.resolve(lid); got != lid {
		t.Fatal(got)
	}
}

var waCommonKey = waCommon.MessageKey{ID: proto.String("M1")}

func TestSessionEventsNotifySnapshot(t *testing.T) {
	m, _ := newOfflineManager(t)
	calls := make(chan struct{}, 8)
	m.opts.OnSessionChange = func() { calls <- struct{}{} }
	m.handleEvent(&events.PairSuccess{})
	m.handleEvent(&events.Connected{})
	m.handleEvent(&events.LoggedOut{})
	for i := 0; i < 3; i++ {
		select {
		case <-calls:
		case <-time.After(2 * time.Second):
			t.Fatalf("esperava 3 avisos de sessão alterada, chegaram %d", i)
		}
	}
	m.handleEvent(&events.Disconnected{})
	select {
	case <-calls:
		t.Fatal("Disconnected não muda a sessão")
	case <-time.After(50 * time.Millisecond):
	}
}

func TestSessionChangedWithoutCallback(t *testing.T) {
	m, _ := newOfflineManager(t)
	m.sessionChanged() // sem callback: não faz nada nem entra em pânico
}
