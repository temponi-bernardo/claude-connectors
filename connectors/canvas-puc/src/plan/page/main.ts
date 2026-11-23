/** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. */
import type { PlanData } from '../plan-schema.js';
import type { ClaudeLike, SyncState } from './checks.js';
import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js';
import { requireEl } from './dom.js';
import { saoPauloToday } from './format.js';
import { renderCourses } from './render-courses.js';
import {
  progressText,
  renderQuestions,
  renderStudy,
  renderTimeline,
  renderToday,
} from './render-days.js';
import type { DayContext } from './render-days.js';
import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js';

export interface PlanPageEnv {
  readonly doc: Document;
  readonly now: Date;
  readonly storage: Storage | null;
  readonly claude?: ClaudeLike | undefined;
}

/** The plan embedded in the page. */
export function readEmbeddedPlan(doc: Document): PlanData {
  return JSON.parse(requireEl(doc, 'plan-data').textContent || 'null') as PlanData;
}

/** Shows a sync state in every status line. */
export function showSyncState(doc: Document, state: SyncState): void {
  doc.querySelectorAll<HTMLElement>('.sync').forEach((el) => {
    el.textContent = SYNC_MESSAGES[state];
    el.dataset.state = state;
  });
}

/** Renders every section; returns the study and timeline checkboxes. */
export function renderPlanSections(
  ctx: DayContext,
  plan: PlanData,
): [HTMLInputElement[], HTMLInputElement[]] {
  const { doc } = ctx;
  renderHeader(doc, plan);
  renderRiskChips(doc, plan);
  renderToday(doc, plan);
  const study = renderStudy(ctx, plan.study);
  renderCourses(doc, plan);
  const timeline = renderTimeline(ctx, plan.timeline, plan.undated);
  renderQuestions(doc, plan);
  renderFooter(doc, plan);
  return [study, timeline];
}

/** Writes the "X de Y" counters of both checklists. */
export function updateCounters(
  doc: Document,
  study: readonly HTMLInputElement[],
  timeline: readonly HTMLInputElement[],
): void {
  requireEl(doc, 'study-progress').textContent = progressText(study, 'feitos');
  requireEl(doc, 'timeline-progress').textContent = progressText(timeline, 'concluídos');
}

/** Renders the whole page and returns once the account sync has settled. */
export async function bootPlanPage(env: PlanPageEnv): Promise<void> {
  const { doc } = env;
  const plan = readEmbeddedPlan(doc);
  function status(state: SyncState): void {
    showSyncState(doc, state);
  }
  const store = createCheckStore({ key: plan.planKey, storage: env.storage, status });
  const ctx = { doc, today: saoPauloToday(env.now), levels: courseLevels(plan), store };
  const [study, timeline] = renderPlanSections(ctx, plan);
  store.listeners.push(() => {
    updateCounters(doc, study, timeline);
  });
  updateCounters(doc, study, timeline);
  await connectAccount(store, env.claude);
}

/** Browser storage, or null when the browser blocks it. */
export function safeLocalStorage(win: Window): Storage | null {
  try {
    return win.localStorage;
  } catch {
    return null;
  }
}

/** Starts the page in the browser, showing a short message if the plan data is broken. */
export function startPlanPage(win: Window & { claude?: ClaudeLike }): Promise<void> {
  const env = {
    doc: win.document,
    now: new Date(),
    storage: safeLocalStorage(win),
    claude: win.claude,
  };
  return bootPlanPage(env).catch((error: unknown) => {
    const note = win.document.getElementById('plan-error');
    if (note) {
      note.hidden = false;
      note.textContent = `Não consegui montar o plano: ${(error as Error).message}`;
    }
  });
}
