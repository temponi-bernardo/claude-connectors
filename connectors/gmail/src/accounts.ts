/**
 * Apelidos das contas vinculadas, resolução do parâmetro `account` das ferramentas e conferência do
 * escopo de escrita. Pura.
 */
import { hasModifyScope } from './config.js';
import type { LinkedAccount } from './token-store.js';

/** Conta vinculada com o apelido usado nas ferramentas. */
export interface AccountRef {
  readonly alias: string;
  readonly account: LinkedAccount;
}

/** Parte antes do `@`, em minúsculas (`musica.nova@example.com` → `musica.nova`). */
export function accountAlias(email: string): string {
  return email.slice(0, email.indexOf('@')).toLowerCase();
}

/** Apelido de cada conta: a parte antes do `@`, ou o e-mail inteiro quando duas contas a repetem. */
export function aliasAccounts(accounts: readonly LinkedAccount[]): AccountRef[] {
  const counts = new Map<string, number>();
  for (const { email } of accounts) {
    counts.set(accountAlias(email), (counts.get(accountAlias(email)) ?? 0) + 1);
  }
  return accounts.map((account) => {
    const short = accountAlias(account.email);
    return { alias: (counts.get(short) ?? 0) > 1 ? account.email : short, account };
  });
}

/** Erro de quem ainda não vinculou nenhuma conta. */
export function noAccountsError(): Error {
  return new Error(
    'Nenhuma conta Gmail vinculada. Use a ferramenta link_account para vincular uma.',
  );
}

/** Contas pedidas: `all` são todas; apelido ou e-mail escolhem uma; o resto vira erro com os válidos. */
export function resolveAccounts(refs: readonly AccountRef[], requested: string): AccountRef[] {
  if (refs.length === 0) throw noAccountsError();
  const wanted = requested.trim().toLowerCase();
  if (wanted === 'all') return [...refs];
  const found = refs.find((ref) => ref.alias === wanted || ref.account.email === wanted);
  if (found) return [found];
  const valid = [...refs.map((ref) => `"${ref.alias}"`), '"all"'].join(', ');
  throw new Error(
    `Conta "${requested}" não vinculada. Use ${valid}, ou link_account para vincular.`,
  );
}

/** Erro de conta vinculada antes do gerenciamento (token só com `gmail.readonly`). */
export function writeAccessError(alias: string): Error {
  return new Error(
    `A conta "${alias}" foi vinculada só para leitura. Para enviar, organizar ou apagar e-mails, use link_account e entre com ela de novo, permitindo gerenciar o Gmail.`,
  );
}

/** Lança `writeAccessError` se o token da conta não tiver o escopo `gmail.modify`. */
export function requireWriteAccess(ref: AccountRef): void {
  if (!hasModifyScope(ref.account.scope)) throw writeAccessError(ref.alias);
}
