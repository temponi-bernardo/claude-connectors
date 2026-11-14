package snapshot

import (
	"archive/tar"
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func writeFiles(t *testing.T, dir string, files map[string]string) {
	t.Helper()
	for name, content := range files {
		if err := os.WriteFile(filepath.Join(dir, name), []byte(content), 0o600); err != nil {
			t.Fatal(err)
		}
	}
}

func rawTar(t *testing.T, entries []tar.Header, content string) []byte {
	t.Helper()
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	for _, h := range entries {
		h.Size = int64(len(content))
		if h.Typeflag == 0 {
			h.Typeflag = tar.TypeReg
		}
		if h.Typeflag != tar.TypeReg {
			h.Size = 0
		}
		if err := tw.WriteHeader(&h); err != nil {
			t.Fatal(err)
		}
		if h.Size > 0 {
			_, _ = tw.Write([]byte(content))
		}
	}
	_ = tw.Close()
	return buf.Bytes()
}

func TestPackUnpackRoundTrip(t *testing.T) {
	src, dst := t.TempDir(), t.TempDir()
	writeFiles(t, src, map[string]string{SessionFile: "sessão", MessagesFile: "mensagens"})
	var a, b bytes.Buffer
	if err := Pack(&a, src); err != nil {
		t.Fatal(err)
	}
	_ = Pack(&b, src)
	if !bytes.Equal(a.Bytes(), b.Bytes()) {
		t.Fatal("tar não é determinístico")
	}
	if err := Unpack(&a, dst, 1<<20); err != nil {
		t.Fatal(err)
	}
	got, _ := os.ReadFile(filepath.Join(dst, MessagesFile))
	if string(got) != "mensagens" {
		t.Fatalf("conteúdo extraído: %q", got)
	}
}

func TestPackMissingFile(t *testing.T) {
	if err := Pack(&bytes.Buffer{}, t.TempDir()); err == nil {
		t.Fatal("esperava erro com arquivo faltando")
	}
}

func TestUnpackRejectsBadEntries(t *testing.T) {
	cases := map[string][]tar.Header{
		"traversal":  {{Name: "../session.db"}, {Name: MessagesFile}},
		"absoluto":   {{Name: "/etc/passwd"}},
		"diretório":  {{Name: SessionFile, Typeflag: tar.TypeDir}},
		"symlink":    {{Name: SessionFile, Typeflag: tar.TypeSymlink, Linkname: "/etc/passwd"}},
		"duplicado":  {{Name: SessionFile}, {Name: SessionFile}},
		"faltando":   {{Name: SessionFile}},
		"desconhec.": {{Name: "outro.db"}},
	}
	for name, entries := range cases {
		err := Unpack(bytes.NewReader(rawTar(t, entries, "x")), t.TempDir(), 1<<20)
		if !errors.Is(err, ErrBadArchive) {
			t.Fatalf("%s: esperava ErrBadArchive, veio %v", name, err)
		}
	}
}

func TestUnpackRejectsTooLarge(t *testing.T) {
	data := rawTar(t, []tar.Header{{Name: SessionFile}, {Name: MessagesFile}}, "0123456789")
	if err := Unpack(bytes.NewReader(data), t.TempDir(), 5); !errors.Is(err, ErrTooLarge) {
		t.Fatalf("esperava ErrTooLarge, veio %v", err)
	}
}

func TestUnpackGarbage(t *testing.T) {
	if err := Unpack(bytes.NewReader(bytes.Repeat([]byte{7}, 1024)), t.TempDir(), 10); !errors.Is(err, ErrBadArchive) {
		t.Fatalf("esperava ErrBadArchive, veio %v", err)
	}
}
