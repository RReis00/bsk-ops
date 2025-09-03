import { useState } from "react";
import { useTodayTasks, type TodayFilters } from "./useTodayTasks";
import type { Task } from "../../../domain/types";
import {
  toggleTaskDone,
  deleteTask,
  blockTask,
  unblockTask,
} from "../taskActions";

/* ---------- Dialog para motivo de bloqueio ---------- */
function BlockDialog({
  initialReason,
  onCancel,
  onSave,
}: {
  initialReason?: string;
  onCancel: () => void;
  onSave: (reason: string) => void;
}) {
  const [reason, setReason] = useState<string>(initialReason ?? "");
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-4">
        <h3 className="text-lg font-semibold">Bloquear tarefa</h3>
        <p className="mt-1 text-sm opacity-80">
          (Opcional) descreve rapidamente o motivo do bloqueio.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 p-2 outline-none"
          placeholder="Ex.: Aguardando resposta do cliente…"
          aria-label="Motivo de bloqueio"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave(reason)}
            className="rounded-lg border border-yellow-500/40 bg-yellow-500/20 px-3 py-1.5 text-sm text-yellow-100 hover:bg-yellow-500/30"
          >
            Bloquear
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Botão de ícone discreto ---------- */
function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-lg border border-white/10 bg-white/0 px-2 py-1 text-sm",
        "hover:bg-white/10 focus:bg-white/10 transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------- Pílula de estado ---------- */
function StatusPill({ task }: { task: Task }) {
  const base = "rounded-full px-2 py-0.5 text-xs";
  if (task.status === "done")
    return (
      <span className={`${base} bg-emerald-600/25 text-emerald-200`}>done</span>
    );
  if (task.status === "blocked")
    return (
      <span className={`${base} bg-yellow-600/25 text-yellow-100`}>
        blocked
      </span>
    );
  return <span className={`${base} bg-white/10 text-white/80`}>todo</span>;
}

/* ---------- Linha da tarefa ---------- */
function Row({ task }: { task: Task }) {
  const [isBusy, setIsBusy] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

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
  async function onUnblock() {
    try {
      setIsBusy(true);
      await unblockTask(task.id);
    } finally {
      setIsBusy(false);
    }
  }

  // Wrappers síncronos para satisfazer no-misused-promises
  function handleToggleDoneClick() {
    void onToggleDone();
  }
  function handleDeleteClick() {
    void onDelete();
  }
  function handleBlockClick() {
    setShowBlock(true);
  }
  function handleUnblockClick() {
    void onUnblock();
  }

  return (
    <li className="group rounded-xl border border-white/10 p-3">
      {/* Linha principal: título + ações à direita */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold leading-snug break-words">
            {task.title}
          </p>
          {task.description ? (
            <p className="mt-0.5 text-sm opacity-75 whitespace-pre-line">
              {task.description}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <IconBtn
            label={
              task.status === "done"
                ? "Desmarcar concluída"
                : "Marcar concluída"
            }
            onClick={handleToggleDoneClick}
            disabled={isBusy}
          >
            {task.status === "done" ? "↩" : "✓"}
          </IconBtn>

          {task.status === "blocked" ? (
            <IconBtn
              label="Desbloquear"
              onClick={handleUnblockClick}
              disabled={isBusy}
            >
              ▶
            </IconBtn>
          ) : (
            <IconBtn
              label="Bloquear"
              onClick={handleBlockClick}
              disabled={isBusy}
            >
              ⏸
            </IconBtn>
          )}

          <IconBtn
            label="Eliminar"
            onClick={handleDeleteClick}
            disabled={isBusy}
          >
            🗑
          </IconBtn>
        </div>
      </div>

      {/* Linha secundária: due + estado + motivo */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs opacity-80">
        {task.dueAt ? (
          <span className="rounded-md border border-white/10 px-2 py-0.5">
            Due: {new Date(task.dueAt).toLocaleTimeString()}
          </span>
        ) : null}
        <StatusPill task={task} />
        {task.status === "blocked" && task.blockedReason ? (
          <span className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-yellow-100/90">
            {task.blockedReason}
          </span>
        ) : null}
      </div>

      {showBlock ? (
        <BlockDialog
          initialReason={task.blockedReason}
          onCancel={() => setShowBlock(false)}
          onSave={(reason: string) => {
            setShowBlock(false);
            setIsBusy(true);
            void (async () => {
              try {
                await blockTask(task.id, reason);
              } finally {
                setIsBusy(false);
              }
            })();
          }}
        />
      ) : null}
    </li>
  );
}

/* ---------- Lista de Hoje ---------- */
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
