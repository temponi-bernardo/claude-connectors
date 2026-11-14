package store

import (
	"context"
	"database/sql"
	"time"
)

// SendWindow é a janela do limite de envios.
const SendWindow = time.Hour

// retryAfter decide quantos segundos faltam para a vaga mais antiga sair da janela (função pura).
func retryAfter(oldest, now int64) int {
	wait := oldest + int64(SendWindow/time.Second) - now
	return int(max(wait, 1))
}

// ReserveSend registra uma tentativa de envio se houver vaga na última hora.
// Sem vaga, devolve false e os segundos até liberar. A tabela sends persiste o limite entre reinícios.
func (s *Store) ReserveSend(ctx context.Context, now time.Time, maxPerHour int) (bool, int, error) {
	s.sendMu.Lock()
	defer s.sendMu.Unlock()
	var ok bool
	var wait int
	err := s.inTx(ctx, func(tx *sql.Tx) error {
		var err error
		ok, wait, err = reserveInTx(ctx, tx, now.Unix(), maxPerHour)
		return err
	})
	return ok, wait, err
}

// reserveInTx limpa registros velhos, conta a janela e grava a nova tentativa quando cabe.
func reserveInTx(ctx context.Context, tx *sql.Tx, now int64, maxPerHour int) (bool, int, error) {
	since := now - int64(SendWindow/time.Second)
	if _, err := tx.ExecContext(ctx, `DELETE FROM sends WHERE ts <= ?`, since); err != nil {
		return false, 0, err
	}
	var count int
	var oldest sql.NullInt64
	if err := tx.QueryRowContext(ctx, `SELECT COUNT(*), MIN(ts) FROM sends WHERE ts > ?`, since).Scan(&count, &oldest); err != nil {
		return false, 0, err
	}
	if count >= maxPerHour {
		if !oldest.Valid {
			oldest.Int64 = now
		}
		return false, retryAfter(oldest.Int64, now), nil
	}
	_, err := tx.ExecContext(ctx, `INSERT INTO sends (ts) VALUES (?)`, now)
	return true, 0, err
}
