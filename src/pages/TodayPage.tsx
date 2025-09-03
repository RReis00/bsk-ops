// src/pages/TodayPage.tsx
import { useState } from "react";
import FilterChips from "../features/tasks/today/FilterChips";
import TodayList from "../features/tasks/today/TodayList";
import type { TodayFilters } from "../features/tasks/today/useTodayTasks";

export default function TodayPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TodayFilters>({ onlyPending: true });

  return (
    <section className="mx-auto max-w-2xl px-4 py-4">
      <h2 className="text-xl font-semibold">Hoje</h2>
      <p className="opacity-80">Tarefas, checklists e recorrências do dia.</p>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar…"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none placeholder:opacity-60 focus:border-white/20"
          aria-label="Pesquisar tarefas de hoje"
        />
      </div>

      <div className="mt-3">
        <FilterChips filters={filters} onChange={setFilters} />
      </div>

      <TodayList search={search} filters={filters} />
    </section>
  );
}
