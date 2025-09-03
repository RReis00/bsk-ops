import { db, now } from "../../data/db";

export async function toggleTaskDone(taskId: string, currentStatus: string) {
  const ts = now();
  if (currentStatus === "done") {
    await db.tasks.update(taskId, {
      status: "todo",
      updatedAt: ts,
    });
  } else {
    await db.tasks.update(taskId, {
      status: "done",
      updatedAt: ts,
    });
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
