import { NavLink, useLocation, useNavigate } from "react-router-dom";

function classes(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

type Path = "/today" | "/week";
const ORDER: Path[] = ["/today", "/week"];

function isPath(p: string): p is Path {
  return p === "/today" || p === "/week";
}

export default function BottomBarNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const current: Path = isPath(location.pathname)
    ? location.pathname
    : "/today";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    const idx = ORDER.indexOf(current);
    const next =
      e.key === "ArrowRight"
        ? ORDER[(idx + 1) % ORDER.length]
        : ORDER[(idx - 1 + ORDER.length) % ORDER.length];

    void navigate(next);
  };

  return (
    <nav
      aria-label="Navegação principal"
      onKeyDown={handleKeyDown}
      className={classes(
        "fixed inset-x-0 bottom-0 z-20",
        "border-t border-white/10 bg-black/80 backdrop-blur",
        "px-3 py-2"
      )}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <NavItem to="/today" icon="📅" label="Hoje" />
        <NavItem to="/week" icon="🗓️" label="Esta semana" />
      </div>
      <div
        aria-hidden="true"
        className="h-[max(env(safe-area-inset-bottom),0px)]"
      />
    </nav>
  );
}

function NavItem({
  to,
  icon,
  label,
}: {
  to: Path;
  icon: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
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
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
