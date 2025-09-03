import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

interface DrawerProps {
  id?: string;
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

function classes(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export default function Drawer({
  id,
  open,
  onClose,
  title = "Menu",
  children,
  returnFocusRef,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current =
        (document.activeElement as HTMLElement) ?? null;
      queueMicrotask(() => closeBtnRef.current?.focus());
    } else {
      const target = returnFocusRef?.current ?? previouslyFocused.current;
      queueMicrotask(() => target?.focus());
    }
  }, [open, returnFocusRef]);

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

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className={classes(
        "fixed inset-0 z-40",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar menu"
        className={classes(
          "absolute inset-0 bg-black/50 motion-safe:transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        ref={panelRef}
        className={classes(
          "absolute inset-y-0 left-0 w-[86%] max-w-xs bg-zinc-950 border-r border-white/10 shadow-xl",
          "motion-safe:transition-transform will-change-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "flex flex-col"
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
          <h2 id="drawer-title" className="text-base font-semibold">
            {title}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="rounded-lg px-2 py-1 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="p-2 text-sm">
          <NavLinkItem to="/" onClose={onClose}>
            Início
          </NavLinkItem>
          <NavLinkItem to="/today" onClose={onClose}>
            Hoje
          </NavLinkItem>
          <NavLinkItem to="/week" onClose={onClose}>
            Esta semana
          </NavLinkItem>

          <hr className="my-2 border-white/10" />

          <NavLinkItem to="/checklists" onClose={onClose}>
            Checklists
          </NavLinkItem>
          <NavLinkItem to="/summaries" onClose={onClose}>
            Sumários
          </NavLinkItem>
          <NavLinkItem to="/blocks" onClose={onClose}>
            Bloqueios
          </NavLinkItem>
          <NavLinkItem to="/recurrences" onClose={onClose}>
            Recorrências de hoje
          </NavLinkItem>
        </nav>

        {children}
      </div>
    </div>
  );
}

function NavLinkItem({
  to,
  children,
  onClose,
}: {
  to: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classes(
          "block rounded-lg px-3 py-2",
          isActive
            ? "bg-white/10 text-white"
            : "hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        )
      }
      onClick={onClose}
    >
      {children}
    </NavLink>
  );
}
