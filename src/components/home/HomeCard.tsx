import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface HomeCardProps {
  to: string;
  icon?: ReactNode;
  title: string;
  description?: string;
}

export default function HomeCard({ to, icon, title, description }: HomeCardProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group block w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4",
          "shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          isActive && "ring-1 ring-white/20",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <div className="flex items-start gap-3">
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg"
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{title}</h3>
          {description && <p className="mt-1 line-clamp-2 text-sm opacity-80">{description}</p>}
        </div>
      </div>
    </NavLink>
  );
}
