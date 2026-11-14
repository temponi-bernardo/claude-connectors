// Package wa conecta a ponte ao WhatsApp via whatsmeow e grava os eventos em messages.db.
package wa

import (
	"fmt"
	"strings"

	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"

	"github.com/temponi-bernardo/claude-connectors/connectors/whatsapp/bridge/internal/store"
)

// actionKind diz o que fazer com um evento de mensagem.
type actionKind int

const (
	actionSkip actionKind = iota
	actionSave
	actionEdit
	actionRevoke
)

// action é a decisão (pura) tomada sobre uma mensagem recebida.
type action struct {
	kind     actionKind
	msg      store.Message
	targetID string
	text     string
}

// Resolver troca um JID (ex.: LID) pelo JID canônico de telefone, quando conhecido.
type Resolver func(types.JID) types.JID

// keepChat decide se a conversa interessa (ignora status, canais e broadcasts).
func keepChat(jid types.JID) bool {
	switch jid.Server {
	case types.DefaultUserServer, types.HiddenUserServer, types.GroupServer:
		return !jid.IsEmpty()
	}
	return false
}

// decideMessage converte um evento em ação: gravar, editar, apagar ou ignorar.
func decideMessage(evt *events.Message, resolve Resolver) action {
	chat := resolve(evt.Info.Chat)
	if !keepChat(chat) || evt.Message == nil {
		return action{}
	}
	if pm := evt.Message.GetProtocolMessage(); pm != nil {
		a := decideProtocol(pm)
		a.msg.ChatJID = chat.String()
		return a
	}
	typ, text, media := extractContent(evt.Message)
	if typ == "" {
		return action{}
	}
	return action{kind: actionSave, msg: store.Message{
		ChatJID: chat.String(), ID: evt.Info.ID, SenderJID: resolve(evt.Info.Sender).String(),
		SenderPush: evt.Info.PushName, FromMe: evt.Info.IsFromMe, Timestamp: evt.Info.Timestamp.Unix(),
		Type: typ, Text: text, Media: media,
	}}
}

// decideProtocol trata edição e apagamento; outros tipos de protocolo são ignorados.
func decideProtocol(pm *waE2E.ProtocolMessage) action {
	id := pm.GetKey().GetID()
	if id == "" {
		return action{}
	}
	switch pm.GetType() {
	case waE2E.ProtocolMessage_REVOKE:
		return action{kind: actionRevoke, targetID: id}
	case waE2E.ProtocolMessage_MESSAGE_EDIT:
		_, text, _ := extractContent(pm.GetEditedMessage())
		return action{kind: actionEdit, targetID: id, text: text}
	}
	return action{}
}

// extractContent devolve tipo, texto (ou legenda) e mídia; tipo "" quando não há conteúdo útil.
func extractContent(m *waE2E.Message) (string, string, *store.Media) {
	if m == nil {
		return "", "", nil
	}
	if t, ok := extractText(m); ok {
		return "text", t, nil
	}
	if typ, text, media := extractMedia(m); typ != "" {
		return typ, text, media
	}
	return extractOther(m)
}

// extractText lê mensagens de texto simples ou estendido.
func extractText(m *waE2E.Message) (string, bool) {
	if m.Conversation != nil {
		return m.GetConversation(), true
	}
	if m.ExtendedTextMessage != nil {
		return m.GetExtendedTextMessage().GetText(), true
	}
	return "", false
}

// mediaFields é o que as mensagens de mídia do whatsmeow têm em comum.
type mediaFields interface {
	GetDirectPath() string
	GetMediaKey() []byte
	GetFileSHA256() []byte
	GetFileEncSHA256() []byte
	GetMimetype() string
	GetFileLength() uint64
}

// extractMedia lê imagem, vídeo, áudio, documento ou figurinha.
func extractMedia(m *waE2E.Message) (string, string, *store.Media) {
	switch {
	case m.ImageMessage != nil:
		return "image", m.GetImageMessage().GetCaption(), newMedia("image", m.GetImageMessage(), "")
	case m.VideoMessage != nil:
		return "video", m.GetVideoMessage().GetCaption(), newMedia("video", m.GetVideoMessage(), "")
	case m.AudioMessage != nil:
		return "audio", "", newMedia("audio", m.GetAudioMessage(), "")
	case m.DocumentMessage != nil:
		d := m.GetDocumentMessage()
		return "document", d.GetCaption(), newMedia("document", d, firstNonEmpty(d.GetFileName(), d.GetTitle()))
	case m.StickerMessage != nil:
		return "sticker", "", newMedia("sticker", m.GetStickerMessage(), "")
	}
	return "", "", nil
}

// newMedia copia os metadados de download de uma mídia.
func newMedia(kind string, f mediaFields, filename string) *store.Media {
	return &store.Media{Kind: kind, Mime: f.GetMimetype(), Size: int64(f.GetFileLength()), Filename: filename,
		DirectPath: f.GetDirectPath(), MediaKey: f.GetMediaKey(), FileSHA256: f.GetFileSHA256(), FileEncSHA256: f.GetFileEncSHA256()}
}

// extractOther lê localização, contato e enquete como texto descritivo.
func extractOther(m *waE2E.Message) (string, string, *store.Media) {
	switch {
	case m.LocationMessage != nil:
		l := m.GetLocationMessage()
		return "location", describeLocation(l.GetName(), l.GetAddress(), l.GetDegreesLatitude(), l.GetDegreesLongitude()), nil
	case m.LiveLocationMessage != nil:
		l := m.GetLiveLocationMessage()
		return "location", describeLocation(l.GetCaption(), "", l.GetDegreesLatitude(), l.GetDegreesLongitude()), nil
	case m.ContactMessage != nil:
		return "contact", m.GetContactMessage().GetDisplayName(), nil
	case m.ContactsArrayMessage != nil:
		return "contact", m.GetContactsArrayMessage().GetDisplayName(), nil
	}
	if p := firstPoll(m); p != nil {
		return "other", "Enquete: " + p.GetName(), nil
	}
	return "", "", nil
}

// firstPoll devolve a enquete em qualquer das versões conhecidas.
func firstPoll(m *waE2E.Message) *waE2E.PollCreationMessage {
	for _, p := range []*waE2E.PollCreationMessage{m.GetPollCreationMessage(), m.GetPollCreationMessageV2(), m.GetPollCreationMessageV3()} {
		if p != nil {
			return p
		}
	}
	return nil
}

// describeLocation monta "nome, endereço (lat, long)".
func describeLocation(name, address string, lat, lng float64) string {
	parts := []string{}
	for _, p := range []string{name, address} {
		if strings.TrimSpace(p) != "" {
			parts = append(parts, p)
		}
	}
	coords := fmt.Sprintf("(%.6f, %.6f)", lat, lng)
	if len(parts) == 0 {
		return coords
	}
	return strings.Join(parts, ", ") + " " + coords
}

// firstNonEmpty devolve o primeiro texto não vazio.
func firstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if v != "" {
			return v
		}
	}
	return ""
}
