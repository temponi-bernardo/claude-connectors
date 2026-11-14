/**
 * Aliases of the linked accounts, resolution of the tools' `account` parameter and write scope check. Pure.
 */
import { hasModifyScope } from './config.js';
import type { LinkedAccount } from './token-store.js';

/** Linked account with the alias used by the tools. */
export interface AccountRef {
  readonly alias: string;
  readonly account: LinkedAccount;
}

/** Part before the `@`, lowercased (`music.new@example.com` → `music.new`). */
export function accountAlias(email: string): string {
  return email.slice(0, email.indexOf('@')).toLowerCase();
}

/** Alias of each account: the part before the `@`, or the full email when two accounts share it. */
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

/** Error for a user who has not linked any account yet. */
export function noAccountsError(): Error {
  return new Error('No Gmail account linked. Use the link_account tool to link one.');
}

/** Requested accounts: `all` is every one; an alias or email picks one; anything else errors listing the valid ones. */
export function resolveAccounts(refs: readonly AccountRef[], requested: string): AccountRef[] {
  if (refs.length === 0) throw noAccountsError();
  const wanted = requested.trim().toLowerCase();
  if (wanted === 'all') return [...refs];
  const found = refs.find((ref) => ref.alias === wanted || ref.account.email === wanted);
  if (found) return [found];
  const valid = [...refs.map((ref) => `"${ref.alias}"`), '"all"'].join(', ');
  throw new Error(
    `Account "${requested}" is not linked. Use ${valid}, or link_account to link it.`,
  );
}

/** Error for an account linked before Gmail management (token with `gmail.readonly` only). */
export function writeAccessError(alias: string): Error {
  return new Error(
    `Account "${alias}" was linked read-only. To send, organize or delete email, use link_account and sign in with it again, allowing Gmail management.`,
  );
}

/** Throws `writeAccessError` if the account token lacks the `gmail.modify` scope. */
export function requireWriteAccess(ref: AccountRef): void {
  if (!hasModifyScope(ref.account.scope)) throw writeAccessError(ref.alias);
}
