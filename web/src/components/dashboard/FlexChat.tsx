"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { Bot, Send, X, Sparkles, User, Loader2, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

/* ── Color Orb ── */
interface OrbProps {
  dimension?: string;
  className?: string;
  tones?: {
    base?: string;
    accent1?: string;
    accent2?: string;
    accent3?: string;
  };
  spinDuration?: number;
}

const ColorOrb: React.FC<OrbProps> = ({
  dimension = "192px",
  className,
  tones,
  spinDuration = 20,
}) => {
  const fallbackTones = {
    base: "oklch(95% 0.02 264.695)",
    accent1: "oklch(55% 0.18 15)",
    accent2: "oklch(65% 0.15 350)",
    accent3: "oklch(50% 0.20 25)",
  };

  const palette = { ...fallbackTones, ...tones };
  const dimValue = parseInt(dimension.replace("px", ""), 10);
  const blurStrength = dimValue < 50 ? Math.max(dimValue * 0.008, 1) : Math.max(dimValue * 0.015, 4);
  const contrastStrength = dimValue < 50 ? Math.max(dimValue * 0.004, 1.2) : Math.max(dimValue * 0.008, 1.5);
  const pixelDot = dimValue < 50 ? Math.max(dimValue * 0.004, 0.05) : Math.max(dimValue * 0.008, 0.1);
  const shadowRange = dimValue < 50 ? Math.max(dimValue * 0.004, 0.5) : Math.max(dimValue * 0.008, 2);
  const maskRadius = dimValue < 30 ? "0%" : dimValue < 50 ? "5%" : dimValue < 100 ? "15%" : "25%";
  const adjustedContrast = dimValue < 30 ? 1.1 : dimValue < 50 ? Math.max(contrastStrength * 1.2, 1.3) : contrastStrength;

  return (
    <div
      className={cn("color-orb", className)}
      style={{
        width: dimension,
        height: dimension,
        "--base": palette.base,
        "--accent1": palette.accent1,
        "--accent2": palette.accent2,
        "--accent3": palette.accent3,
        "--spin-duration": `${spinDuration}s`,
        "--blur": `${blurStrength}px`,
        "--contrast": adjustedContrast,
        "--dot": `${pixelDot}px`,
        "--shadow": `${shadowRange}px`,
        "--mask": maskRadius,
      } as React.CSSProperties}
    >
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        .color-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          transform: scale(1.1);
        }
        .color-orb::before,
        .color-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translateZ(0);
        }
        .color-orb::before {
          background:
            conic-gradient(from calc(var(--angle) * 2) at 25% 70%, var(--accent3), transparent 20% 80%, var(--accent3)),
            conic-gradient(from calc(var(--angle) * 2) at 45% 75%, var(--accent2), transparent 30% 60%, var(--accent2)),
            conic-gradient(from calc(var(--angle) * -3) at 80% 20%, var(--accent1), transparent 40% 60%, var(--accent1)),
            conic-gradient(from calc(var(--angle) * 2) at 15% 5%, var(--accent2), transparent 10% 90%, var(--accent2)),
            conic-gradient(from calc(var(--angle) * 1) at 20% 80%, var(--accent1), transparent 10% 90%, var(--accent1)),
            conic-gradient(from calc(var(--angle) * -2) at 85% 10%, var(--accent3), transparent 20% 80%, var(--accent3));
          box-shadow: inset var(--base) 0 0 var(--shadow) calc(var(--shadow) * 0.2);
          filter: blur(var(--blur)) contrast(var(--contrast));
          animation: spin var(--spin-duration) linear infinite;
        }
        .color-orb::after {
          background-image: radial-gradient(circle at center, var(--base) var(--dot), transparent var(--dot));
          background-size: calc(var(--dot) * 2) calc(var(--dot) * 2);
          backdrop-filter: blur(calc(var(--blur) * 2)) contrast(calc(var(--contrast) * 2));
          mix-blend-mode: overlay;
        }
        .color-orb[style*="--mask: 0%"]::after { mask-image: none; }
        .color-orb:not([style*="--mask: 0%"])::after { mask-image: radial-gradient(black var(--mask), transparent 75%); }
        @keyframes spin { to { --angle: 360deg; } }
        @media (prefers-reduced-motion: reduce) { .color-orb::before { animation: none; } }
      `}</style>
    </div>
  );
};

/* ── Types ── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 540;
const SPEED_FACTOR = 1;

const maroonTones = {
  base: "oklch(20% 0.02 15)",
  accent1: "oklch(45% 0.22 15)",
  accent2: "oklch(55% 0.18 350)",
  accent3: "oklch(40% 0.20 25)",
};

/* ── Main Component ── */
export default function FlexChat() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm **Flex**, your AI Physiotherapy Assistant. How can I help you today? 💪",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const triggerOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const triggerClose = useCallback(() => {
    setIsOpen(false);
    setIsExpanded(false);
    textareaRef.current?.blur();
  }, []);

  // Click outside to close
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && isOpen) {
        triggerClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, triggerClose]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── Collapsed Dock Bar (FAB) ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={triggerOpen}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl pl-4 pr-6 py-3 shadow-xl shadow-slate-900/8 dark:shadow-black/20 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          >
            <ColorOrb dimension="36px" tones={maroonTones} spinDuration={12} />
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 tracking-tight hidden sm:block">
              Ask Flex
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Expanded Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={wrapperRef}
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500 / SPEED_FACTOR, damping: 40, mass: 0.8 }}
            className={cx(
              "fixed z-50 flex flex-col overflow-hidden",
              "bg-white/70 dark:bg-[#0c1020]/80 backdrop-blur-2xl",
              "border border-white/60 dark:border-white/[0.06]",
              "shadow-2xl shadow-slate-900/15 dark:shadow-black/40",
              isExpanded
                ? "inset-4 sm:inset-10 rounded-3xl"
                : "bottom-6 right-6 rounded-2xl"
            )}
            style={isExpanded ? undefined : { width: PANEL_WIDTH, height: PANEL_HEIGHT, maxHeight: "85vh" }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/60 dark:border-white/[0.04] bg-white/30 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <ColorOrb dimension="28px" tones={maroonTones} spinDuration={15} />
                <div>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    Flex AI <Sparkles size={12} className="text-maroon-500" />
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">
                    Physio Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100/60 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                  onClick={triggerClose}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => {
                const isAI = message.role === "assistant";
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-start gap-2.5 ${isAI ? "" : "flex-row-reverse"}`}
                  >
                    <div
                      className={cx(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                        isAI
                          ? "bg-maroon-50 dark:bg-maroon-900/30 text-maroon-600 dark:text-maroon-400 border border-maroon-100 dark:border-maroon-800/40"
                          : "bg-slate-800 dark:bg-slate-700 text-white"
                      )}
                    >
                      {isAI ? <Bot size={13} /> : <User size={13} />}
                    </div>
                    <div
                      className={cx(
                        "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed prose prose-sm prose-p:leading-relaxed",
                        isAI
                          ? "bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100/80 dark:border-slate-700/40 text-slate-700 dark:text-slate-200 rounded-tl-sm"
                          : "bg-gradient-to-br from-maroon-700 to-maroon-800 text-white rounded-tr-sm prose-invert font-medium shadow-sm shadow-maroon-900/20"
                      )}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-maroon-50 dark:bg-maroon-900/30 text-maroon-600 dark:text-maroon-400 flex items-center justify-center shrink-0 border border-maroon-100 dark:border-maroon-800/40">
                    <Bot size={13} />
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-100/80 dark:border-slate-700/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-maroon-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-maroon-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-maroon-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* ── Input Area ── */}
            <div className="px-4 py-3 border-t border-slate-100/60 dark:border-white/[0.04] bg-white/20 dark:bg-white/[0.01] backdrop-blur-md shrink-0">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                      if (e.key === "Escape") triggerClose();
                    }}
                    placeholder="Ask Flex anything..."
                    className="w-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-maroon-400/20 dark:focus:ring-maroon-500/20 focus:border-maroon-300 dark:focus:border-maroon-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none max-h-28 min-h-[40px] custom-scrollbar transition-all"
                    rows={1}
                    spellCheck={false}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-700 to-maroon-800 text-white flex items-center justify-center hover:shadow-lg hover:shadow-maroon-700/20 disabled:opacity-40 disabled:hover:shadow-none transition-all"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-ml-0.5" />}
                </button>
              </form>
              <p className="text-[9px] text-slate-400/70 dark:text-slate-500/60 font-medium text-center mt-2">
                Flex can make mistakes. Verify important information.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
