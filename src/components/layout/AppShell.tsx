import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { History, Route as RouteIcon, Truck } from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { to: "/", label: "Plan Trip", icon: RouteIcon },
  { to: "/history", label: "History", icon: History },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="relative min-h-dvh font-body">
      <div className="app-atmosphere" />

      <header className="sticky top-0 z-20 border-b border-ink-700/60 bg-ink-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 text-ink-950 shadow-glow transition-transform duration-200 group-hover:scale-105">
              <Truck className="size-5" aria-hidden />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-wide text-ink-50">CONVOY</span>
              <span className="block text-[10px] font-medium tracking-[0.2em] text-teal-400 uppercase">
                HOS Trip Planner
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 rounded-xl border border-ink-700 bg-ink-800/50 p-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-teal-500/15 text-teal-300 shadow-[inset_0_0_0_1px_rgba(22,186,189,0.3)]"
                      : "text-ink-300 hover:bg-ink-700/60 hover:text-ink-50"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
