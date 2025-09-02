import { NavLink, useLocation, useNavigate } from "react-router-dom";

type TabKey = "today" | "week";

function classes(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function pathFor(key: TabKey) {
  return key === "today" ? "/today" : "/week";
}

export default function BottomTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const isWeek = location.pathname === "/week";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const order: TabKey[] = ["today", "week"];
    const current: TabKey = isWeek ? "week" : "today";
    const idx = order.indexOf(current);
    const next =
      e.key === "ArrowRight"
        ? order[(idx + 1) % order.length]
        : order[(idx - 1 + order.length) % order.length];

    void navigate(pathFor(next));
  };

  return (
    <div
      role="tablist"
      aria-label="Navegação principal"
      onKeyDown={handleKeyDown}
      className={classes(
        "fixed inset-x-0 bottom-0 z-20",
        "border-t border-white/10 bg-black/80 backdrop-blur",
        "px-3 py-2"
      )}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <NavLink
          to="/today"
          role="tab"
          className={({ isActive }) =>
            classes(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm",
              isActive
                ? "bg-white/10 text-white"
                : "text-white/80 hover:bg-white/5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            )
          }
        >
          <span aria-hidden="true">📅</span>
          <span>Hoje</span>
        </NavLink>

        <NavLink
          to="/week"
          role="tab"
          className={({ isActive }) =>
            classes(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm",
              isActive
                ? "bg-white/10 text-white"
                : "text-white/80 hover:bg-white/5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            )
          }
        >
          <span aria-hidden="true">🗓️</span>
          <span>Esta semana</span>
        </NavLink>
      </div>

      <div
        aria-hidden="true"
        className="h-[max(env(safe-area-inset-bottom),0px)]"
      />
    </div>
  );
}
