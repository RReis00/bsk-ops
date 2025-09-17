import { useState } from "react";
import { useTodayTasks, type TodayFilters } from "./useTodayTasks";
import { markTasksDone, endDay } from "../summaryActions";

export default function TodayToolbar({
  search,
  filters,
}: {
  search: string;
  filters: TodayFilters;
}) {
  const { tasks, isLoading } = useTodayTasks(search, filters);
  const [busy, setBusy] = useState(false);
  const [showEndDay, setShowEndDay] = useState(false);
  const [note, setNote] = useState("");
  const [alsoMarkPending, setAlsoMarkPending] = useState(false);

  const visibleIds = tasks.filter((t) => t.status !== "done").map((t) => t.id);

  function handleMarkAllDone() {
    if (busy || isLoading || visibleIds.length === 0) return;
    setBusy(true);
    void (async () => {
      try {
        await markTasksDone(visibleIds);
      } finally {
        setBusy(false);
      }
    })();
  }

  function handleOpenEndDay() {
    setShowEndDay(true);
  }

  function handleConfirmEndDay() {
    if (busy) return;
    setBusy(true);
    void (async () => {
      try {
        await endDay({ note, markPendingAsDone: alsoMarkPending });
        setNote("");
        setAlsoMarkPending(false);
        setShowEndDay(false);
      } finally {
        setBusy(false);
      }
    })();
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleMarkAllDone}
          disabled={busy || isLoading || visibleIds.length === 0}
          className="rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-50 hover:bg-emerald-500/30 disabled:opacity-50"
        >
          ✓ Marcar tudo feito
        </button>

        <button
          type="button"
          onClick={handleOpenEndDay}
          disabled={busy || isLoading}
          className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-3 py-1.5 text-sm text-blue-50 hover:bg-blue-500/30 disabled:opacity-50"
        >
          🌙 Acabar dia
        </button>
      </div>

      {showEndDay ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-4">
            <h3 className="text-lg font-semibold">Fechar o dia</h3>
            <p className="mt-1 text-sm opacity-80">
              (Opcional) adiciona uma nota ao resumo de hoje.
            </p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 p-2 outline-none"
              placeholder="Notas do dia…"
              aria-label="Nota do resumo"
            />

            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-500"
                checked={alsoMarkPending}
                onChange={(e) => setAlsoMarkPending(e.target.checked)}
              />
              Marcar pendentes como <span className="font-medium">done</span>
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEndDay(false)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmEndDay}
                disabled={busy}
                className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-3 py-1.5 text-sm text-blue-50 hover:bg-blue-500/30 disabled:opacity-50"
              >
                Fechar dia
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
