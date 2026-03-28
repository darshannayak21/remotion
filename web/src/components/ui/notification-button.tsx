"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationButtonProps {
  count?: number;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  sm: { button: "w-9 h-9",  icon: "w-4 h-4", badge: "text-[9px] h-4 min-w-[16px]" },
  md: { button: "w-11 h-11", icon: "w-5 h-5", badge: "text-[10px] h-[18px] min-w-[18px]" },
  lg: { button: "w-12 h-12", icon: "w-6 h-6", badge: "text-[10px] h-5 min-w-[20px]" },
};

export function NotificationButton({
  count,
  icon,
  size = "md",
  className,
  onClick,
}: NotificationButtonProps) {
  const s = sizeConfig[size];
  const hasNotifications = count !== undefined && count > 0;

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl transition-all duration-200",
        "bg-white/60 dark:bg-slate-800/40 backdrop-blur-md",
        "border border-slate-200/60 dark:border-slate-700/40",
        "text-slate-600 dark:text-slate-300",
        "hover:bg-white dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600",
        "hover:shadow-lg hover:shadow-maroon-900/5 dark:hover:shadow-black/20",
        "focus:outline-none focus:ring-2 focus:ring-maroon-400/30 dark:focus:ring-maroon-500/20",
        s.button,
        className
      )}
    >
      {/* Icon */}
      <span className={cn("transition-colors", hasNotifications && "text-maroon-700 dark:text-maroon-400")}>
        {icon ?? <Bell className={cn(s.icon)} />}
      </span>

      {/* Animated Badge */}
      <AnimatePresence>
        {hasNotifications && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={cn(
              "absolute -top-1 -right-1 flex items-center justify-center rounded-full px-1 font-bold",
              "bg-gradient-to-br from-maroon-600 to-rose-600 text-white",
              "shadow-sm shadow-maroon-600/30",
              "ring-2 ring-white dark:ring-slate-900",
              s.badge
            )}
          >
            {count! > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ping animation for new notifications */}
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px]">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-maroon-400 opacity-40" />
        </span>
      )}
    </motion.button>
  );
}

export default NotificationButton;
