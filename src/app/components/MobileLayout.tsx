import { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { DashboardIcon } from "@/imports/dashboard-icon";
import { FilamentIcon } from "@/imports/filament-icon";
import { PartsIcon } from "@/imports/parts-icon";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/filaments", label: "Filaments", icon: FilamentIcon },
    { path: "/parts", label: "Parts", icon: PartsIcon },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content - top padding keeps title below status bar */}
      <main
        className="flex-1 overflow-y-auto pb-20"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        {children}
      </main>

      {/* Bottom Navigation - safe area above home indicator */}
      <nav
        className="fixed left-0 right-0 bg-background border-t border-border"
        style={{
          bottom: 0,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === "/filaments" && location.pathname.startsWith("/filaments"));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive
                    ? "text-orange-500"
                    : "text-muted-foreground"
                }`}
              >
                <Icon />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}