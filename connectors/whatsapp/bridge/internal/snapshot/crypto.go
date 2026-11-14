// Package snapshot implementa o formato cifrado WAS1 (ver API.md) e o empacotamento tar dos bancos.
package snapshot

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"errors"
	"fmt"
	"io"

	"golang.org/x/crypto/hkdf"
)

const (
	// Magic identifica o formato no início do arquivo.
	Magic = "WAS1"
	// Version é a única versão de formato conhecida.
	Version = 1
	// BlockSize é o tamanho em claro de cada bloco gravado.
	BlockSize = 64 * 1024
	// HeaderSize é o tamanho fixo do cabeçalho (magic+versão+generation+bloco+salt+reservado).
	HeaderSize = 63
	// KeySize é o tamanho exigido da chave mestra (AES-256).
	KeySize = 32

	hkdfInfo     = "whatsapp-snapshot-v1"
	saltSize     = 32
	maxBlockSize = 1 << 20
	tagSize      = 16
)

var (
	// ErrBadHeader indica magic, tamanho de bloco ou campo reservado inválidos.
	ErrBadHeader = errors.New("snapshot: cabeçalho inválido")
	// ErrVersion indica uma versão de formato desconhecida.
	ErrVersion = errors.New("snapshot: versão desconhecida")
	// ErrAuth indica falha de autenticação de um bloco (chave errada, byte alterado ou blocos reordenados).
	ErrAuth = errors.New("snapshot: falha de autenticação")
	// ErrTruncated indica que o arquivo terminou antes do último bloco.
	ErrTruncated = errors.New("snapshot: arquivo truncado")
	// ErrTrailing indica dados depois do último bloco.
	ErrTrailing = errors.New("snapshot: dados após o último bloco")
	// ErrKeySize indica chave mestra com tamanho diferente de 32 bytes.
	ErrKeySize = errors.New("snapshot: a chave precisa ter 32 bytes")
)

// Header é o cabeçalho WAS1 já decodificado.
type Header struct {
	Generation uint64
	BlockSize  uint32
	Salt       [saltSize]byte
}

// encodeHeader serializa o cabeçalho em 63 bytes (função pura).
func encodeHeader(h Header) []byte {
	buf := make([]byte, HeaderSize)
	copy(buf[0:4], Magic)
	buf[4] = Version
	binary.BigEndian.PutUint64(buf[5:13], h.Generation)
	binary.BigEndian.PutUint32(buf[13:17], h.BlockSize)
	copy(buf[17:49], h.Salt[:])
	return buf
}

// decodeHeader valida e decodifica os 63 bytes do cabeçalho (função pura).
func decodeHeader(buf []byte) (Header, error) {
	var h Header
	if len(buf) != HeaderSize || string(buf[0:4]) != Magic {
		return h, ErrBadHeader
	}
	if buf[4] != Version {
		return h, ErrVersion
	}
	h.Generation = binary.BigEndian.Uint64(buf[5:13])
	h.BlockSize = binary.BigEndian.Uint32(buf[13:17])
	copy(h.Salt[:], buf[17:49])
	if h.BlockSize == 0 || h.BlockSize > maxBlockSize || !bytes.Equal(buf[49:], make([]byte, 14)) {
		return h, ErrBadHeader
	}
	return h, nil
}

// newAEAD deriva a subchave HKDF-SHA256(chave, salt, info) e cria o AES-256-GCM.
func newAEAD(key []byte, salt []byte) (cipher.AEAD, error) {
	if len(key) != KeySize {
		return nil, ErrKeySize
	}
	sub := make([]byte, KeySize)
	if _, err := io.ReadFull(hkdf.New(sha256.New, key, salt, []byte(hkdfInfo)), sub); err != nil {
		return nil, fmt.Errorf("snapshot: hkdf: %w", err)
	}
	block, err := aes.NewCipher(sub)
	if err != nil {
		return nil, err
	}
	return cipher.NewGCM(block)
}

// blockNonce monta o nonce: 3 zeros + contador uint64 big-endian + flag de último bloco (função pura).
func blockNonce(counter uint64, last bool) []byte {
	nonce := make([]byte, 12)
	binary.BigEndian.PutUint64(nonce[3:11], counter)
	if last {
		nonce[11] = 1
	}
	return nonce
}

// Writer cifra em streaming no formato WAS1. Close grava o último bloco e é obrigatório.
type Writer struct {
	dst     io.Writer
	aead    cipher.AEAD
	aad     []byte
	buf     []byte
	counter uint64
	closed  bool
}

// NewWriter grava o cabeçalho em dst e devolve um Writer pronto para receber o conteúdo em claro.
func NewWriter(dst io.Writer, key []byte, generation uint64) (*Writer, error) {
	h := Header{Generation: generation, BlockSize: BlockSize}
	if _, err := rand.Read(h.Salt[:]); err != nil {
		return nil, err
	}
	aead, err := newAEAD(key, h.Salt[:])
	if err != nil {
		return nil, err
	}
	header := encodeHeader(h)
	if _, err := dst.Write(header); err != nil {
		return nil, err
	}
	return &Writer{dst: dst, aead: aead, aad: header, buf: make([]byte, 0, BlockSize)}, nil
}

// Write acumula o conteúdo e sela blocos cheios, sempre guardando o último para o Close.
func (w *Writer) Write(p []byte) (int, error) {
	if w.closed {
		return 0, errors.New("snapshot: escrita após Close")
	}
	n := len(p)
	for len(p) > 0 {
		if len(w.buf) == BlockSize {
			if err := w.seal(false); err != nil {
				return n - len(p), err
			}
		}
		take := min(BlockSize-len(w.buf), len(p))
		w.buf = append(w.buf, p[:take]...)
		p = p[take:]
	}
	return n, nil
}

// Close sela o bloco final (flag 1), que pode estar vazio.
func (w *Writer) Close() error {
	if w.closed {
		return nil
	}
	w.closed = true
	return w.seal(true)
}

// seal cifra o buffer atual como um bloco e o grava no destino.
func (w *Writer) seal(last bool) error {
	out := w.aead.Seal(nil, blockNonce(w.counter, last), w.buf, w.aad)
	w.counter++
	w.buf = w.buf[:0]
	_, err := w.dst.Write(out)
	return err
}

// Reader decifra em streaming um arquivo WAS1, validando ordem, integridade e o bloco final.
type Reader struct {
	src     io.Reader
	aead    cipher.AEAD
	aad     []byte
	header  Header
	chunk   []byte
	plain   []byte
	counter uint64
	done    bool
}

// NewReader lê e valida o cabeçalho de src.
func NewReader(src io.Reader, key []byte) (*Reader, error) {
	raw := make([]byte, HeaderSize)
	if _, err := io.ReadFull(src, raw); err != nil {
		return nil, ErrTruncated
	}
	h, err := decodeHeader(raw)
	if err != nil {
		return nil, err
	}
	aead, err := newAEAD(key, h.Salt[:])
	if err != nil {
		return nil, err
	}
	return &Reader{src: src, aead: aead, aad: raw, header: h, chunk: make([]byte, int(h.BlockSize)+tagSize)}, nil
}

// Generation devolve a geração gravada no cabeçalho.
func (r *Reader) Generation() uint64 { return r.header.Generation }

// Read entrega o conteúdo em claro; só devolve io.EOF depois de autenticar o bloco final.
func (r *Reader) Read(p []byte) (int, error) {
	for len(r.plain) == 0 {
		if r.done {
			return 0, io.EOF
		}
		if err := r.nextBlock(); err != nil {
			return 0, err
		}
	}
	n := copy(p, r.plain)
	r.plain = r.plain[n:]
	return n, nil
}

// nextBlock lê e abre o próximo bloco cifrado.
func (r *Reader) nextBlock() error {
	n, err := io.ReadFull(r.src, r.chunk)
	switch {
	case err == io.EOF:
		return ErrTruncated
	case err == io.ErrUnexpectedEOF:
		return r.openFinal(r.chunk[:n])
	case err != nil:
		return err
	}
	plain, openErr := r.open(r.chunk, false)
	if openErr == nil {
		r.plain = plain
		return nil
	}
	return r.openFinal(r.chunk)
}

// openFinal abre um bloco que precisa ser o último e confirma que nada vem depois.
func (r *Reader) openFinal(ct []byte) error {
	plain, err := r.open(ct, true)
	if err != nil {
		return err
	}
	var one [1]byte
	if n, _ := io.ReadFull(r.src, one[:]); n > 0 {
		return ErrTrailing
	}
	r.plain, r.done = plain, true
	return nil
}

// open autentica e decifra um bloco com o contador atual.
func (r *Reader) open(ct []byte, last bool) ([]byte, error) {
	if len(ct) < tagSize {
		return nil, ErrTruncated
	}
	plain, err := r.aead.Open(nil, blockNonce(r.counter, last), ct, r.aad)
	if err != nil {
		return nil, ErrAuth
	}
	r.counter++
	return plain, nil
}
