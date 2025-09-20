import { db } from "../../../data/db";
import { todayBucket } from "../../../domain/dateUtils";

export async function moveTasksToToday(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const ts = Date.now();
  const today = todayBucket();

  await db.transaction("rw", db.tasks, async () => {
    for (const id of ids) {
      await db.tasks.update(id, { when: today, updatedAt: ts });
    }
  });
}

export async function moveTaskToToday(id: string): Promise<void> {
  return moveTasksToToday([id]);
}
