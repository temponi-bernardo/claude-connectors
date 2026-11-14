package snapshot

import (
	"archive/tar"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"
)

// Nomes de arquivo aceitos dentro do tar, nesta ordem.
const (
	SessionFile  = "session.db"
	MessagesFile = "messages.db"
)

// FileNames lista os arquivos que compõem um snapshot.
var FileNames = []string{SessionFile, MessagesFile}

// ErrBadArchive indica um tar com nomes inesperados, tipos inválidos, duplicatas ou arquivos faltando.
var ErrBadArchive = errors.New("snapshot: conteúdo do tar inválido")

// ErrTooLarge indica um arquivo do tar acima do teto permitido.
var ErrTooLarge = errors.New("snapshot: arquivo grande demais")

// Pack grava em w um tar determinístico (sem datas nem donos) com os arquivos de dir listados em FileNames.
func Pack(w io.Writer, dir string) error {
	tw := tar.NewWriter(w)
	for _, name := range FileNames {
		if err := packFile(tw, filepath.Join(dir, name), name); err != nil {
			return err
		}
	}
	return tw.Close()
}

// packFile adiciona um arquivo ao tar com cabeçalho fixo.
func packFile(tw *tar.Writer, path, name string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()
	info, err := f.Stat()
	if err != nil {
		return err
	}
	hdr := &tar.Header{Name: name, Mode: 0o600, Size: info.Size(), ModTime: time.Unix(0, 0), Typeflag: tar.TypeReg, Format: tar.FormatPAX}
	if err := tw.WriteHeader(hdr); err != nil {
		return err
	}
	_, err = io.Copy(tw, f)
	return err
}

// Unpack extrai de r, para dir, exatamente os arquivos de FileNames, cada um com no máximo maxFile bytes.
func Unpack(r io.Reader, dir string, maxFile int64) error {
	tr := tar.NewReader(r)
	seen := map[string]bool{}
	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("%w: %w", ErrBadArchive, err)
		}
		if err := checkEntry(hdr, seen, maxFile); err != nil {
			return err
		}
		if err := extractFile(tr, filepath.Join(dir, hdr.Name), maxFile); err != nil {
			return err
		}
	}
	if len(seen) != len(FileNames) {
		return ErrBadArchive
	}
	return nil
}

// checkEntry decide se uma entrada do tar é aceitável (nome conhecido, arquivo regular, sem repetição, tamanho).
func checkEntry(hdr *tar.Header, seen map[string]bool, maxFile int64) error {
	if !isAllowedName(hdr.Name) || hdr.Typeflag != tar.TypeReg || seen[hdr.Name] {
		return ErrBadArchive
	}
	if hdr.Size < 0 || hdr.Size > maxFile {
		return ErrTooLarge
	}
	seen[hdr.Name] = true
	return nil
}

// isAllowedName aceita só os nomes exatos esperados (impede path traversal).
func isAllowedName(name string) bool {
	for _, n := range FileNames {
		if name == n {
			return true
		}
	}
	return false
}

// extractFile copia o conteúdo da entrada atual para path, respeitando o teto.
func extractFile(r io.Reader, path string, maxFile int64) error {
	f, err := os.OpenFile(path, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	n, err := io.Copy(f, io.LimitReader(r, maxFile+1))
	if cerr := f.Close(); err == nil {
		err = cerr
	}
	if err == nil && n > maxFile {
		err = ErrTooLarge
	}
	return err
}
