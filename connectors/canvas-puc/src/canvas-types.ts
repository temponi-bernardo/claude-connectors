/**
 * Formas (parciais) das respostas da API REST do Canvas usadas pelo conector.
 * Só os campos lidos aqui; todos opcionais porque o Canvas omite campos conforme permissões.
 */

export type Id = number | string;

export interface CanvasEnrollment {
  readonly course_id?: Id;
  readonly computed_current_score?: number | null;
  readonly computed_current_grade?: string | null;
  readonly grades?: {
    readonly current_score?: number | null;
    readonly current_grade?: string | null;
    readonly final_score?: number | null;
  };
}

export interface CanvasCourse {
  readonly id: Id;
  readonly name?: string;
  readonly course_code?: string;
  readonly term?: { readonly name?: string };
  readonly enrollments?: readonly CanvasEnrollment[];
}

export interface CanvasSubmissionFlags {
  readonly submitted?: boolean;
  readonly late?: boolean;
  readonly missing?: boolean;
  readonly graded?: boolean;
}

export interface CanvasPlannerItem {
  readonly plannable_type?: string;
  readonly plannable_id?: Id;
  readonly plannable_date?: string;
  readonly context_name?: string;
  readonly course_id?: Id;
  readonly html_url?: string;
  readonly plannable?: {
    readonly title?: string;
    readonly name?: string;
    readonly points_possible?: number | null;
  };
  readonly submissions?: CanvasSubmissionFlags | false;
}

export interface CanvasComment {
  readonly author_name?: string;
  readonly comment?: string;
  readonly created_at?: string;
}

export interface CanvasAttachment {
  readonly id?: Id;
  readonly display_name?: string;
  readonly url?: string;
  readonly size?: number;
  readonly updated_at?: string;
  readonly 'content-type'?: string;
}

export interface CanvasSubmission {
  readonly assignment_id?: Id;
  readonly workflow_state?: string;
  readonly submitted_at?: string | null;
  readonly score?: number | null;
  readonly grade?: string | null;
  readonly late?: boolean;
  readonly missing?: boolean;
  readonly attempt?: number | null;
  readonly submission_comments?: readonly CanvasComment[];
  readonly rubric_assessment?: unknown;
  readonly attachments?: readonly CanvasAttachment[];
  readonly assignment?: CanvasAssignment;
}

export interface CanvasRubricCriterion {
  readonly description?: string;
  readonly points?: number;
  readonly ratings?: readonly { readonly points?: number; readonly description?: string }[];
}

export interface CanvasAssignment {
  readonly id: Id;
  readonly name?: string;
  readonly description?: string | null;
  readonly due_at?: string | null;
  readonly unlock_at?: string | null;
  readonly lock_at?: string | null;
  readonly points_possible?: number | null;
  readonly submission_types?: readonly string[];
  readonly allowed_extensions?: readonly string[];
  readonly html_url?: string;
  readonly rubric?: readonly CanvasRubricCriterion[];
  readonly submission?: CanvasSubmission;
}

export interface CanvasAnnouncement {
  readonly id: Id;
  readonly title?: string;
  readonly context_code?: string;
  readonly posted_at?: string;
  readonly message?: string;
  readonly html_url?: string;
  readonly user_name?: string;
  readonly author?: { readonly display_name?: string };
}

export interface CanvasModuleItem {
  readonly id: Id;
  readonly type?: string;
  readonly title?: string;
  readonly content_id?: Id;
  readonly page_url?: string;
  readonly external_url?: string;
  readonly completion_requirement?: { readonly completed?: boolean };
}

export interface CanvasModule {
  readonly id: Id;
  readonly name?: string;
  readonly items?: readonly CanvasModuleItem[];
}

export interface CanvasPage {
  readonly url?: string;
  readonly title?: string;
  readonly body?: string | null;
  readonly updated_at?: string;
  readonly html_url?: string;
}

export interface CanvasDiscussionTopic {
  readonly id: Id;
  readonly title?: string;
  readonly message?: string | null;
  readonly html_url?: string;
  readonly discussion_subentry_count?: number;
  readonly unread_count?: number;
  readonly last_reply_at?: string | null;
  readonly assignment?: { readonly due_at?: string | null };
}

export interface CanvasDiscussionEntry {
  readonly user_id?: Id;
  readonly created_at?: string;
  readonly message?: string | null;
  readonly replies?: readonly CanvasDiscussionEntry[];
}

export interface CanvasDiscussionView {
  readonly participants?: readonly { readonly id: Id; readonly display_name?: string }[];
  readonly view?: readonly CanvasDiscussionEntry[];
}

export interface CanvasCalendarEvent {
  readonly title?: string;
  readonly start_at?: string;
  readonly end_at?: string;
  readonly location_name?: string;
  readonly context_name?: string;
  readonly description?: string | null;
}

export interface CanvasProfile {
  readonly id: Id;
  readonly name?: string;
  readonly primary_email?: string;
  readonly login_id?: string;
  readonly time_zone?: string;
}
