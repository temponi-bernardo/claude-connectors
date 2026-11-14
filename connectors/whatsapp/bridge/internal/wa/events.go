package wa

import (
	"context"
	"time"

	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// handleEvent recebe todos os eventos do whatsmeow e despacha para o tratamento certo.
func (m *Manager) handleEvent(evt any) {
	m.lastEvent.Store(time.Now().Unix())
	switch e := evt.(type) {
	case *events.Message:
		m.applyAction(m.bg, decideMessage(e, m.resolve))
	case *events.HistorySync:
		m.onHistorySync(m.bg, e)
	case *events.PushName:
		m.logErr("gravar push name", m.opts.Store.UpsertContacts(m.bg, []store.Contact{{JID: m.resolve(e.JID).String(), PushName: e.NewPushName}}))
	case *events.Contact:
		m.onContact(m.bg, e)
	case *events.GroupInfo:
		m.onGroupInfo(m.bg, e)
	default:
		m.handleConnectionEvent(evt)
	}
}

// handleConnectionEvent trata eventos de conexão, sincronização e sessão.
func (m *Manager) handleConnectionEvent(evt any) {
	switch evt.(type) {
	case *events.Connected:
		m.connected.Store(true)
		go m.syncNames()
	case *events.Disconnected, *events.StreamReplaced:
		m.connected.Store(false)
	case *events.OfflineSyncCompleted:
		m.offlineSync.Store(true)
	case *events.AppStateSyncComplete:
		go m.importContacts()
	case *events.PairSuccess:
		m.opts.Log.Info("pareado com sucesso")
	case *events.LoggedOut:
		m.opts.Log.Warn("sessão encerrada pelo celular; é preciso parear de novo")
		go m.onLoggedOut()
	}
}

// onLoggedOut descarta o cliente antigo (o whatsmeow já apagou a sessão) e prepara um device novo.
func (m *Manager) onLoggedOut() {
	m.current().Disconnect()
	m.resetDevice()
}

// resolve troca LID pelo número de telefone quando o mapeamento é conhecido; tira o sufixo de aparelho.
func (m *Manager) resolve(jid types.JID) types.JID {
	if lids := m.current().Store.LIDs; jid.Server == types.HiddenUserServer && lids != nil {
		pn, err := lids.GetPNForLID(m.bg, jid)
		if err == nil && !pn.IsEmpty() {
			return pn.ToNonAD()
		}
	}
	return jid.ToNonAD()
}

// applyAction executa a decisão tomada sobre uma mensagem.
func (m *Manager) applyAction(ctx context.Context, a action) {
	st := m.opts.Store
	switch a.kind {
	case actionSave:
		m.logErr("gravar mensagem", st.SaveMessage(ctx, a.msg))
	case actionEdit:
		m.logErr("editar mensagem", st.EditMessage(ctx, a.msg.ChatJID, a.targetID, a.text))
	case actionRevoke:
		m.logErr("apagar mensagem", st.DeleteMessage(ctx, a.msg.ChatJID, a.targetID))
	}
}

// onHistorySync grava conversas, mensagens recentes e push names de um bloco de histórico.
func (m *Manager) onHistorySync(ctx context.Context, e *events.HistorySync) {
	cutoff := time.Now().Add(-time.Duration(m.opts.HistoryDays) * 24 * time.Hour).Unix()
	b := buildHistoryBatch(e.Data, historyInput{parse: m.current().ParseWebMessage, resolve: m.resolve, cutoff: cutoff})
	m.logErr("gravar histórico", m.opts.Store.SaveHistory(ctx, b))
	m.opts.Log.Info("histórico recebido", "conversas", len(b.Chats), "mensagens", len(b.Messages), "contatos", len(b.Contacts))
}

// onContact grava o nome salvo na agenda (sincronização de app state).
func (m *Manager) onContact(ctx context.Context, e *events.Contact) {
	if e.Action == nil {
		return
	}
	c := store.Contact{JID: m.resolve(e.JID).String(), FullName: firstNonEmpty(e.Action.GetFullName(), e.Action.GetFirstName())}
	m.logErr("gravar contato", m.opts.Store.UpsertContacts(ctx, []store.Contact{c}))
}

// onGroupInfo atualiza o nome de um grupo quando ele muda.
func (m *Manager) onGroupInfo(ctx context.Context, e *events.GroupInfo) {
	if e.Name != nil && e.Name.Name != "" {
		m.logErr("gravar nome de grupo", m.opts.Store.SetChatName(ctx, e.JID.String(), e.Name.Name))
	}
}

// syncNames busca os nomes dos grupos dos quais a conta participa.
func (m *Manager) syncNames() {
	groups, err := m.current().GetJoinedGroups(m.bg)
	if err != nil {
		m.logErr("listar grupos", err)
		return
	}
	m.logErr("gravar grupos", m.opts.Store.SaveHistory(m.bg, store.HistoryBatch{Chats: groupChats(groups)}))
}

// groupChats converte grupos do whatsmeow em conversas com nome (função pura).
func groupChats(groups []*types.GroupInfo) []store.Chat {
	out := make([]store.Chat, 0, len(groups))
	for _, g := range groups {
		out = append(out, store.Chat{JID: g.JID.String(), Name: g.Name})
	}
	return out
}

// importContacts copia para messages.db os nomes que o whatsmeow guardou da agenda.
func (m *Manager) importContacts() {
	dev := m.current().Store
	if dev.ID == nil || dev.Contacts == nil {
		return
	}
	all, err := dev.Contacts.GetAllContacts(m.bg)
	if err != nil {
		m.logErr("ler contatos", err)
		return
	}
	m.logErr("gravar contatos", m.opts.Store.UpsertContacts(m.bg, contactsFromInfo(all, m.resolve)))
}

// contactsFromInfo converte o mapa de contatos do whatsmeow (função pura, exceto pelo resolver).
func contactsFromInfo(all map[types.JID]types.ContactInfo, resolve Resolver) []store.Contact {
	out := make([]store.Contact, 0, len(all))
	for jid, info := range all {
		out = append(out, store.Contact{JID: resolve(jid).String(),
			FullName: firstNonEmpty(info.FullName, info.FirstName, info.BusinessName), PushName: info.PushName})
	}
	return out
}
