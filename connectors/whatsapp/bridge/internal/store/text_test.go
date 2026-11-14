package store

import "testing"

func TestClean(t *testing.T) {
	in := "a\x00b\x1bc‮d⁦e⁩f\x7fg\u0085h\nok\ttab\xff"
	if got := Clean(in); got != "abcdefgh\nok\ttab" {
		t.Fatalf("Clean: %q", got)
	}
}

func TestFoldAndPattern(t *testing.T) {
	if Fold("ÁÉÍÓÚ Ção Ñ") != "aeiou cao n" {
		t.Fatal(Fold("ÁÉÍÓÚ Ção Ñ"))
	}
	if got := ContainsPattern(`10%_a\b`); got != `%10\%\_a\\b%` {
		t.Fatalf("ContainsPattern: %q", got)
	}
}

func TestPhoneFromJID(t *testing.T) {
	cases := map[string]string{
		"5531999999999@s.whatsapp.net":    "+5531999999999",
		"5531999999999:12@s.whatsapp.net": "+5531999999999",
		"123@g.us":                        "",
		"123@lid":                         "",
		"abc@s.whatsapp.net":              "",
		"semarroba":                       "",
	}
	for in, want := range cases {
		if got := PhoneFromJID(in); got != want {
			t.Errorf("%q → %q", in, got)
		}
	}
}

func TestCursorRoundTripAndValidation(t *testing.T) {
	c := Cursor{TS: 123, Key: "abc"}
	got, err := DecodeCursor(EncodeCursor(c))
	if err != nil || *got != c {
		t.Fatal(got, err)
	}
	if got, err := DecodeCursor(""); got != nil || err != nil {
		t.Fatal("vazio deveria ser nil")
	}
	bad := []string{"!!!", "e30", "eyJ0IjotMSwiayI6ImEifQ", "eyJ0IjoxLCJrIjoiYSIsIngiOjF9", "eyJ0IjoxLCJrIjoiIn0",
		string(make([]byte, 600)), "eyJ0IjoxLCJrIjoiYSJ9e30"}
	for _, b := range bad {
		if _, err := DecodeCursor(b); err == nil {
			t.Errorf("cursor %q deveria falhar", b)
		}
	}
}

func TestRetryAfter(t *testing.T) {
	if retryAfter(100, 3700) != 1 || retryAfter(100, 200) != 3500 {
		t.Fatal(retryAfter(100, 3700), retryAfter(100, 200))
	}
}
