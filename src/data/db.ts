import Dexie, { type EntityTable } from "dexie";
import type {
  ID,
  Task,
  TaskStatus,
  ChecklistTemplate,
  ChecklistRun,
  Summary,
  Attachment,
  KV,
} from "../domain/types";

// ------------------------
// Constants
// ------------------------

export const DB_NAME = "bsk_ops";
export const DB_VERSION = 1;

// ------------------------
// Helpers
// ------------------------

export const newId = (): ID =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const now = () => Date.now();

export const dayBucket = (input: number | Date = new Date()): number => {
  const d = typeof input === "number" ? new Date(input) : new Date(input);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

// ------------------------
// Dexie DB (v1)
// ------------------------

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

// ------------------------
// CRUD: Task
// ------------------------

export async function createTask(
  input: Omit<Task, "id" | "createdAt" | "updatedAt"> & { id?: ID }
): Promise<Task> {
  const entity: Task = {
    id: input.id ?? newId(),
    title: input.title,
    description: input.description,
    status: input.status ?? "todo",
    when: input.when ?? null,
    dueAt: input.dueAt ?? null,
    checklistTemplateId: input.checklistTemplateId ?? null,
    createdAt: now(),
    updatedAt: now(),
  };
  await db.tasks.add(entity);
  return entity;
}

export async function updateTask(
  id: ID,
  changes: Partial<Omit<Task, "id" | "createdAt">>
) {
  await db.tasks.update(id, { ...changes, updatedAt: now() });
}

export async function deleteTask(id: ID) {
  await db.tasks.delete(id);
}

export async function listTasksByStatus(status: TaskStatus) {
  return db.tasks.where({ status }).reverse().sortBy("updatedAt");
}

export async function listTasksForDay(day: number) {
  return db.tasks.where({ when: day }).sortBy("createdAt");
}

// ------------------------
// KV helpers (UI flags / light settings)
// ------------------------

export async function kvGet<T = unknown>(key: string): Promise<T | undefined> {
  const row = await db.kv.get(key);
  return row?.value as T | undefined;
}

export async function kvSet(key: string, value: unknown) {
  await db.kv.put({ key, value, updatedAt: now() });
}

export async function kvRemove(key: string) {
  await db.kv.delete(key);
}
