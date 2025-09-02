import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

function classes(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export default function Drawer({
  open,
  onClose,
  title = "Menu",
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstFocusable = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (active === last && !e.shiftKey) {
          e.preventDefault();
          first.focus();
        } else if (active === first && e.shiftKey) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        firstFocusable.current?.focus();
      });
    }
  }, [open]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className={classes(
        "fixed inset-0 z-40",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <div
        onClick={onClose}
        className={classes(
          "absolute inset-0 bg-black/50 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={classes(
          "absolute inset-y-0 left-0 w-[86%] max-w-xs bg-zinc-950 border-r border-white/10 shadow-xl",
          "transition-transform will-change-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "flex flex-col"
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
          <h2 id="drawer-title" className="text-base font-semibold">
            {title}
          </h2>
          <button
            ref={firstFocusable}
            onClick={onClose}
            className="rounded-lg px-2 py-1 hover:bg-white/10"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="p-2 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              classes(
                "block rounded-lg px-3 py-2",
                isActive ? "bg-white/10 text-white" : "hover:bg-white/10"
              )
            }
            onClick={onClose}
          >
            Início
          </NavLink>

          <NavLink
            to="/today"
            className={({ isActive }) =>
              classes(
                "block rounded-lg px-3 py-2",
                isActive ? "bg-white/10 text-white" : "hover:bg-white/10"
              )
            }
            onClick={onClose}
          >
            Hoje
          </NavLink>

          <NavLink
            to="/week"
            className={({ isActive }) =>
              classes(
                "block rounded-lg px-3 py-2",
                isActive ? "bg-white/10 text-white" : "hover:bg-white/10"
              )
            }
            onClick={onClose}
          >
            Esta semana
          </NavLink>

          <hr className="my-2 border-white/10" />

          <NavLink
            to="/checklists"
            className="block rounded-lg px-3 py-2 hover:bg-white/10"
            onClick={onClose}
          >
            Checklists
          </NavLink>
          <NavLink
            to="/summaries"
            className="block rounded-lg px-3 py-2 hover:bg-white/10"
            onClick={onClose}
          >
            Sumários
          </NavLink>
          <NavLink
            to="/blocks"
            className="block rounded-lg px-3 py-2 hover:bg-white/10"
            onClick={onClose}
          >
            Bloqueios
          </NavLink>
          <NavLink
            to="/recurrences"
            className="block rounded-lg px-3 py-2 hover:bg-white/10"
            onClick={onClose}
          >
            Recorrências de hoje
          </NavLink>
        </nav>

        {children}
      </div>
    </div>
  );
}
