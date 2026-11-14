package snapshot

import (
	"bytes"
	"crypto/rand"
	"errors"
	"io"
	"testing"
)

func testKey(b byte) []byte { return bytes.Repeat([]byte{b}, KeySize) }

func encrypt(t *testing.T, key, plain []byte, gen uint64) []byte {
	t.Helper()
	var out bytes.Buffer
	w, err := NewWriter(&out, key, gen)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := w.Write(plain); err != nil {
		t.Fatal(err)
	}
	if err := w.Close(); err != nil {
		t.Fatal(err)
	}
	return out.Bytes()
}

func decrypt(key, data []byte) ([]byte, uint64, error) {
	r, err := NewReader(bytes.NewReader(data), key)
	if err != nil {
		return nil, 0, err
	}
	plain, err := io.ReadAll(r)
	return plain, r.Generation(), err
}

func randomBytes(n int) []byte {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return b
}

func TestRoundTripSizes(t *testing.T) {
	for _, n := range []int{0, 1, BlockSize - 1, BlockSize, BlockSize + 1, 3*BlockSize + 17, 4 * BlockSize} {
		plain := randomBytes(n)
		enc := encrypt(t, testKey(1), plain, 42)
		got, gen, err := decrypt(testKey(1), enc)
		if err != nil {
			t.Fatalf("n=%d: %v", n, err)
		}
		if !bytes.Equal(got, plain) || gen != 42 {
			t.Fatalf("n=%d: conteúdo ou geração divergentes", n)
		}
	}
}

func TestHeaderLayout(t *testing.T) {
	enc := encrypt(t, testKey(1), []byte("x"), 7)
	if string(enc[:4]) != Magic || enc[4] != Version {
		t.Fatal("magic/versão errados")
	}
	if !bytes.Equal(enc[49:63], make([]byte, 14)) {
		t.Fatal("reservado não zerado")
	}
	if len(enc) != HeaderSize+1+tagSize {
		t.Fatalf("tamanho inesperado %d", len(enc))
	}
}

func TestWrongKey(t *testing.T) {
	enc := encrypt(t, testKey(1), randomBytes(1000), 1)
	if _, _, err := decrypt(testKey(2), enc); !errors.Is(err, ErrAuth) {
		t.Fatalf("esperava ErrAuth, veio %v", err)
	}
}

func TestTamperedBytes(t *testing.T) {
	enc := encrypt(t, testKey(1), randomBytes(2*BlockSize+5), 1)
	for _, pos := range []int{6, 20, HeaderSize + 3, HeaderSize + BlockSize + tagSize + 1, len(enc) - 1} {
		bad := bytes.Clone(enc)
		bad[pos] ^= 0x01
		if _, _, err := decrypt(testKey(1), bad); err == nil {
			t.Fatalf("byte %d alterado não foi detectado", pos)
		}
	}
}

func TestTruncatedWithoutFinalBlock(t *testing.T) {
	enc := encrypt(t, testKey(1), randomBytes(2*BlockSize+5), 1)
	full := HeaderSize + 2*(BlockSize+tagSize)
	if _, _, err := decrypt(testKey(1), enc[:full]); !errors.Is(err, ErrAuth) && !errors.Is(err, ErrTruncated) {
		t.Fatalf("truncado em fronteira de bloco: %v", err)
	}
	if _, _, err := decrypt(testKey(1), enc[:HeaderSize+BlockSize+tagSize]); err == nil {
		t.Fatal("truncado depois do primeiro bloco não falhou")
	}
	if _, _, err := decrypt(testKey(1), enc[:HeaderSize]); !errors.Is(err, ErrTruncated) {
		t.Fatalf("só cabeçalho: %v", err)
	}
	if _, _, err := decrypt(testKey(1), enc[:10]); !errors.Is(err, ErrTruncated) {
		t.Fatalf("cabeçalho incompleto: %v", err)
	}
}

func TestReorderedBlocks(t *testing.T) {
	enc := encrypt(t, testKey(1), randomBytes(3*BlockSize), 1)
	bs := BlockSize + tagSize
	b1 := enc[HeaderSize : HeaderSize+bs]
	b2 := enc[HeaderSize+bs : HeaderSize+2*bs]
	bad := append(append(append(bytes.Clone(enc[:HeaderSize]), b2...), b1...), enc[HeaderSize+2*bs:]...)
	if _, _, err := decrypt(testKey(1), bad); !errors.Is(err, ErrAuth) {
		t.Fatalf("esperava ErrAuth, veio %v", err)
	}
}

func TestTrailingData(t *testing.T) {
	enc := append(encrypt(t, testKey(1), randomBytes(BlockSize), 1), 0)
	if _, _, err := decrypt(testKey(1), enc); !errors.Is(err, ErrTrailing) {
		t.Fatalf("esperava ErrTrailing, veio %v", err)
	}
	short := append(encrypt(t, testKey(1), []byte("abc"), 1), 0)
	if _, _, err := decrypt(testKey(1), short); err == nil {
		t.Fatal("byte extra após bloco curto não detectado")
	}
}

func TestUnknownVersionAndBadHeader(t *testing.T) {
	enc := encrypt(t, testKey(1), []byte("abc"), 1)
	v := bytes.Clone(enc)
	v[4] = 2
	if _, _, err := decrypt(testKey(1), v); !errors.Is(err, ErrVersion) {
		t.Fatalf("esperava ErrVersion, veio %v", err)
	}
	m := bytes.Clone(enc)
	m[0] = 'X'
	if _, _, err := decrypt(testKey(1), m); !errors.Is(err, ErrBadHeader) {
		t.Fatalf("esperava ErrBadHeader, veio %v", err)
	}
	r := bytes.Clone(enc)
	r[60] = 1
	if _, _, err := decrypt(testKey(1), r); !errors.Is(err, ErrBadHeader) {
		t.Fatalf("reservado: esperava ErrBadHeader, veio %v", err)
	}
	z := bytes.Clone(enc)
	copy(z[13:17], []byte{0, 0, 0, 0})
	if _, _, err := decrypt(testKey(1), z); !errors.Is(err, ErrBadHeader) {
		t.Fatalf("bloco zero: esperava ErrBadHeader, veio %v", err)
	}
}

func TestKeySize(t *testing.T) {
	if _, err := NewWriter(io.Discard, []byte("curta"), 1); !errors.Is(err, ErrKeySize) {
		t.Fatalf("esperava ErrKeySize, veio %v", err)
	}
	enc := encrypt(t, testKey(1), nil, 1)
	if _, err := NewReader(bytes.NewReader(enc), []byte("curta")); !errors.Is(err, ErrKeySize) {
		t.Fatalf("esperava ErrKeySize, veio %v", err)
	}
}

func TestWriteAfterCloseAndDoubleClose(t *testing.T) {
	w, _ := NewWriter(io.Discard, testKey(1), 1)
	if err := w.Close(); err != nil {
		t.Fatal(err)
	}
	if err := w.Close(); err != nil {
		t.Fatal("segundo Close deveria ser no-op")
	}
	if _, err := w.Write([]byte("x")); err == nil {
		t.Fatal("escrita após Close deveria falhar")
	}
}

type failWriter struct{ after int }

func (f *failWriter) Write(p []byte) (int, error) {
	if f.after <= 0 {
		return 0, errors.New("falha de escrita")
	}
	f.after--
	return len(p), nil
}

func TestWriterPropagatesErrors(t *testing.T) {
	if _, err := NewWriter(&failWriter{after: 0}, testKey(1), 1); err == nil {
		t.Fatal("falha no cabeçalho não propagada")
	}
	w, _ := NewWriter(&failWriter{after: 1}, testKey(1), 1)
	if _, err := w.Write(randomBytes(2*BlockSize + 1)); err == nil {
		t.Fatal("falha no bloco não propagada")
	}
}
