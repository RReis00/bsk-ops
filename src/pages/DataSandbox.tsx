// src/pages/DataSandbox.tsx
import { type FormEvent, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  createTask,
  db,
  deleteTask,
  updateTask,
  dayBucket,
  kvGet,
  kvSet,
} from "../data/db";

export default function DataSandbox() {
  const [title, setTitle] = useState("");
  const [flag, setFlag] = useState("saw_banner");

  const today = dayBucket(Date.now());
  const tasks = useLiveQuery(
    () => db.tasks.where({ when: today }).reverse().sortBy("updatedAt"),
    [today]
  );

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    void createTask({ title: t, status: "todo", when: today }).then(() => {
      setTitle("");
    });
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Data Sandbox</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Create Task (today)</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 flex-1"
          />
          <button className="bg-white text-black px-3 py-2 rounded-lg">
            Add
          </button>
        </form>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Today's Tasks</h2>
        <ul className="space-y-2">
          {(tasks ?? []).map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-xl bg-neutral-900 px-3 py-2"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.status === "done"}
                  onChange={() => {
                    void updateTask(t.id, {
                      status: t.status === "done" ? "todo" : "done",
                    });
                  }}
                />
                <span
                  className={
                    t.status === "done" ? "line-through opacity-70" : ""
                  }
                >
                  {t.title}
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newTitle = prompt("Rename task", t.title) ?? t.title;
                    void updateTask(t.id, { title: newTitle });
                  }}
                  className="px-2 py-1 bg-neutral-800 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    void deleteTask(t.id);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">KV Flags</h2>
        <div className="flex gap-2 items-center">
          <input
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700"
          />
          <button
            onClick={() => {
              void kvGet(flag).then((v) => {
                alert(`${flag} = ${JSON.stringify(v)}`);
              });
            }}
            className="px-3 py-2 bg-neutral-800 rounded"
          >
            Get
          </button>
          <button
            onClick={() => {
              void kvSet(flag, true).then(() => {
                alert(`Set ${flag} = true`);
              });
            }}
            className="px-3 py-2 bg-white text-black rounded"
          >
            Set true
          </button>
        </div>
      </section>
    </main>
  );
}
