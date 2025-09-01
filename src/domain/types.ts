export type ID = string;

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "done"
  | "archived";

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  when?: number | null;
  dueAt?: number | null;
  checklistTemplateId?: ID | null;
  createdAt: number;
  updatedAt: number;
}

export interface ChecklistStep {
  id: ID;
  text: string;
  defaultDone?: boolean;
}

export interface ChecklistTemplate {
  id: ID;
  name: string;
  description?: string;
  version: number;
  steps: ChecklistStep[];
  createdAt: number;
  updatedAt: number;
}

export type RunStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "canceled";

export interface ChecklistRunItem {
  stepId: ID;
  done: boolean;
  note?: string;
  doneAt?: number;
}

export interface ChecklistRun {
  id: ID;
  templateId: ID;
  status: RunStatus;
  startedAt?: number | null;
  completedAt?: number | null;
  when?: number | null;
  items: ChecklistRunItem[];
  createdAt: number;
  updatedAt: number;
}

export type TargetType = "task" | "template" | "run";

export interface Summary {
  id: ID;
  targetType: TargetType;
  targetId: ID;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type AttachmentKind = "image" | "file" | "link";

export interface Attachment {
  id: ID;
  targetType: TargetType;
  targetId: ID;
  kind: AttachmentKind;
  name?: string;
  mimeType?: string;
  size?: number;
  blob?: Blob;
  url?: string;
  createdAt: number;
  updatedAt: number;
}

export interface KV {
  key: string;
  value: unknown;
  updatedAt: number;
}
