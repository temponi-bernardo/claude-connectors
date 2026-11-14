package wa

import (
	"go.mau.fi/whatsmeow/proto/waHistorySync"
	"go.mau.fi/whatsmeow/proto/waWeb"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// WebParser é a assinatura de Client.ParseWebMessage, injetável em testes.
type WebParser func(chat types.JID, msg *waWeb.WebMessageInfo) (*events.Message, error)

// historyInput agrupa o que buildHistoryBatch precisa além dos dados.
type historyInput struct {
	parse   WebParser
	resolve Resolver
	cutoff  int64 // mensagens com ts menor são descartadas (HISTORY_DAYS)
}

// buildHistoryBatch converte um history sync em lote para o banco, respeitando o corte de dias.
func buildHistoryBatch(data *waHistorySync.HistorySync, in historyInput) store.HistoryBatch {
	var b store.HistoryBatch
	for _, conv := range data.GetConversations() {
		chat, err := types.ParseJID(conv.GetID())
		if err != nil || !keepChat(in.resolve(chat)) {
			continue
		}
		chat = in.resolve(chat)
		b.Chats = append(b.Chats, store.Chat{JID: chat.String(), Name: firstNonEmpty(conv.GetName(), conv.GetDisplayName()),
			LastTS: int64(conv.GetConversationTimestamp())})
		b.Messages = append(b.Messages, historyMessages(chat, conv.GetMessages(), in)...)
	}
	b.Contacts = historyPushNames(data.GetPushnames(), in.resolve)
	return b
}

// historyMessages converte as mensagens de uma conversa, ignorando as antigas e as sem conteúdo.
func historyMessages(chat types.JID, msgs []*waHistorySync.HistorySyncMsg, in historyInput) []store.Message {
	var out []store.Message
	for _, hm := range msgs {
		web := hm.GetMessage()
		if web == nil || int64(web.GetMessageTimestamp()) < in.cutoff {
			continue
		}
		evt, err := in.parse(chat, web)
		if err != nil {
			continue
		}
		if a := decideMessage(evt, in.resolve); a.kind == actionSave {
			out = append(out, a.msg)
		}
	}
	return out
}

// historyPushNames converte os push names do history sync em contatos.
func historyPushNames(names []*waHistorySync.Pushname, resolve Resolver) []store.Contact {
	var out []store.Contact
	for _, p := range names {
		jid, err := types.ParseJID(p.GetID())
		if err != nil || p.GetPushname() == "" || p.GetPushname() == "-" {
			continue
		}
		out = append(out, store.Contact{JID: resolve(jid).String(), PushName: p.GetPushname()})
	}
	return out
}
