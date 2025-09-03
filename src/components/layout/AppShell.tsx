import { Outlet } from "react-router-dom";
import { useId, useRef, useState, useCallback, useEffect } from "react";
import OnlineBadge from "./OnlineBadge";
import Drawer from "./Drawer";
import { useLockScroll } from "../../hooks/useLockScroll";
import BottomBarNav from "../navigation/BottomBarNav";

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerId = useId();
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useLockScroll(menuOpen);

  useEffect(() => {
    if (!menuOpen) {
      queueMicrotask(() => menuBtnRef.current?.focus());
    }
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            ref={menuBtnRef}
            type="button"
            aria-label="Abrir menu"
            aria-controls={drawerId}
            aria-expanded={menuOpen}
            className="rounded-xl px-2 py-1 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            onClick={openMenu}
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold tracking-tight">BSK Ops</h1>
        </div>
        <OnlineBadge />
      </header>

      <main className="px-4 py-4 pb-24">
        <Outlet />
      </main>

      <Drawer
        id={drawerId}
        open={menuOpen}
        onClose={closeMenu}
        returnFocusRef={menuBtnRef}
      />

      <BottomBarNav />
    </div>
  );
}
