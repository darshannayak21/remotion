"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  Library,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/library", label: "Library", icon: Library },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[68px] flex-col items-center py-6 z-50 glass-strong border-r border-maroon-100/30">
        {/* Logo */}
        <Link href="/dashboard" className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm font-[var(--font-display)]">F</span>
          </div>
        </Link>

        <div className="flex-1 flex flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link href={item.href} key={item.href} title={item.label}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-maroon-700 text-white shadow-lg shadow-maroon-700/30"
                      : "text-slate-400 hover:bg-maroon-50 hover:text-maroon-700"
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
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
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-maroon-100/30 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link href={item.href} key={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                    isActive
                      ? "text-maroon-700"
                      : "text-slate-400"
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{item.label}</span>
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
