"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Dumbbell,
  Library,
  Settings,
  LogOut,
  Trophy,
} from "lucide-react";
import NotificationPanel from "@/components/ui/NotificationPanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/library", label: "Library", icon: Library },
  { href: "/leaderboard", label: "Rankings", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[68px] flex-col items-center py-6 z-50 glass-strong border-r border-slate-100">
        {/* Logo */}
        <Link href="/dashboard" className="mb-8 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center shadow-lg shadow-maroon-700/20 group-hover:shadow-xl group-hover:shadow-maroon-700/30 transition-shadow">
            <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>R</span>
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <div className="flex-1 flex flex-col items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link href={item.href} key={item.href} title={item.label}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-maroon-700 text-white shadow-lg shadow-maroon-700/25"
                      : "text-slate-400 dark:text-slate-400 hover:bg-maroon-50 dark:hover:bg-slate-800 hover:text-maroon-700 dark:hover:text-maroon-400"
                  }`}
                >
                  <item.icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-maroon-700 rounded-l-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3 mt-4 mb-2">
          <ThemeToggle />
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-maroon-100 to-maroon-200 dark:from-maroon-800 dark:to-maroon-900 flex items-center justify-center text-maroon-700 dark:text-maroon-100 font-bold text-sm border-2 border-white dark:border-slate-800 shadow-sm"
            title={user?.displayName || user?.email || "User"}
          >
            {userInitial}
          </div>
          <NotificationPanel />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            title="Log out"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-colors"
          >
            <LogOut size={16} />
          </motion.button>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-slate-100 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link href={item.href} key={item.href}>
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                    isActive
                      ? "text-maroon-700 dark:text-maroon-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-indicator"
                      className="absolute -top-[1px] w-8 h-[3px] bg-maroon-700 rounded-b-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
