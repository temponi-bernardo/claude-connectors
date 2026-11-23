/**
 * Decides whether `pr:check` must build the WhatsApp container image. The Worker bundle is always checked
 * without Docker (`whatsapp:build`); the image (`whatsapp:image`) is built only when the diff touches what goes
 * into it: the Dockerfile and its build context (`bridge/`, `NOTICE.md`, `.dockerignore`), the `[[containers]]`
 * config in `wrangler.toml` and the Docker wrapper used in cloud sessions.
 */
import { spawnSync } from 'node:child_process';

const WHATSAPP_DIR = 'connectors/whatsapp/';

/** Paths (exact files, or folders ending in `/`) whose change requires building the WhatsApp image. */
export const WHATSAPP_IMAGE_INPUTS = [
  `${WHATSAPP_DIR}Dockerfile`,
  `${WHATSAPP_DIR}.dockerignore`,
  `${WHATSAPP_DIR}NOTICE.md`,
  `${WHATSAPP_DIR}wrangler.toml`,
  `${WHATSAPP_DIR}bridge/`,
  'scripts/docker-proxy-ca.sh',
];

/** True when any changed file is a WhatsApp image input. */
export function touchesWhatsAppImage(files: string[]): boolean {
  return files.some((file) =>
    WHATSAPP_IMAGE_INPUTS.some((input) =>
      input.endsWith('/') ? file.startsWith(input) : file === input,
    ),
  );
}

/** The word `pr:check` acts on: `build` when the image inputs changed, `skip` otherwise. */
export function whatsAppImageDecision(files: string[]): 'build' | 'skip' {
  return touchesWhatsAppImage(files) ? 'build' : 'skip';
}

/** Joins the outputs of several `git ... --name-only` commands into unique, non-empty paths. */
export function splitGitLines(outputs: string[]): string[] {
  const paths = outputs.flatMap((output) => output.split('\n')).map((line) => line.trim());
  return [...new Set(paths.filter((line) => line !== ''))];
}

/** Runs git in `cwd` and returns its output; throws with git's message when it fails. */
export function runGit(cwd: string, args: string[]): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr.trim()}`);
  return result.stdout;
}

/** Files changed since the merge-base with `base`: commits, staged and unstaged edits and untracked files. */
export function listChangedFiles(cwd: string, base: string): string[] {
  const mergeBase = runGit(cwd, ['merge-base', base, 'HEAD']).trim();
  return splitGitLines([
    runGit(cwd, ['diff', '--name-only', mergeBase, 'HEAD']),
    runGit(cwd, ['diff', '--name-only', 'HEAD']),
    runGit(cwd, ['ls-files', '--others', '--exclude-standard']),
  ]);
}
