import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Bell, X } from "lucide-react";
import { VisitorCounter } from "./VisitorCounter";

const notifications = [
  { text: "New enterprise signup — Acme Industries", time: "2m ago", unread: true },
  { text: "Payment received — $12,400 via Stripe", time: "14m ago", unread: true },
  { text: "Your Pro plan is converting 2.4× faster", time: "1h ago", unread: false },
  { text: "System update completed successfully", time: "3h ago", unread: false },
];

export const TopNav = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const bellRef = useRef<HTMLButtonElement>(null);

  const updateDropdownPos = useCallback(() => {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  useEffect(() => {
    if (notifOpen) {
      updateDropdownPos();
      window.addEventListener("scroll", updateDropdownPos, true);
      window.addEventListener("resize", updateDropdownPos);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPos, true);
      window.removeEventListener("resize", updateDropdownPos);
    };
  }, [notifOpen, updateDropdownPos]);

  return (
    <header className="flex items-center gap-4 mb-8 animate-fade-in">
      <div>
        <p className="text-xs text-white/40 font-medium tracking-widest uppercase">
          {new Date().toLocaleDateString("en-US", { weekday: "long" })} ·{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Welcome back, <span className="gradient-text">Alex</span>
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <VisitorCounter />

        {/* Notification Bell */}
        <button
          ref={bellRef}
          className="w-11 h-11 rounded-[50%] grid place-items-center relative active:scale-[0.95] transition-transform"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(32px)", border: "none" }}
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Bell size={16} className="text-white/70" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_hsl(var(--neon-cyan))] animate-pulse" />
        </button>

        {/* User profile — icon only */}
        <div className="w-11 h-11 rounded-[50%] grid place-items-center" style={{ border: "none" }}>
          <div className="w-9 h-9 rounded-[50%] bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue grid place-items-center text-xs font-bold">
            AM
          </div>
        </div>
      </div>

      {/* Notification Dropdown — Portal to document.body */}
      {notifOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999]">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => setNotifOpen(false)} />
            {/* Dropdown */}
            <div
              className="absolute w-80 glass-strong rounded-2xl p-2 animate-dropdown-in overflow-hidden"
              style={{
                top: `${dropdownPos.top}px`,
                right: `${dropdownPos.right}px`,
              }}
            >
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold">Notifications</p>
                <button
                  className="text-[10px] text-white/40 hover:text-white transition-colors"
                  onClick={() => setNotifOpen(false)}
                >
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-0.5">
                {notifications.map((n, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3"
                  >
                    <span
                      className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        n.unread
                          ? "bg-neon-cyan shadow-[0_0_6px_hsl(var(--neon-cyan))]"
                          : "bg-white/20"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-white/80 leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-3 pt-2 pb-1 border-t border-white/5 mt-1">
                <button className="text-[10px] text-neon-cyan hover:text-white transition-colors w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
};
