import type { WeekTask } from "../../features/tasks/week/useWeekTasks";

interface Props {
  task: WeekTask;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onMoveToToday: (id: string) => Promise<void>; // ← promete (vamos “void” no onClick)
}

export default function WeekItem({ task, selected, onToggleSelect, onMoveToToday }: Props) {
  return (
    <li className="border rounded px-3 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(task.id)}
          aria-label={`Select ${task.title}`}
        />
        <div className="min-w-0">
          <div className="font-medium truncate">{task.title}</div>
          <div className="text-xs opacity-70 flex items-center gap-2">
            <span>{task.status.replace("_", " ")}</span>
            <span>•</span>
            <span>{new Date(task._derived.dayBucket).toLocaleDateString()}</span>
            {task._derived.carriedOver && (
              <>
                <span>•</span>
                <span className="text-orange-600">carried over</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { void onMoveToToday(task.id); }}  // ← evita no-misused-promises
          className="px-2 py-1 text-sm border rounded"
          aria-label="Send to Today"
          title="Send to Today"
        >
          ➜ Today
        </button>
      </div>
    </li>
  );
}
