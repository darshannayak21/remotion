"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = false,
  onClick,
  glow = false,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, scale: 1.008 } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onClick={onClick}
      className={`glass rounded-2xl p-5 card-hover-lift ${
        hover ? "cursor-pointer" : ""
      } ${onClick ? "cursor-pointer" : ""} ${
        glow ? "ring-1 ring-maroon-200/30 shadow-lg shadow-maroon-500/5" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
