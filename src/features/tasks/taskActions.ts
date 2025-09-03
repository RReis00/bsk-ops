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

export async function deleteTask(taskId: string) {
  await db.tasks.delete(taskId);
}
