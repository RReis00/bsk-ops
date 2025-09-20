import React from "react";
import { startOfWeek, todayBucket } from "../domain/dateUtils";
import {
  useWeekTasks,
  type WeekFilters,
} from "../features/tasks/week/useWeekTasks";
import WeekToolbar from "../components/week/WeekToolbar";
import WeekList from "../components/week/WeekList";
import {
  moveTaskToToday,
  moveTasksToToday,
} from "../features/tasks/week/weekActions";

export default function WeekPage() {
  const [filters, setFilters] = React.useState<WeekFilters>({
    search: "",
    day: "all",
    status: "all",
    carriedOver: "all",
  });

  const [debouncedFilters, setDebouncedFilters] =
    React.useState<WeekFilters>(filters);
  React.useEffect(() => {
    const id = setTimeout(() => {
      const trimmed = filters.search?.trim();
      setDebouncedFilters({
        ...filters,
        search: trimmed && trimmed.length > 0 ? trimmed : "",
      });
    }, 250);
    return () => clearTimeout(id);
  }, [filters]);

  const weekStart = startOfWeek();
  const normalizedFilters: WeekFilters =
    debouncedFilters.day === "all"
      ? debouncedFilters
      : { ...debouncedFilters, day: todayBucket() };

  const { tasks, isLoading, count } = useWeekTasks(
    weekStart,
    normalizedFilters
  );

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [count]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === tasks.length) return new Set();
      return new Set(tasks.map((t) => t.id));
    });
  };

  const onMoveSelectedToToday = async () => {
    await moveTasksToToday(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const onMoveOneToToday = async (id: string) => {
    await moveTaskToToday(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">This Week</h1>

      <WeekToolbar value={filters} onChange={setFilters} />

      {isLoading && <p>Loading...</p>}
      {!isLoading && count === 0 && <p>No tasks for these filters.</p>}

      {!isLoading && count > 0 && (
        <WeekList
          tasks={tasks}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onMoveSelectedToToday={onMoveSelectedToToday}
          onMoveOneToToday={onMoveOneToToday}
        />
      )}
    </div>
  );
}
