package store

import (
	"strings"
	"unicode"
)

// Clean removes control characters (except \n and \t) and bidi overrides (U+202A–U+202E, U+2066–U+2069)
// from text leaving the bridge.
func Clean(s string) string {
	return strings.Map(func(r rune) rune {
		if isUnsafeRune(r) {
			return -1
		}
		return r
	}, strings.ToValidUTF8(s, ""))
}

// isUnsafeRune decides whether a character must be removed from the output.
func isUnsafeRune(r rune) bool {
	switch {
	case r == '\n' || r == '\t':
		return false
	case r >= 0x202A && r <= 0x202E, r >= 0x2066 && r <= 0x2069:
		return true
	}
	return unicode.IsControl(r)
}

// foldMap maps common accented letters to their unaccented base.
var foldMap = map[rune]rune{
	'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
	'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i', 'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
	'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u', 'ç': 'c', 'ñ': 'n',
}

// Fold lowercases the text and strips accents, for case- and accent-insensitive searches.
func Fold(s string) string {
	return strings.Map(func(r rune) rune {
		r = unicode.ToLower(r)
		if base, ok := foldMap[r]; ok {
			return base
		}
		return r
	}, s)
}

// likeEscaper escapes the LIKE wildcards (the escape character is the backslash).
var likeEscaper = strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)

// ContainsPattern builds the LIKE pattern "%term%", normalized with Fold and with escaped wildcards.
func ContainsPattern(query string) string {
	return "%" + likeEscaper.Replace(Fold(query)) + "%"
}

// Digits returns only the ASCII digits of s.
func Digits(s string) string {
	var b strings.Builder
	for _, r := range s {
		if r >= '0' && r <= '9' {
			b.WriteRune(r)
		}
	}
	return b.String()
}

// PhoneFromJID returns "+<number>" for phone-based user JIDs and "" for the rest.
func PhoneFromJID(jid string) string {
	user, server, ok := strings.Cut(jid, "@")
	if !ok || server != "s.whatsapp.net" {
		return ""
	}
	user, _, _ = strings.Cut(user, ":")
	if user == "" || Digits(user) != user {
		return ""
	}
	return "+" + user
}

// IsGroupJID reports whether the JID is a group.
func IsGroupJID(jid string) bool { return strings.HasSuffix(jid, "@g.us") }
