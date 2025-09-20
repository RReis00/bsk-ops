import type { WeekTask } from "../../features/tasks/week/useWeekTasks";
import WeekItem from "./WeekItem";

interface Props {
  tasks: WeekTask[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onMoveSelectedToToday: () => Promise<void>;   // ← promete
  onMoveOneToToday: (id: string) => Promise<void>; // ← promete
}

export default function WeekList({
  tasks,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onMoveSelectedToToday,
  onMoveOneToToday,
}: Props) {
  const allSelected = tasks.length > 0 && selectedIds.size === tasks.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAll}
            aria-checked={allSelected}
            aria-label="Select all tasks in list"
          />
          <span>
            {selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `${tasks.length} tasks`}
          </span>
          {someSelected && <span className="text-xs opacity-60">(partial)</span>}
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 border rounded text-sm"
            onClick={() => { void onMoveSelectedToToday(); }}  // ← wrap com void
            disabled={selectedIds.size === 0}
            aria-disabled={selectedIds.size === 0}
            title="Send selected to Today"
          >
            Send to Today
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <WeekItem
            key={t.id}
            task={t}
            selected={selectedIds.has(t.id)}
            onToggleSelect={onToggleSelect}
            onMoveToToday={onMoveOneToToday}
          />
        ))}
      </ul>
    </div>
  );
}
