import { db, dayBucket, now } from "../../data/db";
import type { Summary } from "../../domain/types";

export async function markTasksDone(taskIds: string[]) {
  const ts = now();
  if (taskIds.length === 0) return;

  await db.transaction("rw", db.tasks, async () => {
    for (const id of taskIds) {
      const t = await db.tasks.get(id);
      if (t && t.status !== "done") {
        await db.tasks.update(id, { status: "done", updatedAt: ts });
      }
    }
  });
}

export async function endDay({
  note,
  markPendingAsDone,
}: {
  note?: string;
  markPendingAsDone?: boolean;
}): Promise<Summary> {
  const ts = now();
  const today = dayBucket(new Date());

  return db.transaction("rw", db.tasks, db.summaries, async () => {
    const tasksToday = await db.tasks.where("when").equals(today).toArray();

    const total = tasksToday.length;
    const done = tasksToday.filter((t) => t.status === "done");
    const blocked = tasksToday.filter((t) => t.status === "blocked");
    const pending = tasksToday.filter(
      (t) => t.status !== "done" && t.status !== "archived"
    );

    if (markPendingAsDone && pending.length > 0) {
      for (const t of pending) {
        await db.tasks.update(t.id, { status: "done", updatedAt: ts });
      }
    }

    const summaryUnknown = {
      id: crypto.randomUUID(),
      targetType: "day",
      targetId: String(today),
      content: {
        day: today,
        totalCount: total,
        doneCount: markPendingAsDone ? total : done.length,
        blockedCount: blocked.length,
        note: note?.trim() ?? undefined,
      },
      createdAt: ts,
      updatedAt: ts,
    };

    const summary = summaryUnknown as unknown as Summary;
    await db.summaries.put(summary);
    return summary;
  });
}
