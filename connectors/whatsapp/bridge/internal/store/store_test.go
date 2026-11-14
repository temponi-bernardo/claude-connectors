package store

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func openTest(t *testing.T) *Store {
	t.Helper()
	s, err := Open(context.Background(), filepath.Join(t.TempDir(), "messages.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { s.Close() })
	return s
}

const (
	maria = "5531999990001@s.whatsapp.net"
	joao  = "5531999990002@s.whatsapp.net"
	group = "120363000000000001@g.us"
)

func seed(t *testing.T, s *Store) {
	t.Helper()
	ctx := context.Background()
	err := s.SaveHistory(ctx, HistoryBatch{
		Chats:    []Chat{{JID: group, Name: "Família‮", LastTS: 50}, {JID: "5531999990009@s.whatsapp.net", LastTS: 5}},
		Contacts: []Contact{{JID: maria, FullName: "Maria Agenda"}, {JID: joao, PushName: "João"}},
		Messages: []Message{
			{ChatJID: maria, ID: "A1", SenderJID: maria, SenderPush: "Mari", Timestamp: 100, Type: "text", Text: "Olá\x07 ação 100%"},
			{ChatJID: maria, ID: "A2", FromMe: true, Timestamp: 200, Type: "text", Text: "oi"},
			{ChatJID: maria, ID: "A3", SenderJID: maria, Timestamp: 200, Type: "image", Text: "foto",
				Media: &Media{Kind: "image", Mime: "image/jpeg", Size: 10, DirectPath: "/x", MediaKey: []byte{1}}},
			{ChatJID: group, ID: "G1", SenderJID: joao, Timestamp: 150, Type: "text", Text: "no grupo_1"},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestListChatsOrderNamesAndLast(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	chats, next, err := s.ListChats(context.Background(), "", 10, nil)
	if err != nil || next != nil || len(chats) != 3 {
		t.Fatalf("chats=%v next=%v err=%v", len(chats), next, err)
	}
	if chats[0].JID != maria || chats[0].Name != "Maria Agenda" || chats[0].Last.ID != "A3" || chats[0].Last.SenderName != "Maria Agenda" {
		t.Fatalf("primeira conversa: %+v %+v", chats[0], chats[0].Last)
	}
	if chats[1].Name != "Família" || !chats[1].IsGroup || chats[1].Last.SenderName != "João" {
		t.Fatalf("grupo: %+v %+v", chats[1], chats[1].Last)
	}
	if chats[2].Name != "+5531999990009" || chats[2].Last != nil {
		t.Fatalf("sem nome: %+v", chats[2])
	}
}

func TestListChatsPaginationAndQuery(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	ctx := context.Background()
	p1, next, _ := s.ListChats(ctx, "", 2, nil)
	p2, end, _ := s.ListChats(ctx, "", 2, next)
	if len(p1) != 2 || next == nil || len(p2) != 1 || end != nil || p2[0].JID == p1[1].JID {
		t.Fatalf("paginação: %d %v %d %v", len(p1), next, len(p2), end)
	}
	for q, want := range map[string]string{"familia": group, "MARIA": maria, "99990009": "5531999990009@s.whatsapp.net"} {
		got, _, err := s.ListChats(ctx, q, 10, nil)
		if err != nil || len(got) != 1 || got[0].JID != want {
			t.Fatalf("query %q: %+v %v", q, got, err)
		}
	}
	if got, _, _ := s.ListChats(ctx, "%", 10, nil); len(got) != 0 {
		t.Fatal("curinga % não foi escapado")
	}
}

func TestListMessagesPagination(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	ctx := context.Background()
	p1, next, err := s.ListMessages(ctx, maria, 2, nil)
	if err != nil || len(p1) != 2 || p1[0].ID != "A3" || p1[1].ID != "A2" || next == nil {
		t.Fatalf("p1: %+v %v %v", p1, next, err)
	}
	if p1[1].SenderName != SelfName || p1[0].Media == nil || p1[0].Media.Mime != "image/jpeg" || p1[0].ChatName != "Maria Agenda" {
		t.Fatalf("campos: %+v", p1)
	}
	p2, end, _ := s.ListMessages(ctx, maria, 2, next)
	if len(p2) != 1 || p2[0].ID != "A1" || end != nil || p2[0].Text != "Olá ação 100%" {
		t.Fatalf("p2: %+v %v", p2, end)
	}
}

func TestSearchMessages(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	ctx := context.Background()
	cases := []struct {
		q, chat string
		n       int
	}{{"ACAO", "", 1}, {"100%", "", 1}, {"0%", "", 1}, {"_", "", 1}, {"o", maria, 3}, {"o", group, 1}, {"zzz", "", 0}}
	for _, c := range cases {
		got, err := s.SearchMessages(ctx, c.q, c.chat, 10)
		if err != nil || len(got) != c.n {
			t.Fatalf("%q/%q: %d %v", c.q, c.chat, len(got), err)
		}
	}
	got, _ := s.SearchMessages(ctx, "grupo", "", 10)
	if got[0].ChatName != "Família" {
		t.Fatalf("chat_name: %q", got[0].ChatName)
	}
}

func TestGetChatAndMedia(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	ctx := context.Background()
	if _, err := s.GetChat(ctx, "x@s.whatsapp.net"); !errors.Is(err, ErrNotFound) {
		t.Fatal(err)
	}
	if c, err := s.GetChat(ctx, group); err != nil || c.Name != "Família" {
		t.Fatal(c, err)
	}
	m, err := s.GetMedia(ctx, maria, "A3")
	if err != nil || m.DirectPath != "/x" || m.Kind != "image" || m.Size != 10 || len(m.MediaKey) != 1 {
		t.Fatal(m, err)
	}
	if _, err := s.GetMedia(ctx, maria, "A1"); !errors.Is(err, ErrNotFound) {
		t.Fatal("texto sem mídia deveria ser ErrNotFound")
	}
	if _, err := s.GetMedia(ctx, maria, "nada"); !errors.Is(err, ErrNotFound) {
		t.Fatal("mensagem inexistente deveria ser ErrNotFound")
	}
}

func TestContactsAndUpserts(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	ctx := context.Background()
	if err := s.UpsertContacts(ctx, []Contact{{JID: maria, PushName: "Mari P"}, {JID: "x@s.whatsapp.net"}}); err != nil {
		t.Fatal(err)
	}
	got, err := s.SearchContacts(ctx, "mari", 10)
	if err != nil || len(got) != 1 || got[0].Name != "Maria Agenda" || got[0].PushName != "Mari P" || got[0].Phone != "+5531999990001" {
		t.Fatalf("%+v %v", got, err)
	}
	if got, _ := s.SearchContacts(ctx, "990002", 10); len(got) != 1 || got[0].JID != joao {
		t.Fatalf("por número: %+v", got)
	}
	if err := s.SetChatName(ctx, group, "Novo"); err != nil {
		t.Fatal(err)
	}
	if c, _ := s.GetChat(ctx, group); c.Name != "Novo" || c.LastTS != 150 {
		t.Fatalf("SetChatName: %+v", c)
	}
}

func TestEditDeleteAndCounts(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	ctx := context.Background()
	_ = s.EditMessage(ctx, maria, "A1", "editado")
	_ = s.DeleteMessage(ctx, maria, "A2")
	msgs, _, _ := s.ListMessages(ctx, maria, 10, nil)
	if len(msgs) != 2 || msgs[1].Text != "editado" {
		t.Fatalf("%+v", msgs)
	}
	chats, n, err := s.Counts(ctx)
	if err != nil || chats != 3 || n != 3 {
		t.Fatal(chats, n, err)
	}
	if err := s.SaveMessage(ctx, Message{ChatJID: maria, ID: "A1", Timestamp: 100, Type: "text", Text: "de novo"}); err != nil {
		t.Fatal(err)
	}
	if _, n, _ := s.Counts(ctx); n != 3 {
		t.Fatal("mensagem repetida duplicou")
	}
}

func TestReserveSend(t *testing.T) {
	s := openTest(t)
	ctx := context.Background()
	now := time.Unix(10_000, 0)
	for i := 0; i < 2; i++ {
		if ok, _, err := s.ReserveSend(ctx, now.Add(time.Duration(i)*time.Minute), 2); !ok || err != nil {
			t.Fatal("deveria permitir", i, err)
		}
	}
	ok, wait, _ := s.ReserveSend(ctx, now.Add(10*time.Minute), 2)
	if ok || wait != 3000 {
		t.Fatalf("esperava bloqueio com 3000 s, veio %v %d", ok, wait)
	}
	if ok, _, _ := s.ReserveSend(ctx, now.Add(61*time.Minute), 2); !ok {
		t.Fatal("deveria liberar depois de 1 h")
	}
	if ok, wait, _ := s.ReserveSend(ctx, now.Add(300*time.Minute), 0); ok || wait != 3600 {
		t.Fatalf("limite zero: %v %d", ok, wait)
	}
}

func TestVacuumIntoAndOpenErrors(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	dst := filepath.Join(t.TempDir(), "copy.db")
	if err := VacuumInto(context.Background(), s.DB(), dst); err != nil {
		t.Fatal(err)
	}
	if info, err := os.Stat(dst); err != nil || info.Size() == 0 {
		t.Fatal(err)
	}
	if err := VacuumInto(context.Background(), s.DB(), dst); err == nil {
		t.Fatal("VACUUM INTO em arquivo existente deveria falhar")
	}
	if _, err := Open(context.Background(), filepath.Join(t.TempDir(), "nao", "existe", "m.db")); err == nil {
		t.Fatal("abrir em diretório inexistente deveria falhar")
	}
}

func TestVacuumIsDeterministic(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	dir := t.TempDir()
	a, b := filepath.Join(dir, "a.db"), filepath.Join(dir, "b.db")
	_ = VacuumInto(context.Background(), s.DB(), a)
	_ = VacuumInto(context.Background(), s.DB(), b)
	ba, _ := os.ReadFile(a)
	bb, _ := os.ReadFile(b)
	if string(ba) != string(bb) {
		t.Fatal("VACUUM INTO não é determinístico; o 204 do /snapshot nunca aconteceria")
	}
}

func TestVacuumStableAcrossReopen(t *testing.T) {
	s := openTest(t)
	seed(t, s)
	dir := t.TempDir()
	a, b := filepath.Join(dir, "a.db"), filepath.Join(dir, "b.db")
	if err := VacuumInto(context.Background(), s.DB(), a); err != nil {
		t.Fatal(err)
	}
	ba, _ := os.ReadFile(a)
	s2, err := Open(context.Background(), a)
	if err != nil {
		t.Fatal(err)
	}
	defer s2.Close()
	if n, _, _ := s2.Counts(context.Background()); n != 3 {
		t.Fatal("cópia normalizada ilegível")
	}
	if err := VacuumInto(context.Background(), s2.DB(), b); err != nil {
		t.Fatal(err)
	}
	bb, _ := os.ReadFile(b)
	if string(ba) != string(bb) {
		t.Fatal("VACUUM INTO depois de reabrir mudou os bytes")
	}
}

func TestNormalizeHeaderRejectsGarbage(t *testing.T) {
	if normalizeHeader(make([]byte, 100)) == nil || normalizeHeader([]byte("curto")) == nil {
		t.Fatal("deveria rejeitar")
	}
	p := filepath.Join(t.TempDir(), "x")
	_ = os.WriteFile(p, []byte("pequeno"), 0o600)
	if normalizeHeaderFile(p) == nil || normalizeHeaderFile(p+"nao") == nil {
		t.Fatal("deveria falhar")
	}
}
