// Package snapshot implements the encrypted WAS1 format (see API.md) and the tar packing of the databases.
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
	// Magic identifies the format at the start of the file.
	Magic = "WAS1"
	// Version is the only known format version.
	Version = 1
	// BlockSize is the plaintext size of each written block.
	BlockSize = 64 * 1024
	// HeaderSize is the fixed header size (magic+version+generation+block+salt+reserved).
	HeaderSize = 63
	// KeySize is the required master key size (AES-256).
	KeySize = 32

	hkdfInfo     = "whatsapp-snapshot-v1"
	saltSize     = 32
	maxBlockSize = 1 << 20
	tagSize      = 16
)

var (
	// ErrBadHeader signals an invalid magic, block size or reserved field.
	ErrBadHeader = errors.New("snapshot: invalid header")
	// ErrVersion signals an unknown format version.
	ErrVersion = errors.New("snapshot: unknown version")
	// ErrAuth signals a block authentication failure (wrong key, altered byte or reordered blocks).
	ErrAuth = errors.New("snapshot: authentication failed")
	// ErrTruncated signals that the file ended before the last block.
	ErrTruncated = errors.New("snapshot: truncated file")
	// ErrTrailing signals data after the last block.
	ErrTrailing = errors.New("snapshot: data after the last block")
	// ErrKeySize signals a master key whose size is not 32 bytes.
	ErrKeySize = errors.New("snapshot: the key must be 32 bytes")
)

// Header is the decoded WAS1 header.
type Header struct {
	Generation uint64
	BlockSize  uint32
	Salt       [saltSize]byte
}

// encodeHeader serializes the header into 63 bytes (pure).
func encodeHeader(h Header) []byte {
	buf := make([]byte, HeaderSize)
	copy(buf[0:4], Magic)
	buf[4] = Version
	binary.BigEndian.PutUint64(buf[5:13], h.Generation)
	binary.BigEndian.PutUint32(buf[13:17], h.BlockSize)
	copy(buf[17:49], h.Salt[:])
	return buf
}

// decodeHeader validates and decodes the 63 header bytes (pure).
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

// newAEAD derives the HKDF-SHA256(key, salt, info) subkey and creates the AES-256-GCM.
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

// blockNonce builds the nonce: 3 zeros + big-endian uint64 counter + last-block flag (pure).
func blockNonce(counter uint64, last bool) []byte {
	nonce := make([]byte, 12)
	binary.BigEndian.PutUint64(nonce[3:11], counter)
	if last {
		nonce[11] = 1
	}
	return nonce
}

// Writer encrypts in streaming in the WAS1 format. Close writes the last block and is mandatory.
type Writer struct {
	dst     io.Writer
	aead    cipher.AEAD
	aad     []byte
	buf     []byte
	counter uint64
	closed  bool
}

// NewWriter writes the header to dst and returns a Writer ready to receive the plaintext.
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

// Write buffers the content and seals full blocks, always keeping the last one for Close.
func (w *Writer) Write(p []byte) (int, error) {
	if w.closed {
		return 0, errors.New("snapshot: write after Close")
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

// Close seals the final block (flag 1), which may be empty.
func (w *Writer) Close() error {
	if w.closed {
		return nil
	}
	w.closed = true
	return w.seal(true)
}

// seal encrypts the current buffer as one block and writes it to the destination.
func (w *Writer) seal(last bool) error {
	out := w.aead.Seal(nil, blockNonce(w.counter, last), w.buf, w.aad)
	w.counter++
	w.buf = w.buf[:0]
	_, err := w.dst.Write(out)
	return err
}

// Reader decrypts a WAS1 file in streaming, validating order, integrity and the final block.
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

// NewReader reads and validates the header of src.
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

// Generation returns the generation stored in the header.
func (r *Reader) Generation() uint64 { return r.header.Generation }

// Read returns the plaintext; it only returns io.EOF after authenticating the final block.
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

// nextBlock reads and opens the next encrypted block.
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

// openFinal opens a block that must be the last one and confirms nothing follows it.
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

// open authenticates and decrypts a block with the current counter.
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
