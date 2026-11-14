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

// File names accepted inside the tar, in this order.
const (
	SessionFile  = "session.db"
	MessagesFile = "messages.db"
)

// FileNames lists the files that make up a snapshot.
var FileNames = []string{SessionFile, MessagesFile}

// ErrBadArchive signals a tar with unexpected names, invalid types, duplicates or missing files.
var ErrBadArchive = errors.New("snapshot: invalid tar content")

// ErrTooLarge signals a tar file above the allowed cap.
var ErrTooLarge = errors.New("snapshot: file too large")

// Pack writes to w a deterministic tar (no dates or owners) with the files of dir listed in FileNames.
func Pack(w io.Writer, dir string) error {
	tw := tar.NewWriter(w)
	for _, name := range FileNames {
		if err := packFile(tw, filepath.Join(dir, name), name); err != nil {
			return err
		}
	}
	return tw.Close()
}

// packFile adds a file to the tar with a fixed header.
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

// Unpack extracts from r into dir exactly the files in FileNames, each at most maxFile bytes.
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

// checkEntry decides whether a tar entry is acceptable (known name, regular file, no repeats, size).
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

// isAllowedName accepts only the exact expected names (prevents path traversal).
func isAllowedName(name string) bool {
	for _, n := range FileNames {
		if name == n {
			return true
		}
	}
	return false
}

// extractFile copies the current entry content to path, respecting the cap.
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
