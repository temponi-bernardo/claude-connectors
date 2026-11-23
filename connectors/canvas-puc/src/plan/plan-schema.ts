/**
 * Data model of the "Plano do Semestre" artifact (the `/planejamento-faculdade` skill): one JSON block that the page
 * template renders. The shapes are zod schemas so the CLI validates the JSON at the edge; the page only
 * imports the inferred types.
 */
import { z } from 'zod';

/** Risk level of a course, from the points model (plan-points.ts). */
export const RISK_LEVELS = ['high', 'warn', 'ok'] as const;

/** Status of a checklist item: still to do, done, or dropped (kept, never deleted). */
export const ITEM_STATUSES = ['open', 'done', 'dropped'] as const;

/** Status of a question for an instructor: still to ask, or sent and waiting for an answer. */
export const QUESTION_STATUSES = ['open', 'sent'] as const;

/** Kinds of assumption shown in the header box. */
export const ASSUMPTION_KINDS = ['informed', 'estimate', 'change'] as const;

/** Approval goal at PUC Minas when the syllabus says nothing else. */
export const DEFAULT_GOAL = 60;

/** Current schema version of the plan JSON. */
export const PLAN_SCHEMA_VERSION = 1;

const text = z.string().trim().min(1).max(2000);
const shortText = z.string().trim().min(1).max(120);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected a YYYY-MM-DD date');
const itemId = z.string().optional();
const points = z.number().finite().min(0).max(100);

const pointSplitSchema = z
  .object({ sure: points, pend: points, open: points, lost: points })
  .strict();

const assessmentSchema = z
  .object({
    title: shortText,
    max: z.number().finite().positive().max(100),
    score: z.number().finite().min(0).nullable(),
    estimated: z.boolean().optional(),
    informedByStudent: z.boolean().optional(),
    date: isoDate.optional(),
  })
  .strict();

const ruleSchema = z.object({ text, source: shortText, date: isoDate }).strict();

const courseSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,39}$/, 'expected a lowercase slug'),
    code: z.string().trim().min(1).max(12),
    name: shortText,
    teacher: z.string().trim().max(120),
    canvasId: z.string().regex(/^\d+$/).optional(),
    goal: z.number().finite().positive().max(100).optional(),
    points: pointSplitSchema,
    needsRecovery: z.boolean().optional(),
    assessments: z.array(assessmentSchema),
    path: text,
    rules: z.array(ruleSchema),
  })
  .strict();

const todayBlockSchema = z
  .object({
    date: isoDate,
    label: shortText,
    title: shortText,
    critical: z.boolean(),
    text: text.optional(),
    steps: z.array(text),
  })
  .strict();

const studyItemSchema = z
  .object({
    id: itemId,
    course: z.string().trim().min(1).max(12),
    task: text,
    duration: z.string().trim().min(1).max(20),
    optional: z.boolean().optional(),
    status: z.enum(ITEM_STATUSES),
  })
  .strict();

const studyDaySchema = z
  .object({
    date: isoDate,
    focus: shortText,
    hours: z.number().finite().min(0).max(24),
    items: z.array(studyItemSchema),
  })
  .strict();

const timelineItemSchema = z
  .object({
    id: itemId,
    course: z.string().trim().min(1).max(12),
    title: text,
    time: z.string().trim().max(20).optional(),
    points: z.string().trim().max(120).optional(),
    optional: z.boolean().optional(),
    status: z.enum(ITEM_STATUSES),
  })
  .strict();

const timelineDaySchema = z
  .object({ date: isoDate, conflict: text.optional(), items: z.array(timelineItemSchema) })
  .strict();

const questionSchema = z
  .object({
    id: itemId,
    course: z.string().trim().min(1).max(12),
    text,
    status: z.enum(QUESTION_STATUSES),
    sentOn: isoDate.optional(),
  })
  .strict();

const whatsappGroupSchema = z
  .object({
    jid: z.string().trim().min(3).max(200),
    name: shortText,
    course: z.string().trim().min(1).max(12),
  })
  .strict();

/** The whole plan JSON, as the page template embeds it. */
export const planSchema = z
  .object({
    schema: z.literal(PLAN_SCHEMA_VERSION),
    planKey: z.string().regex(/^[a-z0-9][a-z0-9-]{2,59}$/, 'expected a lowercase slug'),
    term: z.string().regex(/^\d{4}\/[12]$/, 'expected YYYY/1 or YYYY/2'),
    program: shortText,
    generatedAt: z.string().datetime({ offset: true }),
    goal: z.number().finite().positive().max(100),
    sources: z.array(shortText).min(1),
    missingSources: z.array(shortText),
    assumptions: z.array(z.object({ kind: z.enum(ASSUMPTION_KINDS), text }).strict()),
    focus: z.object({ from: isoDate, to: isoDate, blocks: z.array(todayBlockSchema) }).strict(),
    courses: z.array(courseSchema).min(1),
    study: z.array(studyDaySchema),
    timeline: z.array(timelineDaySchema),
    undated: z.array(timelineItemSchema),
    questions: z.array(questionSchema),
    whatsappGroups: z.array(whatsappGroupSchema),
  })
  .strict();

export type PlanData = z.infer<typeof planSchema>;
export type PlanCourse = PlanData['courses'][number];
export type PointSplit = PlanCourse['points'];
export type Assessment = PlanCourse['assessments'][number];
export type StudyDay = PlanData['study'][number];
export type StudyItem = StudyDay['items'][number];
export type TimelineDay = PlanData['timeline'][number];
export type TimelineItem = TimelineDay['items'][number];
export type PlanQuestion = PlanData['questions'][number];
export type TodayBlock = PlanData['focus']['blocks'][number];
export type RiskLevel = (typeof RISK_LEVELS)[number];
export type ItemStatus = (typeof ITEM_STATUSES)[number];
