import { db, now } from "../../data/db";
import type { Task, Attachment } from "../../domain/types";

export async function toggleTaskDone(taskId: string, currentStatus: string) {
  const ts = now();
  if (currentStatus === "done") {
    await db.tasks.update(taskId, { status: "todo", updatedAt: ts });
  } else {
    await db.tasks.update(taskId, { status: "done", updatedAt: ts });
  }
}

export async function blockTask(taskId: string, reason: string | undefined) {
  const ts = now();
  await db.tasks.update(taskId, {
    status: "blocked",
    blockedReason: reason?.trim() ? reason.trim() : undefined,
    updatedAt: ts,
  });
}

export async function unblockTask(taskId: string) {
  const ts = now();
  await db.tasks.update(taskId, {
    status: "todo",
    blockedReason: undefined,
    updatedAt: ts,
  });
}

export async function deleteTask(taskId: string) {
  await db.tasks.delete(taskId);
}

export async function moveTaskToWeek(taskId: string) {
  const ts = now();
  await db.tasks.update(taskId, {
    when: null,
    updatedAt: ts,
  });
}

export async function addPhotoAttachmentStub(task: Task) {
  const ts = now();
  const id = crypto.randomUUID();

  const att: Attachment = {
    id,
    targetType: "task",
    targetId: task.id,
    kind: "photo" as unknown as Attachment["kind"],
    name: `Foto - ${task.title}`,
    mimeType: "image/jpeg",
    url: `stub://photo/${id}.jpg`,
    createdAt: ts,
    updatedAt: ts,
  };

  await db.attachments.put(att);
}
