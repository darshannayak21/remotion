"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Stethoscope, Dumbbell, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/userService";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "assignment" | "achievement" | "info";
}

export default function NotificationPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const profile = await getUserProfile(user.uid);
      const notifs: Notification[] = [];

      // Check for new doctor assignment
      if (profile?.hasNewAssignment) {
        notifs.push({
          id: "new-assignment",
          title: "New Recovery Plan",
          message: "Your doctor has assigned a personalized AI-guided exercise plan. Check your Workout Groups.",
          time: "Just now",
          read: false,
          type: "assignment",
        });
      }

      // Add some contextual notifications based on stats
      if (profile?.stats) {
        if (profile.stats.streak > 0) {
          notifs.push({
            id: "streak",
            title: `${profile.stats.streak}-Day Streak!`,
            message: "You're on fire! Keep up the consistency for best results.",
            time: "Today",
            read: true,
            type: "achievement",
          });
        }
        if (profile.stats.sessionsCount > 0) {
          notifs.push({
            id: "sessions",
            title: "Session Tracked",
            message: `You have completed ${profile.stats.sessionsCount} session${profile.stats.sessionsCount > 1 ? "s" : ""} so far. Great work!`,
            time: "Recent",
            read: true,
            type: "info",
          });
        }
      }

      if (notifs.length === 0) {
        notifs.push({
          id: "welcome",
          title: "Welcome to ReMotion",
          message: "Start your first workout session to receive updates and insights here.",
          time: "Now",
          read: true,
          type: "info",
        });
      }

      setNotifications(notifs);
      setHasUnread(notifs.some(n => !n.read));
    };
    load();
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setHasUnread(false);
  };

  const iconForType = (type: string) => {
    switch (type) {
      case "assignment": return <Stethoscope size={14} className="text-maroon-600" />;
      case "achievement": return <CheckCircle2 size={14} className="text-amber-600" />;
      default: return <Dumbbell size={14} className="text-slate-500" />;
    }
  };

  const bgForType = (type: string) => {
    switch (type) {
      case "assignment": return "bg-maroon-50";
      case "achievement": return "bg-amber-50";
      default: return "bg-slate-50";
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button with vibrate-on-hover */}
      <motion.button
        whileHover={{
          scale: 1.15,
          rotate: [0, -8, 8, -6, 6, -3, 3, 0],
          transition: { rotate: { duration: 0.5, ease: "easeInOut" } },
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAllRead();
        }}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-maroon-50 hover:text-maroon-700 transition-colors"
        title="Notifications"
      >
        <Bell size={17} />
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-maroon-600 rounded-full border-2 border-white animate-badge"
          />
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-0 left-full ml-3 w-80 max-h-[70vh] overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-white/95 backdrop-blur-xl z-50"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-maroon-600" />
                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[55vh] custom-scrollbar">
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`px-4 py-3.5 border-b border-slate-50 last:border-0 transition-colors ${
                    !notif.read ? "bg-maroon-50/30" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${bgForType(notif.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                      {iconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{notif.title}</p>
                        {!notif.read && (
                          <div className="w-1.5 h-1.5 bg-maroon-600 rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1 font-medium uppercase tracking-wide">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Panel Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[9px] text-slate-400 text-center font-medium uppercase tracking-wider">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
