"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, Sparkles, User, Loader2, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function FlexChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm **Flex**, your AI Physiotherapy Assistant. How can I help you with your recovery or exercises today? 💪",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Create chat history for context (last 5 messages)
      const chatHistory = [...messages, userMessage].slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting to my servers right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-white/80 backdrop-blur-xl border border-white/60 text-maroon-800 rounded-full pl-4 pr-5 py-3 shadow-xl shadow-maroon-900/10 flex items-center gap-2.5 transition-all hover:bg-white hover:shadow-2xl hover:shadow-maroon-900/20 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-maroon-500 to-rose-500 text-white shadow-inner">
          <MessageSquare size={16} className="ml-[-1px] mt-[-1px]" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
          </span>
        </div>
        <span className="font-bold text-sm tracking-tight hidden sm:block">Chat with Flex</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed z-50 overflow-hidden flex flex-col bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-maroon-900/15 ${
              isExpanded 
                ? "inset-4 sm:inset-10 rounded-3xl" 
                : "bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh] rounded-3xl"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border-b border-white/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-500 to-rose-500 text-white flex items-center justify-center shadow-inner shadow-white/20">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-slate-800 flex items-center gap-1.5">
                    Flex AI <Sparkles size={14} className="text-maroon-500" />
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Physio Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-xl hover:bg-white/60 hover:text-slate-700 transition-colors"
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-transparent">
              {messages.map((message) => {
                const isAI = message.role === "assistant";
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex items-start gap-3 ${isAI ? "" : "flex-row-reverse"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isAI ? "bg-gradient-to-br from-maroon-100 to-rose-100 text-maroon-700 border border-white" : "bg-slate-800 text-white"
                    }`}>
                      {isAI ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed prose prose-sm prose-p:leading-relaxed shadow-sm ${
                      isAI 
                        ? "bg-white/80 backdrop-blur-md border border-white text-slate-700 rounded-tl-none" 
                        : "bg-gradient-to-br from-maroon-600 to-rose-600 text-white rounded-tr-none prose-invert font-medium"
                    }`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </motion.div>
                );
              })}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-4 shadow-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-maroon-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-maroon-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-maroon-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/60 shrink-0">
              <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Ask Flex a question..."
                  className="w-full bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl px-4 py-3.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-maroon-400/30 focus:bg-white placeholder:text-slate-400 resize-none max-h-32 min-h-[48px] custom-scrollbar shadow-inner shadow-slate-100/50"
                  rows={input.split("\n").length > 1 ? Math.min(input.split("\n").length, 4) : 1}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-600 to-rose-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-maroon-600/20 disabled:opacity-50 disabled:hover:shadow-none transition-all"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="-ml-0.5" />}
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-[10px] text-slate-400/80 font-medium">Flex can make mistakes. Consider verifying important information.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
