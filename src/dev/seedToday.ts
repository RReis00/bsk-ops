import { db, dayBucket, now } from "../data/db";

let alreadyRunning = false;

export async function seedToday() {
  if (alreadyRunning) return;
  alreadyRunning = true;

  const today = dayBucket(new Date());

  const flag = await db.kv.get("dev_seed_v1_done");
  if (flag?.value === true) return;

  const ts = now();

  await db.tasks.bulkPut([
    {
      id: crypto.randomUUID(),
      title: "Estudar React",
      description: "Rever hooks principais",
      status: "done",
      when: today,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: crypto.randomUUID(),
      title: "Treino no ginásio",
      status: "todo",
      when: today,
      dueAt: Date.now() + 3 * 60 * 60 * 1000,
      createdAt: ts,
      updatedAt: ts,
    },
  ]);

  // marca que já semeou
  await db.kv.put({ key: "dev_seed_v1_done", value: true, updatedAt: ts });

  console.warn("✅ Seed de tarefas de hoje criado!");
}
