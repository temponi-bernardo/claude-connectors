import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/docker-proxy-ca.sh');
const DOCKERFILE =
  'FROM golang:1 AS build\nRUN go mod download\nFROM scratch\nCOPY --from=build /out /out\n';
const dirs: string[] = [];

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** Temporary folder removed after each test. */
function scratchDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'docker-ca-'));
  dirs.push(dir);
  return dir;
}

/** Fake `docker` that records its arguments and a copy of the build context it received. */
function fakeDocker(root: string): string {
  const bin = join(root, 'bin');
  mkdirSync(bin);
  const body = [
    '#!/bin/bash',
    `printf '%s\\n' "$@" > "${root}/args"`,
    'for ((i=1;i<=$#;i++)); do [ "${!i}" = "-f" ] && j=$((i+1)) && cp "${!j}" "' +
      root +
      '/Dockerfile.seen"; done',
    `[ "$1" = build ] && cp -a "\${@: -1}" "${root}/ctx-seen"`,
    'exit 0',
  ].join('\n');
  writeFileSync(join(bin, 'docker'), body);
  chmodSync(join(bin, 'docker'), 0o755);
  return bin;
}

/** Build context with a Dockerfile and a deny-all .dockerignore, like connectors/whatsapp. */
function buildContext(root: string, dockerfile = DOCKERFILE): string {
  const ctx = join(root, 'ctx');
  mkdirSync(ctx);
  writeFileSync(join(ctx, 'Dockerfile'), dockerfile);
  writeFileSync(join(ctx, '.dockerignore'), '*\n!bridge/\n');
  return ctx;
}

/** Runs the wrapper with the fake docker first on PATH, the given CA path and optional stdin. */
function runWrapper(root: string, args: string[], io: { ca: string; input?: string }) {
  const env = {
    ...process.env,
    PATH: `${fakeDocker(root)}:${process.env.PATH}`,
    DOCKER_PROXY_CA: io.ca,
  };
  return spawnSync('bash', [SCRIPT, ...args], { encoding: 'utf8', env, input: io.input });
}

/** Writes a fake CA bundle and returns its path. */
function fakeCa(root: string): string {
  const ca = join(root, 'ca.crt');
  writeFileSync(ca, 'CA');
  return ca;
}

describe('docker-proxy-ca.sh', () => {
  it('passes non-build commands through unchanged', () => {
    const root = scratchDir();
    const r = runWrapper(root, ['push', 'img:1'], { ca: fakeCa(root) });
    expect(r.status).toBe(0);
    expect(readFileSync(join(root, 'args'), 'utf8')).toBe('push\nimg:1\n');
  });

  it('trusts the CA in the build stage only, in a copy of the context', () => {
    const root = scratchDir();
    const ctx = buildContext(root);
    const r = runWrapper(root, ['build', '-t', 'img', '-f', join(ctx, 'Dockerfile'), ctx], {
      ca: fakeCa(root),
    });
    expect(r.status).toBe(0);
    const seen = readFileSync(join(root, 'Dockerfile.seen'), 'utf8').split('\n');
    expect(seen.slice(0, 3)).toEqual([
      'FROM golang:1 AS build',
      'COPY ccr-proxy-ca.crt /usr/local/share/ca-certificates/ccr-proxy-ca.crt',
      'RUN update-ca-certificates',
    ]);
    expect(seen.filter((l) => l.includes('ccr-proxy-ca'))).toHaveLength(1);
    expect(readFileSync(join(root, 'ctx-seen/ccr-proxy-ca.crt'), 'utf8')).toBe('CA');
    expect(readFileSync(join(root, 'ctx-seen/.dockerignore'), 'utf8')).toContain(
      '!ccr-proxy-ca.crt',
    );
    expect(readFileSync(join(root, 'args'), 'utf8')).toContain('--network\nhost\n');
    expect(existsSync(join(ctx, 'ccr-proxy-ca.crt'))).toBe(false);
  });

  it('uses <context>/Dockerfile when -f is not given', () => {
    const root = scratchDir();
    const ctx = buildContext(root);
    expect(runWrapper(root, ['build', '-t', 'img', ctx], { ca: fakeCa(root) }).status).toBe(0);
    expect(readFileSync(join(root, 'Dockerfile.seen'), 'utf8')).toContain('update-ca-certificates');
  });

  it('reads the Dockerfile from stdin with -f - (how wrangler calls it)', () => {
    const root = scratchDir();
    const ctx = buildContext(root, 'FROM scratch\n');
    const r = runWrapper(root, ['build', '-t', 'img', '-f', '-', ctx], {
      ca: fakeCa(root),
      input: DOCKERFILE,
    });
    expect(r.status).toBe(0);
    expect(readFileSync(join(root, 'Dockerfile.seen'), 'utf8')).toContain('update-ca-certificates');
  });

  it('accepts --file=<path>', () => {
    const root = scratchDir();
    const ctx = buildContext(root, 'FROM scratch\n');
    writeFileSync(join(root, 'Other.Dockerfile'), DOCKERFILE);
    const r = runWrapper(root, ['build', `--file=${join(root, 'Other.Dockerfile')}`, ctx], {
      ca: fakeCa(root),
    });
    expect(r.status).toBe(0);
    expect(readFileSync(join(root, 'args'), 'utf8')).not.toContain('--file=');
    expect(readFileSync(join(root, 'Dockerfile.seen'), 'utf8')).toContain('update-ca-certificates');
  });

  it('runs docker unchanged when there is no proxy CA', () => {
    const root = scratchDir();
    const ctx = buildContext(root);
    const r = runWrapper(root, ['build', ctx], { ca: join(root, 'missing.crt') });
    expect(r.status).toBe(0);
    expect(readFileSync(join(root, 'args'), 'utf8')).toBe(`build\n${ctx}\n`);
  });

  it('fails clearly when the Dockerfile has no build stage', () => {
    const root = scratchDir();
    const ctx = buildContext(root, 'FROM scratch\n');
    const r = runWrapper(root, ['build', ctx], { ca: fakeCa(root) });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('no "AS build" stage');
  });
});
