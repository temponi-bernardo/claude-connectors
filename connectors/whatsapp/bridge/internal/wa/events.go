package wa

import (
	"context"
	"time"

	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// handleEvent receives every whatsmeow event and dispatches it to the right handler.
func (m *Manager) handleEvent(evt any) {
	m.lastEvent.Store(time.Now().Unix())
	switch e := evt.(type) {
	case *events.Message:
		m.applyAction(m.bg, decideMessage(e, m.resolve))
	case *events.HistorySync:
		m.onHistorySync(m.bg, e)
	case *events.PushName:
		m.logErr("store push name", m.opts.Store.UpsertContacts(m.bg, []store.Contact{{JID: m.resolve(e.JID).String(), PushName: e.NewPushName}}))
	case *events.Contact:
		m.onContact(m.bg, e)
	case *events.GroupInfo:
		m.onGroupInfo(m.bg, e)
	default:
		m.handleConnectionEvent(evt)
	}
}

// handleConnectionEvent handles connection, sync and session events.
func (m *Manager) handleConnectionEvent(evt any) {
	switch evt.(type) {
	case *events.Connected:
		m.connected.Store(true)
		go m.syncNames()
		m.sessionChanged()
	case *events.Disconnected, *events.StreamReplaced:
		m.connected.Store(false)
	case *events.OfflineSyncCompleted:
		m.offlineSync.Store(true)
	case *events.AppStateSyncComplete:
		go m.importContacts()
	case *events.PairSuccess:
		m.opts.Log.Info("paired successfully")
		m.sessionChanged()
	case *events.LoggedOut:
		m.opts.Log.Warn("session ended by the phone; pairing again is required")
		go m.onLoggedOut()
	}
}

// onLoggedOut discards the old client (whatsmeow already deleted the session) and prepares a new device.
func (m *Manager) onLoggedOut() {
	m.current().Disconnect()
	m.resetDevice()
	m.sessionChanged()
}

// sessionChanged signals, without blocking, that the session changed (the owner takes a snapshot so it survives restarts).
func (m *Manager) sessionChanged() {
	if m.opts.OnSessionChange != nil {
		go m.opts.OnSessionChange()
	}
}

// resolve replaces a LID with the phone number when the mapping is known; strips the device suffix.
func (m *Manager) resolve(jid types.JID) types.JID {
	if lids := m.current().Store.LIDs; jid.Server == types.HiddenUserServer && lids != nil {
		pn, err := lids.GetPNForLID(m.bg, jid)
		if err == nil && !pn.IsEmpty() {
			return pn.ToNonAD()
		}
	}
	return jid.ToNonAD()
}

// applyAction carries out the decision taken about a message.
func (m *Manager) applyAction(ctx context.Context, a action) {
	st := m.opts.Store
	switch a.kind {
	case actionSave:
		m.logErr("store message", st.SaveMessage(ctx, a.msg))
	case actionEdit:
		m.logErr("edit message", st.EditMessage(ctx, a.msg.ChatJID, a.targetID, a.text))
	case actionRevoke:
		m.logErr("delete message", st.DeleteMessage(ctx, a.msg.ChatJID, a.targetID))
	}
}

// onHistorySync stores chats, recent messages and push names from a history chunk.
func (m *Manager) onHistorySync(ctx context.Context, e *events.HistorySync) {
	cutoff := time.Now().Add(-time.Duration(m.opts.HistoryDays) * 24 * time.Hour).Unix()
	b := buildHistoryBatch(e.Data, historyInput{parse: m.current().ParseWebMessage, resolve: m.resolve, cutoff: cutoff})
	m.logErr("store history", m.opts.Store.SaveHistory(ctx, b))
	m.opts.Log.Info("history received", "chats", len(b.Chats), "messages", len(b.Messages), "contacts", len(b.Contacts))
}

// onContact stores the address book name (app state sync).
func (m *Manager) onContact(ctx context.Context, e *events.Contact) {
	if e.Action == nil {
		return
	}
	c := store.Contact{JID: m.resolve(e.JID).String(), FullName: firstNonEmpty(e.Action.GetFullName(), e.Action.GetFirstName())}
	m.logErr("store contact", m.opts.Store.UpsertContacts(ctx, []store.Contact{c}))
}

// onGroupInfo updates a group's name when it changes.
func (m *Manager) onGroupInfo(ctx context.Context, e *events.GroupInfo) {
	if e.Name != nil && e.Name.Name != "" {
		m.logErr("store group name", m.opts.Store.SetChatName(ctx, e.JID.String(), e.Name.Name))
	}
}

// syncNames fetches the names of the groups the account belongs to.
func (m *Manager) syncNames() {
	groups, err := m.current().GetJoinedGroups(m.bg)
	if err != nil {
		m.logErr("list groups", err)
		return
	}
	m.logErr("store groups", m.opts.Store.SaveHistory(m.bg, store.HistoryBatch{Chats: groupChats(groups)}))
}

// groupChats converts whatsmeow groups into named chats (pure).
func groupChats(groups []*types.GroupInfo) []store.Chat {
	out := make([]store.Chat, 0, len(groups))
	for _, g := range groups {
		out = append(out, store.Chat{JID: g.JID.String(), Name: g.Name})
	}
	return out
}

// importContacts copies into messages.db the address book names whatsmeow stored.
func (m *Manager) importContacts() {
	dev := m.current().Store
	if dev.ID == nil || dev.Contacts == nil {
		return
	}
	all, err := dev.Contacts.GetAllContacts(m.bg)
	if err != nil {
		m.logErr("read contacts", err)
		return
	}
	m.logErr("store contacts", m.opts.Store.UpsertContacts(m.bg, contactsFromInfo(all, m.resolve)))
}

// contactsFromInfo converts the whatsmeow contact map (pure, except for the resolver).
func contactsFromInfo(all map[types.JID]types.ContactInfo, resolve Resolver) []store.Contact {
	out := make([]store.Contact, 0, len(all))
	for jid, info := range all {
		out = append(out, store.Contact{JID: resolve(jid).String(),
			FullName: firstNonEmpty(info.FullName, info.FirstName, info.BusinessName), PushName: info.PushName})
	}
	return out
}
