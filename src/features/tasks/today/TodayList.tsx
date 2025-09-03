import { useState } from "react";
import { useTodayTasks, type TodayFilters } from "./useTodayTasks";
import type { Task } from "../../../domain/types";
import { toggleTaskDone, deleteTask } from "../taskActions";

function Row({ task }: { task: Task }) {
  const [isBusy, setIsBusy] = useState(false);

  async function onToggleDone() {
    try {
      setIsBusy(true);
      await toggleTaskDone(task.id, task.status);
    } finally {
      setIsBusy(false);
    }
  }

  async function onDelete() {
    if (!window.confirm(`Eliminar "${task.title}"?`)) return;
    try {
      setIsBusy(true);
      await deleteTask(task.id);
    } finally {
      setIsBusy(false);
    }
  }

  function handleToggleDoneClick() {
    void onToggleDone();
  }
  function handleDeleteClick() {
    void onDelete();
  }

  return (
    <li className="rounded-xl border border-white/10 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{task.title}</p>
          {task.description ? (
            <p className="text-sm opacity-70">{task.description}</p>
          ) : null}
          {task.dueAt ? (
            <p className="mt-1 text-xs opacity-60">
              Due: {new Date(task.dueAt).toLocaleTimeString()}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={
              task.status === "done"
                ? "Desmarcar concluída"
                : "Marcar concluída"
            }
            title={
              task.status === "done"
                ? "Desmarcar concluída"
                : "Marcar concluída"
            }
            onClick={handleToggleDoneClick}
            disabled={isBusy}
            className={[
              "rounded-lg border px-2 py-1 text-sm",
              task.status === "done"
                ? "border-yellow-500/40 bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30"
                : "border-emerald-500/40 bg-emerald-500/20 text-emerald-50 hover:bg-emerald-500/30",
            ].join(" ")}
          >
            {task.status === "done" ? "↩ Undo" : "✓ Done"}
          </button>

          <button
            type="button"
            aria-label="Eliminar tarefa"
            title="Eliminar"
            onClick={handleDeleteClick}
            disabled={isBusy}
            className="rounded-lg border border-red-500/40 bg-red-500/20 px-2 py-1 text-sm text-red-50 hover:bg-red-500/30"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      <div className="mt-2">
        <span
          className={[
            "rounded-full px-2 py-0.5 text-xs",
            task.status === "done"
              ? "bg-emerald-600/30 text-emerald-200"
              : task.status === "blocked"
                ? "bg-yellow-600/30 text-yellow-100"
                : "bg-white/10 text-white/80",
          ].join(" ")}
        >
          {task.status}
        </span>
      </div>
    </li>
  );
}

export default function TodayList({
  search,
  filters,
}: {
  search: string;
  filters: TodayFilters;
}) {
  const { tasks, isLoading, count } = useTodayTasks(search, filters);

  if (isLoading) {
    return (
      <ul className="mt-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="h-16 animate-pulse rounded-xl bg-white/5"
            aria-hidden
          />
        ))}
      </ul>
    );
  }

  if (count === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-white/15 p-6 text-center">
        <p className="font-medium">Nada para hoje…</p>
        <p className="mt-1 text-sm opacity-70">
          Usa “Select from Week” (em breve) para puxar tarefas da semana.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((t) => (
        <Row key={t.id} task={t} />
      ))}
    </ul>
  );
}
