import { Outlet } from "react-router-dom";
import { useState, useCallback } from "react";
import OnlineBadge from "./OnlineBadge";
import Drawer from "./Drawer";
import { useLockScroll } from "../../hooks/useLockScroll";
import BottomTabs from "../navigation/BottomTabs";

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useLockScroll(menuOpen);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Menu"
            className="rounded-xl px-2 py-1 hover:bg-white/10"
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

      <Drawer open={menuOpen} onClose={closeMenu} />
      <BottomTabs />
    </div>
  );
}
