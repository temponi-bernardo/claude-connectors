/**
 * `tsx tools/pr-check/cli.ts whatsapp-image [base]`: prints `build` when the diff since the merge-base with
 * `base` (default `origin/main`), plus uncommitted and untracked files, touches the WhatsApp image inputs, and
 * `skip` otherwise. Called by `scripts/pr-check.sh`.
 */
import { listChangedFiles, touchesWhatsAppImage } from './whatsapp-image.js';

/** Prints the WhatsApp image decision for the current repository. */
function runPrCheckCli(): void {
  const base = process.argv[3] ?? 'origin/main';
  const files = listChangedFiles(process.cwd(), base);
  process.stdout.write(touchesWhatsAppImage(files) ? 'build\n' : 'skip\n');
}

runPrCheckCli();
