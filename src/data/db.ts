import Dexie, { type EntityTable } from "dexie";
import type {
  Task,
  ChecklistTemplate,
  ChecklistRun,
  Summary,
  Attachment,
  KV,
} from "../domain/types";

export const DB_NAME = "bsk_ops";
export const DB_VERSION = 1;

export class BskOpsDB extends Dexie {
  tasks!: EntityTable<Task, "id">;
  checklistTemplates!: EntityTable<ChecklistTemplate, "id">;
  checklistRuns!: EntityTable<ChecklistRun, "id">;
  summaries!: EntityTable<Summary, "id">;
  attachments!: EntityTable<Attachment, "id">;
  kv!: EntityTable<KV, "key">;

  constructor() {
    super(DB_NAME);

    this.version(DB_VERSION).stores({
      tasks: "id, status, updatedAt, when, dueAt, checklistTemplateId",
      checklistTemplates: "id, updatedAt, name",
      checklistRuns:
        "id, templateId, status, updatedAt, when, startedAt, completedAt",
      summaries: "id, targetType, targetId, updatedAt",
      attachments: "id, targetType, targetId, kind, updatedAt, name",
      kv: "key, updatedAt",
    });
  }
}

export const db = new BskOpsDB();
