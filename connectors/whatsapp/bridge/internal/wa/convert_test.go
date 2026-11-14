package wa

import (
	"bytes"
	"errors"
	"log/slog"
	"strings"
	"testing"
	"time"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waCommon"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/proto/waHistorySync"
	"go.mau.fi/whatsmeow/proto/waWeb"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"
	"google.golang.org/protobuf/proto"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

var (
	alice = types.NewJID("5531999990001", types.DefaultUserServer)
	grp   = types.NewJID("120363000000000001", types.GroupServer)
)

func identity(j types.JID) types.JID { return j.ToNonAD() }

func msgEvent(chat types.JID, id string, m *waE2E.Message) *events.Message {
	return &events.Message{
		Info: types.MessageInfo{MessageSource: types.MessageSource{Chat: chat, Sender: alice}, ID: id,
			PushName: "Alice", Timestamp: time.Unix(1000, 0)},
		Message: m,
	}
}

func TestDecideMessageTypes(t *testing.T) {
	media := func(kind string) (string, *waE2E.Message) {
		base := &waE2E.ImageMessage{Caption: proto.String("leg"), Mimetype: proto.String("image/jpeg"), FileLength: proto.Uint64(9),
			DirectPath: proto.String("/p"), MediaKey: []byte{1}}
		switch kind {
		case "video":
			return "leg", &waE2E.Message{VideoMessage: &waE2E.VideoMessage{Caption: proto.String("leg"), DirectPath: proto.String("/p")}}
		case "audio":
			return "", &waE2E.Message{AudioMessage: &waE2E.AudioMessage{DirectPath: proto.String("/p")}}
		case "document":
			return "leg", &waE2E.Message{DocumentMessage: &waE2E.DocumentMessage{Caption: proto.String("leg"), FileName: proto.String("a.pdf"), DirectPath: proto.String("/p")}}
		case "sticker":
			return "", &waE2E.Message{StickerMessage: &waE2E.StickerMessage{DirectPath: proto.String("/p")}}
		}
		return "leg", &waE2E.Message{ImageMessage: base}
	}
	for _, kind := range []string{"image", "video", "audio", "document", "sticker"} {
		text, m := media(kind)
		a := decideMessage(msgEvent(alice, "M", m), identity)
		if a.kind != actionSave || a.msg.Type != kind || a.msg.Text != text || a.msg.Media == nil || a.msg.Media.DirectPath != "/p" {
			t.Fatalf("%s: %+v", kind, a)
		}
	}
	a := decideMessage(msgEvent(alice, "D", &waE2E.Message{DocumentMessage: &waE2E.DocumentMessage{Title: proto.String("t")}}), identity)
	if a.msg.Media.Filename != "t" {
		t.Fatalf("documento sem nome deveria usar o título: %+v", a.msg.Media)
	}
}

func TestDecideMessageTextAndOthers(t *testing.T) {
	cases := []struct {
		m        *waE2E.Message
		typ, txt string
	}{
		{&waE2E.Message{Conversation: proto.String("oi")}, "text", "oi"},
		{&waE2E.Message{ExtendedTextMessage: &waE2E.ExtendedTextMessage{Text: proto.String("link")}}, "text", "link"},
		{&waE2E.Message{LocationMessage: &waE2E.LocationMessage{Name: proto.String("Casa"), DegreesLatitude: proto.Float64(-19.9), DegreesLongitude: proto.Float64(-43.9)}}, "location", "Casa (-19.900000, -43.900000)"},
		{&waE2E.Message{LiveLocationMessage: &waE2E.LiveLocationMessage{DegreesLatitude: proto.Float64(1)}}, "location", "(1.000000, 0.000000)"},
		{&waE2E.Message{ContactMessage: &waE2E.ContactMessage{DisplayName: proto.String("Bob")}}, "contact", "Bob"},
		{&waE2E.Message{ContactsArrayMessage: &waE2E.ContactsArrayMessage{DisplayName: proto.String("2 contatos")}}, "contact", "2 contatos"},
		{&waE2E.Message{PollCreationMessageV3: &waE2E.PollCreationMessage{Name: proto.String("Pizza?")}}, "other", "Enquete: Pizza?"},
	}
	for _, c := range cases {
		a := decideMessage(msgEvent(grp, "X", c.m), identity)
		if a.kind != actionSave || a.msg.Type != c.typ || a.msg.Text != c.txt || a.msg.ChatJID != grp.String() || a.msg.SenderPush != "Alice" || a.msg.Timestamp != 1000 {
			t.Errorf("%s: %+v", c.typ, a)
		}
	}
}

func TestDecideMessageSkipsAndProtocol(t *testing.T) {
	skips := []*events.Message{
		msgEvent(types.StatusBroadcastJID, "S", &waE2E.Message{Conversation: proto.String("x")}),
		msgEvent(types.NewJID("1", types.NewsletterServer), "N", &waE2E.Message{Conversation: proto.String("x")}),
		msgEvent(alice, "nil", nil),
		msgEvent(alice, "R", &waE2E.Message{ReactionMessage: &waE2E.ReactionMessage{Text: proto.String("👍")}}),
		msgEvent(alice, "P", &waE2E.Message{ProtocolMessage: &waE2E.ProtocolMessage{Type: waE2E.ProtocolMessage_EPHEMERAL_SETTING.Enum(), Key: &waCommon.MessageKey{ID: proto.String("A")}}}),
		msgEvent(alice, "K", &waE2E.Message{ProtocolMessage: &waE2E.ProtocolMessage{Type: waE2E.ProtocolMessage_REVOKE.Enum()}}),
	}
	for _, e := range skips {
		if a := decideMessage(e, identity); a.kind != actionSkip {
			t.Errorf("%s deveria ser ignorada: %+v", e.Info.ID, a)
		}
	}
	rev := decideMessage(msgEvent(alice, "R", &waE2E.Message{ProtocolMessage: &waE2E.ProtocolMessage{Type: waE2E.ProtocolMessage_REVOKE.Enum(), Key: &waCommon.MessageKey{ID: proto.String("OLD")}}}), identity)
	if rev.kind != actionRevoke || rev.targetID != "OLD" || rev.msg.ChatJID != alice.String() {
		t.Fatalf("revoke: %+v", rev)
	}
	edit := decideMessage(msgEvent(alice, "E", &waE2E.Message{ProtocolMessage: &waE2E.ProtocolMessage{Type: waE2E.ProtocolMessage_MESSAGE_EDIT.Enum(),
		Key: &waCommon.MessageKey{ID: proto.String("OLD")}, EditedMessage: &waE2E.Message{Conversation: proto.String("novo")}}}), identity)
	if edit.kind != actionEdit || edit.text != "novo" {
		t.Fatalf("edit: %+v", edit)
	}
}

func webMsg(id string, ts uint64, text string) *waHistorySync.HistorySyncMsg {
	return &waHistorySync.HistorySyncMsg{Message: &waWeb.WebMessageInfo{
		Key:              &waCommon.MessageKey{ID: proto.String(id), RemoteJID: proto.String(alice.String())},
		MessageTimestamp: proto.Uint64(ts), Message: &waE2E.Message{Conversation: proto.String(text)},
	}}
}

func TestBuildHistoryBatch(t *testing.T) {
	data := &waHistorySync.HistorySync{
		Conversations: []*waHistorySync.Conversation{
			{ID: proto.String(alice.String()), DisplayName: proto.String("Alice"), ConversationTimestamp: proto.Uint64(2000),
				Messages: []*waHistorySync.HistorySyncMsg{webMsg("new", 2000, "oi"), webMsg("old", 10, "velha"), webMsg("bad", 2000, "erro"), {}}},
			{ID: proto.String("status@broadcast")},
			{ID: proto.String("inválido@@")},
		},
		Pushnames: []*waHistorySync.Pushname{{ID: proto.String(alice.String()), Pushname: proto.String("Ali")}, {ID: proto.String(alice.String()), Pushname: proto.String("-")}},
	}
	parse := func(chat types.JID, w *waWeb.WebMessageInfo) (*events.Message, error) {
		if w.GetKey().GetID() == "bad" {
			return nil, errors.New("falha")
		}
		e := msgEvent(chat, w.GetKey().GetID(), w.GetMessage())
		e.Info.Timestamp = time.Unix(int64(w.GetMessageTimestamp()), 0)
		return e, nil
	}
	b := buildHistoryBatch(data, historyInput{parse: parse, resolve: identity, cutoff: 1000})
	if len(b.Chats) != 1 || b.Chats[0].Name != "Alice" || b.Chats[0].LastTS != 2000 {
		t.Fatalf("chats: %+v", b.Chats)
	}
	if len(b.Messages) != 1 || b.Messages[0].ID != "new" {
		t.Fatalf("mensagens: %+v", b.Messages)
	}
	if len(b.Contacts) != 1 || b.Contacts[0].PushName != "Ali" {
		t.Fatalf("contatos: %+v", b.Contacts)
	}
}

func TestMaskAndRedact(t *testing.T) {
	cases := map[string]string{"5531912345612": "+55 31 9****-**12", "553132345612": "+55 31 3***-**12", "447911123456": "+44 ********56", "123": "***"}
	for in, want := range cases {
		if got := MaskPhone(in); got != want {
			t.Errorf("MaskPhone(%s) = %s", in, got)
		}
	}
	if got := Redact("jid 5531912345612@s.whatsapp.net id 12345"); got != "jid 55*********12@s.whatsapp.net id 12345" {
		t.Fatalf("Redact: %s", got)
	}
}

func TestLoggerRedactsAndDropsDebug(t *testing.T) {
	var buf bytes.Buffer
	l := NewLogger(slog.New(slog.NewTextHandler(&buf, &slog.HandlerOptions{Level: slog.LevelDebug})), "wa").Sub("sub")
	l.Infof("pareado %s", "5531912345612")
	l.Warnf("aviso")
	l.Errorf("erro %d", 1)
	l.Debugf("conteúdo secreto")
	out := buf.String()
	if strings.Contains(out, "5531912345612") || strings.Contains(out, "secreto") || !strings.Contains(out, "wa/sub") || strings.Count(out, "\n") != 3 {
		t.Fatalf("log: %s", out)
	}
}

func TestQRFromItemAndExpired(t *testing.T) {
	now := time.Unix(100, 0)
	qr := qrFromItem(whatsmeow.QRChannelItem{Event: whatsmeow.QRChannelEventCode, Code: "c", Timeout: time.Minute}, now)
	if qr.Code != "c" || !qr.ExpiresAt.Equal(now.Add(time.Minute)) {
		t.Fatal(qr)
	}
	if qrFromItem(whatsmeow.QRChannelSuccess, now).Code != "" {
		t.Fatal("sucesso deveria limpar o QR")
	}
	if !isExpired(whatsmeow.ErrMediaDownloadFailedWith404) || isExpired(errors.New("x")) || isExpired(nil) {
		t.Fatal("isExpired")
	}
}

func TestPureConverters(t *testing.T) {
	g := groupChats([]*types.GroupInfo{{JID: grp, GroupName: types.GroupName{Name: "G"}}})
	if len(g) != 1 || g[0].Name != "G" {
		t.Fatal(g)
	}
	cs := contactsFromInfo(map[types.JID]types.ContactInfo{alice: {FirstName: "A", PushName: "P"}}, identity)
	if len(cs) != 1 || cs[0].FullName != "A" || cs[0].PushName != "P" {
		t.Fatal(cs)
	}
}

func TestBuildOutgoing(t *testing.T) {
	plain := buildOutgoing("oi", nil, "me@s.whatsapp.net")
	if plain.GetConversation() != "oi" || plain.GetExtendedTextMessage() != nil {
		t.Fatal(plain)
	}
	q := &store.Quoted{ID: "G1", SenderJID: "5531999990002@s.whatsapp.net", Text: "original"}
	ext := buildOutgoing("resposta", q, "me@s.whatsapp.net").GetExtendedTextMessage()
	ci := ext.GetContextInfo()
	if ext.GetText() != "resposta" || ci.GetStanzaID() != "G1" || ci.GetParticipant() != q.SenderJID ||
		ci.GetQuotedMessage().GetConversation() != "original" {
		t.Fatal(ext)
	}
	mine := buildOutgoing("x", &store.Quoted{ID: "A2", FromMe: true}, "me@s.whatsapp.net")
	if mine.GetExtendedTextMessage().GetContextInfo().GetParticipant() != "me@s.whatsapp.net" {
		t.Fatal(mine)
	}
}
