"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Stethoscope,
  LogOut,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/doctor/dashboard", label: "Patients", icon: Users },
];

export default function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/doctor/login");
  };

  const userInitial =
    user?.displayName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "D";

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[68px] flex-col items-center py-6 z-50 glass-strong border-r border-maroon-100/30">
        {/* Logo */}
        <Link href="/doctor/dashboard" className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center shadow-lg relative">
            <Stethoscope size={18} className="text-white" />
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
                      layoutId="doctor-sidebar-indicator"
                      className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-maroon-700 rounded-l-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* User avatar + Logout */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-maroon-100 to-maroon-200 flex items-center justify-center text-maroon-700 font-bold text-sm border-2 border-white shadow-sm"
            title={user?.displayName || user?.email || "Doctor"}
          >
            {userInitial}
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut size={16} />
          </button>
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
                    isActive ? "text-maroon-700" : "text-slate-400"
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
          <button onClick={handleLogout}>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-slate-400">
              <LogOut size={20} strokeWidth={1.8} />
              <span className="text-[10px] font-medium">Logout</span>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}
