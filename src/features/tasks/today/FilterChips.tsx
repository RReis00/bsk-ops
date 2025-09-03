import type { TodayFilters } from "./useTodayTasks";

interface Props {
  filters: TodayFilters;
  onChange: (next: TodayFilters) => void;
}

function Chip({
  active,
  label,
  onClick,
  disabled,
}: {
  active: boolean;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-full border px-3 py-1 text-sm transition",
        active
          ? "bg-white text-black border-white"
          : "border-white/30 text-white/90",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function FilterChips({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        label="Only pending"
        active={filters.onlyPending}
        onClick={() =>
          onChange({ ...filters, onlyPending: !filters.onlyPending })
        }
      />
      <Chip
        label="With time"
        active={!!filters.withTime}
        onClick={() => onChange({ ...filters, withTime: !filters.withTime })}
      />
      <Chip
        label="Blocked"
        active={!!filters.blocked}
        onClick={() => onChange({ ...filters, blocked: !filters.blocked })}
      />
      <Chip
        label="With attachments"
        active={!!filters.withAttachments}
        onClick={() =>
          onChange({ ...filters, withAttachments: !filters.withAttachments })
        }
      />
    </div>
  );
}
