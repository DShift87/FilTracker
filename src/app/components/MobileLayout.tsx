import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { DashboardIcon } from "@/imports/dashboard-icon";
import { FilamentIcon } from "@/imports/filament-icon";
import { PartsIcon } from "@/imports/parts-icon";
import { useAddAction } from "@/app/context/AddActionContext";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { triggerAdd } = useAddAction();
  const [addChoiceOpen, setAddChoiceOpen] = useState(false);
  const [menuAnimationDone, setMenuAnimationDone] = useState(false);
  const [iconsReady, setIconsReady] = useState(false);

  const isDashboard = location.pathname === "/";

  // Delay icon render until after scale animation to avoid SVG rendering glitches
  useEffect(() => {
    if (isDashboard && addChoiceOpen) {
      const t = setTimeout(() => setIconsReady(true), 350);
      return () => clearTimeout(t);
    } else {
      setIconsReady(false);
    }
  }, [isDashboard, addChoiceOpen]);

  const handleFabClick = () => {
    if (isDashboard) {
      setAddChoiceOpen((o) => {
        if (o) setMenuAnimationDone(false);
        return !o;
      });
    } else {
      triggerAdd();
    }
  };

  const handleCreateFilament = () => {
    setAddChoiceOpen(false);
    navigate("/filaments", { state: { openAdd: true } });
  };

  const handleCreatePart = () => {
    setAddChoiceOpen(false);
    navigate("/parts", { state: { openAdd: true } });
  };

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

      {/* Bottom Navigation - matches content width (max-w-md mx-auto p-4) */}
      <nav
        className="fixed left-0 right-0 z-50 flex justify-center items-end w-full"
        style={{
          bottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="content-stretch flex gap-[9px] items-center pt-[16px] pb-0 w-full max-w-md mx-auto px-4 min-w-0">
          {/* Nav pill - 3 items only, fills available space */}
          <div className="bg-white content-stretch flex gap-[8px] items-center p-[4px] rounded-[999px] flex-1 min-w-0 shadow-[0_-4px_20px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] relative">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/filaments" && location.pathname.startsWith("/filaments"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center justify-center gap-1 flex-1 min-w-0 py-2 px-1 rounded-full transition-colors ${
                    isActive
                      ? "text-[#F26D00]"
                      : "text-[#7A7A7A] hover:text-gray-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full z-0 bg-orange-100"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-[1] flex flex-col items-center gap-1">
                    <Icon active={isActive} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          {/* FAB + add menu (Dashboard only) */}
          <div className="relative shrink-0">
            <AnimatePresence>
              {isDashboard && addChoiceOpen && (
                <motion.div
                  key="add-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col-reverse gap-[12px] items-center mb-6 z-10"
                >
                  <motion.div
                    className={`relative flex justify-center items-center origin-bottom ${menuAnimationDone ? "z-10" : ""}`}
                    initial={{ opacity: 0, scale: 0, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 8 }}
                    onAnimationComplete={() => setMenuAnimationDone(true)}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                      delay: 0.05,
                    }}
                  >
                    <p className="absolute right-full mr-3 top-1/2 -translate-y-1/2 font-medium leading-normal text-[#7a7a7a] text-[12px] whitespace-nowrap">Part</p>
                    <button
                      type="button"
                      onClick={handleCreatePart}
                      className="bg-white flex flex-col items-center justify-center p-[4px] rounded-[9999px] shrink-0 size-[40px] shadow-[0_-4px_20px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors active:scale-95 relative z-[1]"
                    >
                      {iconsReady ? (
                        <PartsIcon active className="h-5 w-5 text-[#F26D00] animate-in fade-in duration-150" />
                      ) : (
                        <span className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </motion.div>
                  <motion.div
                    className={`relative flex justify-center items-center origin-bottom ${menuAnimationDone ? "z-20" : ""}`}
                    initial={{ opacity: 0, scale: 0, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 8 }}
                    onAnimationComplete={() => setMenuAnimationDone(true)}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                      delay: 0.1,
                    }}
                  >
                    <p className="absolute right-full mr-3 top-1/2 -translate-y-1/2 font-medium leading-normal text-[#7a7a7a] text-[12px] whitespace-nowrap">Filament</p>
                    <button
                      type="button"
                      onClick={handleCreateFilament}
                      className="bg-white flex flex-col items-center justify-center p-[4px] rounded-[9999px] shrink-0 size-[40px] shadow-[0_-4px_20px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors active:scale-95 relative z-[1]"
                    >
                      {iconsReady ? (
                        <FilamentIcon active className="h-5 w-5 text-[#F26D00] animate-in fade-in duration-150" />
                      ) : (
                        <span className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={handleFabClick}
              aria-label={addChoiceOpen ? "Close" : "Add"}
              className={`content-stretch flex flex-col items-center justify-center p-[4px] rounded-[9999px] shrink-0 size-[64px] transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] active:scale-95 ${
                isDashboard && addChoiceOpen
                  ? "bg-white hover:bg-gray-50"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-6 h-6 transition-transform duration-200 ${
                  isDashboard && addChoiceOpen ? "rotate-45 text-[#F26D00]" : ""
                }`}
              >
                <path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" />
                <path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}