import React from "react";
import type { WeekFilters } from "../../features/tasks/week/useWeekTasks";
import type { Task } from "../../domain/types";
import { todayBucket } from "../../domain/dateUtils";

interface Props {
  value: WeekFilters;
  onChange: (next: WeekFilters) => void;
}

const ALL = "all" as const;

const STATUS_CHOICES: Task["status"][] = [
  "todo",
  "in_progress",
  "blocked",
  "done",
];

function toggleStatus(
  current: WeekFilters["status"],
  s: Task["status"]
): Task["status"][] | typeof ALL {
  if (current === ALL) return [s];
  const set = new Set(current ?? []);
  if (set.has(s)) {
    set.delete(s);
  } else {
    set.add(s);
  }
  const arr = Array.from(set);
  return arr.length === 0 ? ALL : arr;
}

export function WeekToolbar({ value, onChange }: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, search: e.target.value });
  };

  const handleDay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === "today" ? todayBucket() : ALL;
    onChange({ ...value, day: val });
  };

  const handleStatusClick = (s: Task["status"]) => {
    onChange({ ...value, status: toggleStatus(value.status ?? ALL, s) });
  };

  const handleCarried = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, carriedOver: e.target.checked ? true : ALL });
  };

  const isStatusActive = (s: Task["status"]) =>
    value.status !== ALL &&
    Array.isArray(value.status) &&
    value.status.includes(s);

  return (
    <div className="flex flex-col gap-3 mb-4">
      <input
        type="search"
        inputMode="search"
        placeholder="Search tasks…"
        className="w-full rounded border px-3 py-2"
        value={value.search ?? ""}
        onChange={handleSearch}
        aria-label="Search tasks"
      />

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm">
          <span className="mr-2">Day</span>
          <select
            className="rounded border px-2 py-1"
            value={value.day === ALL ? "all" : "today"}
            onChange={handleDay}
            aria-label="Filter by day"
          >
            <option value="today">Today</option>
            <option value="all">All</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value.carriedOver === true}
            onChange={handleCarried}
            aria-pressed={value.carriedOver === true}
          />
          Carried over
        </label>

        <div className="flex items-center gap-2">
          {STATUS_CHOICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusClick(s)}
              className={[
                "px-3 py-1 rounded-full border text-sm",
                isStatusActive(s)
                  ? "bg-black text-white"
                  : "bg-gray-400 text-black",
              ].join(" ")}
              aria-pressed={isStatusActive(s)}
            >
              {s.replace("_", " ")}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, status: ALL })}
            className="px-2 py-1 text-xs underline"
            aria-label="Clear status filter"
          >
            Clear status
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeekToolbar;
