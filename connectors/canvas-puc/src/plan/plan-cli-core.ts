/**
 * Commands of the `/planejamento` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the
 * page from the template (reusing the previous version's ids), extract the JSON of a published page and print
 * a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk.
 */
import { extractPlan, injectPlan } from './plan-embed.js';
import { mergeWithPrevious } from './plan-ids.js';
import { formatPoints, pointsMissing, riskLevel } from './plan-points.js';
import { planSchema } from './plan-schema.js';
import type { PlanData } from './plan-schema.js';
import { validatePlan, zodIssueLines } from './plan-validate.js';

/** Commands the script accepts. */
export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const;

/** Usage text printed on a wrong call. */
export const PLAN_USAGE = [
  'Usage:',
  '  node plan.mjs validate <plan.json>',
  '  node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]',
  '  node plan.mjs extract <page.html> --out <plan.json>',
  '  node plan.mjs summary <plan.json>',
].join('\n');

export type PlanCommand = (typeof PLAN_COMMANDS)[number];

export interface PlanArgs {
  readonly command: PlanCommand;
  readonly input: string;
  readonly options: Readonly<Record<string, string>>;
}

export interface PlanIo {
  readText(path: string): string;
  writeText(path: string, text: string): void;
  readonly templatePath: string;
}

export interface PlanResult {
  readonly code: 0 | 1;
  readonly output: string;
}

/** Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. */
export function parsePlanOptions(rest: readonly string[]): Record<string, string> {
  if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE);
  const options: Record<string, string> = {};
  for (let i = 0; i < rest.length; i += 2) {
    const name = rest[i] ?? '';
    if (!/^--(out|previous|data-out)$/.test(name)) {
      throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`);
    }
    options[name.slice(2)] = rest[i + 1] ?? '';
  }
  return options;
}

/** Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. */
export function parsePlanArgs(argv: readonly string[]): PlanArgs {
  const [command = '', input = '', ...rest] = argv;
  const known = (PLAN_COMMANDS as readonly string[]).includes(command);
  if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE);
  return { command: command as PlanCommand, input, options: parsePlanOptions(rest) };
}

/** A failed result listing validation errors. */
export function invalidResult(what: string, errors: readonly string[]): PlanResult {
  return {
    code: 1,
    output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'),
  };
}

/** Reads and parses a JSON file; throws naming the file when it is not JSON. */
export function readJsonFile(io: PlanIo, path: string): unknown {
  try {
    return JSON.parse(io.readText(path)) as unknown;
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error });
  }
}

/** One line per course: code, points missing to the goal and risk level; plus the counts. */
export function planSummaryLines(plan: PlanData): string[] {
  const courses = plan.courses.map((course) => {
    const goal = course.goal ?? plan.goal;
    const level = riskLevel(course.points, goal, course.needsRecovery);
    return `${course.code}: faltam ${formatPoints(pointsMissing(course.points, goal))} de ${formatPoints(goal)} · ${level}`;
  });
  const study = plan.study.reduce((n, d) => n + d.items.length, 0);
  const timeline = plan.timeline.reduce((n, d) => n + d.items.length, 0) + plan.undated.length;
  return [
    ...courses,
    `itens: ${study} de estudo, ${timeline} na linha do tempo, ${plan.questions.length} perguntas`,
  ];
}

/** `validate`: checks the plan JSON. */
export function runValidate(args: PlanArgs, io: PlanIo): PlanResult {
  const result = validatePlan(readJsonFile(io, args.input));
  if (!result.ok) return invalidResult(args.input, result.errors);
  return { code: 0, output: ['✔ plan valid', ...planSummaryLines(result.plan)].join('\n') };
}

/** The previous version's plan, from its page; null without `--previous`. Throws when it is not a valid plan. */
export function readPreviousPlan(args: PlanArgs, io: PlanIo): PlanData | null {
  const path = args.options.previous;
  if (path === undefined) return null;
  const result = validatePlan(extractPlan(io.readText(path)));
  if (!result.ok)
    throw new Error(`${path}: the previous plan is invalid:\n${result.errors.join('\n')}`);
  return result.plan;
}

/** `build`: checks the shape, merges with the previous version, validates and writes the page (and the merged JSON). */
export function runBuild(args: PlanArgs, io: PlanIo): PlanResult {
  const out = args.options.out;
  if (out === undefined) throw new Error(`build needs --out\n${PLAN_USAGE}`);
  const shape = planSchema.safeParse(readJsonFile(io, args.input));
  if (!shape.success) return invalidResult(args.input, zodIssueLines(shape.error));
  const merged = mergeWithPrevious(shape.data, readPreviousPlan(args, io));
  const result = validatePlan(merged);
  if (!result.ok) return invalidResult(args.input, result.errors);
  io.writeText(out, injectPlan(io.readText(io.templatePath), result.plan));
  const dataOut = args.options['data-out'];
  if (dataOut !== undefined) io.writeText(dataOut, `${JSON.stringify(result.plan, null, 2)}\n`);
  return {
    code: 0,
    output: [`✔ page written to ${out}`, ...planSummaryLines(result.plan)].join('\n'),
  };
}

/** `extract`: writes the plan JSON of a published page and says whether it is valid. */
export function runExtract(args: PlanArgs, io: PlanIo): PlanResult {
  const out = args.options.out;
  if (out === undefined) throw new Error(`extract needs --out\n${PLAN_USAGE}`);
  const data = extractPlan(io.readText(args.input));
  io.writeText(out, `${JSON.stringify(data, null, 2)}\n`);
  const result = validatePlan(data);
  return result.ok
    ? { code: 0, output: `✔ plan extracted to ${out}` }
    : invalidResult(`plan extracted to ${out}`, result.errors);
}

/** `summary`: the per-course lines of a valid plan. */
export function runSummary(args: PlanArgs, io: PlanIo): PlanResult {
  const result = validatePlan(readJsonFile(io, args.input));
  if (!result.ok) return invalidResult(args.input, result.errors);
  return { code: 0, output: planSummaryLines(result.plan).join('\n') };
}

/** Runs a command line; usage and file errors become a failed result instead of an exception. */
export function runPlanCommand(argv: readonly string[], io: PlanIo): PlanResult {
  const commands = {
    validate: runValidate,
    build: runBuild,
    extract: runExtract,
    summary: runSummary,
  };
  try {
    const args = parsePlanArgs(argv);
    return commands[args.command](args, io);
  } catch (error) {
    return { code: 1, output: `✖ ${(error as Error).message}` };
  }
}
