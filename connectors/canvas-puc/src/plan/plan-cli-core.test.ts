import { describe, expect, it } from 'vitest';
import { samplePlan } from '../fixtures/plan-sample.js';
import {
  invalidResult,
  parsePlanArgs,
  parsePlanOptions,
  planSummaryLines,
  readJsonFile,
  readPreviousPlan,
  runBuild,
  runExtract,
  runPlanCommand,
  runSummary,
  runValidate,
} from './plan-cli-core.js';
import type { PlanIo } from './plan-cli-core.js';
import { extractPlan, injectPlan } from './plan-embed.js';

const TEMPLATE =
  '<!doctype html><title>t</title><script id="plan-data" type="application/json">{}</script>';

function memoryIo(files: Record<string, string>): PlanIo & { files: Record<string, string> } {
  return {
    files,
    templatePath: 'template.html',
    readText(path) {
      const text = files[path];
      if (text === undefined) throw new Error(`ENOENT: ${path}`);
      return text;
    },
    writeText(path, text) {
      files[path] = text;
    },
  };
}

function json(value: unknown): string {
  return JSON.stringify(value);
}

describe('parsePlanArgs', () => {
  it('reads the command, input and options', () => {
    expect(parsePlanArgs(['build', 'p.json', '--out', 'p.html', '--previous', 'old.html'])).toEqual(
      {
        command: 'build',
        input: 'p.json',
        options: { out: 'p.html', previous: 'old.html' },
      },
    );
  });
  it.each([[[]], [['nope', 'x']], [['build']], [['build', '--out']], [['build', 'x', '--out']]])(
    'rejects %o with the usage text',
    (argv) => {
      expect(() => parsePlanArgs(argv)).toThrow(/Usage/);
    },
  );
  it('rejects unknown options', () => {
    expect(() => parsePlanArgs(['build', 'x', '--force', 'y'])).toThrow(/Unknown option --force/);
  });
});

describe('parsePlanOptions', () => {
  it('reads pairs and rejects an unpaired option', () => {
    expect(parsePlanOptions(['--data-out', 'm.json'])).toEqual({ 'data-out': 'm.json' });
    expect(() => parsePlanOptions(['--out'])).toThrow(/Usage/);
  });
});

describe('invalidResult', () => {
  it('lists the errors', () => {
    expect(invalidResult('x', ['a', 'b'])).toEqual({
      code: 1,
      output: '✖ x is invalid:\n  - a\n  - b',
    });
  });
});

describe('readJsonFile', () => {
  it('names the file when it is not JSON', () => {
    expect(() => readJsonFile(memoryIo({ 'a.json': '{' }), 'a.json')).toThrow(
      /a.json is not valid JSON/,
    );
  });
});

describe('planSummaryLines', () => {
  it('gives the missing points and level of each course', () => {
    expect(planSummaryLines(samplePlan())).toEqual([
      'ALG: faltam 20,5 de 60 · high',
      'EDA: faltam 20 de 60 · warn',
      'BD: faltam 4,5 de 60 · ok',
      'itens: 5 de estudo, 6 na linha do tempo, 2 perguntas',
    ]);
  });
});

describe('runValidate and runSummary', () => {
  it('accepts a valid plan', () => {
    const io = memoryIo({ 'p.json': json(samplePlan()) });
    expect(runValidate(parsePlanArgs(['validate', 'p.json']), io).code).toBe(0);
    expect(runSummary(parsePlanArgs(['summary', 'p.json']), io).output).toContain('ALG: faltam');
  });
  it('fails with the errors of an invalid plan', () => {
    const plan = samplePlan();
    plan.courses[0]!.points.sure = 0;
    const io = memoryIo({ 'p.json': json(plan) });
    expect(runValidate(parsePlanArgs(['validate', 'p.json']), io).output).toContain('must be 100');
    expect(runSummary(parsePlanArgs(['summary', 'p.json']), io).code).toBe(1);
  });
});

describe('readPreviousPlan', () => {
  it('is null without --previous', () => {
    expect(readPreviousPlan(parsePlanArgs(['build', 'p.json']), memoryIo({}))).toBeNull();
  });
  it('refuses an invalid previous page', () => {
    const io = memoryIo({ 'old.html': injectPlan(TEMPLATE, { ...samplePlan(), goal: 0 }) });
    expect(() =>
      readPreviousPlan(parsePlanArgs(['build', 'p', '--previous', 'old.html']), io),
    ).toThrow(/previous plan is invalid/);
  });
});

describe('runBuild', () => {
  it('writes the page and the merged JSON, reusing the previous ids', () => {
    const next = samplePlan();
    Reflect.deleteProperty(next.study[1]!.items[0]!, 'id');
    const io = memoryIo({
      'template.html': TEMPLATE,
      'p.json': json(next),
      'old.html': injectPlan(TEMPLATE, samplePlan()),
    });
    const argv = [
      'build',
      'p.json',
      '--out',
      'p.html',
      '--previous',
      'old.html',
      '--data-out',
      'm.json',
    ];
    const result = runBuild(parsePlanArgs(argv), io);
    expect(result.code).toBe(0);
    expect(extractPlan(io.files['p.html']!)).toEqual(samplePlan());
    expect(JSON.parse(io.files['m.json']!)).toEqual(samplePlan());
  });
  it('writes nothing when the plan is invalid', () => {
    const io = memoryIo({
      'template.html': TEMPLATE,
      'p.json': json({ ...samplePlan(), study: 1 }),
    });
    expect(runBuild(parsePlanArgs(['build', 'p.json', '--out', 'p.html']), io).code).toBe(1);
    expect(io.files['p.html']).toBeUndefined();
  });
  it('needs --out', () => {
    expect(() => runBuild(parsePlanArgs(['build', 'p.json']), memoryIo({}))).toThrow(/--out/);
  });
});

describe('runExtract', () => {
  it('round-trips a built page', () => {
    const io = memoryIo({ 'p.html': injectPlan(TEMPLATE, samplePlan()) });
    expect(runExtract(parsePlanArgs(['extract', 'p.html', '--out', 'p.json']), io).code).toBe(0);
    expect(JSON.parse(io.files['p.json']!)).toEqual(samplePlan());
  });
  it('still writes the JSON of an invalid plan but fails', () => {
    const io = memoryIo({ 'p.html': injectPlan(TEMPLATE, { ...samplePlan(), goal: 0 }) });
    expect(runExtract(parsePlanArgs(['extract', 'p.html', '--out', 'p.json']), io).code).toBe(1);
    expect(io.files['p.json']).toBeDefined();
  });
  it('needs --out', () => {
    expect(() => runExtract(parsePlanArgs(['extract', 'p.html']), memoryIo({}))).toThrow(/--out/);
  });
});

describe('runPlanCommand', () => {
  it('turns usage and file errors into a failed result', () => {
    expect(runPlanCommand([], memoryIo({})).output).toContain('Usage');
    expect(runPlanCommand(['validate', 'missing.json'], memoryIo({})).output).toContain('ENOENT');
  });
  it('dispatches to the command', () => {
    expect(
      runPlanCommand(['validate', 'p.json'], memoryIo({ 'p.json': json(samplePlan()) })).code,
    ).toBe(0);
  });
});
