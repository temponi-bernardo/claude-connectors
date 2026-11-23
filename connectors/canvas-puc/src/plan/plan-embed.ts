/**
 * Puts the plan JSON into the page template and takes it back out of a published page. The JSON lives in
 * a single `<script id="plan-data" type="application/json">` block, with `<`, `>`, `&` and the JavaScript
 * line separators escaped, so no text from Canvas, email or WhatsApp can close the tag. Pure.
 */
import type { PlanData } from './plan-schema.js';

/** The data block: opening tag, JSON, closing tag. */
export const PLAN_DATA_PATTERN =
  /(<script id="plan-data" type="application\/json">)([\s\S]*?)(<\/script>)/g;

/** The page title element. */
export const TITLE_PATTERN = /<title>[\s\S]*?<\/title>/g;

const JSON_ESCAPES: Readonly<Record<string, string>> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Plan title shown in the page and used to find the artifact: "Plano do Semestre 2026/2". */
export function planTitle(term: string): string {
  return `Plano do Semestre ${term}`;
}

/** JSON of the plan, safe inside a `<script>` element (still valid JSON). */
export function serializePlanJson(plan: PlanData): string {
  return JSON.stringify(plan).replace(/[<>&\u2028\u2029]/g, (char) => JSON_ESCAPES[char] ?? char);
}

/** Text escaped for HTML content and attribute values. */
export function escapeHtmlText(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/** Number of matches of a global pattern in a text. */
export function countMatches(text: string, pattern: RegExp): number {
  return [...text.matchAll(pattern)].length;
}

/** Page HTML: the template with the plan JSON and the title filled in. Throws if the template has no single slot. */
export function injectPlan(template: string, plan: PlanData): string {
  if (
    countMatches(template, PLAN_DATA_PATTERN) !== 1 ||
    countMatches(template, TITLE_PATTERN) !== 1
  ) {
    throw new Error(
      'The template must have exactly one <title> and one <script id="plan-data" type="application/json">: rebuild it with `npm run build`.',
    );
  }
  const json = serializePlanJson(plan);
  const page = template.replace(PLAN_DATA_PATTERN, (block) =>
    block.replace(/>[\s\S]*<\/script>$/, () => `>${json}</script>`),
  );
  const title = `<title>${escapeHtmlText(planTitle(plan.term))}</title>`;
  return page.replace(TITLE_PATTERN, () => title);
}

/** The plan JSON of a page built by `injectPlan` (not validated). Throws if the page has no single data block. */
export function extractPlan(html: string): unknown {
  const blocks = [...html.matchAll(PLAN_DATA_PATTERN)];
  const json = blocks.length === 1 ? blocks[0]?.[2] : undefined;
  if (json === undefined) {
    throw new Error(
      'No single plan-data block in this page: it was not built by the /planejamento script.',
    );
  }
  return JSON.parse(json) as unknown;
}
