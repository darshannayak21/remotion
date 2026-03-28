"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: ReactNode;
  color?: string;
  decimals?: number;
}

export default function StatCard({
  label,
  value,
  suffix = "",
  icon,
  color = "text-maroon-700",
  decimals = 0,
}: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3.5 min-w-0">
      {icon && (
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color
            .replace("text-", "bg-")
            .replace("700", "50")}`}
        >
          <span className={color}>{icon}</span>
        </div>
      )}
      <div className="min-w-0">
        <div className={`text-2xl font-bold tracking-tight ${color} flex items-baseline gap-0.5`}>
          <motion.span>{rounded}</motion.span>
          {suffix && <span className="text-sm font-medium opacity-70">{suffix}</span>}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}
