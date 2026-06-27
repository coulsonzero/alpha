import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, Bell, Command, X } from "lucide-react";

const notifications = [
  { text: "New enterprise signup — Acme Industries", time: "2m ago", unread: true },
  { text: "Payment received — $12,400 via Stripe", time: "14m ago", unread: true },
  { text: "Your Pro plan is converting 2.4× faster", time: "1h ago", unread: false },
  { text: "System update completed successfully", time: "3h ago", unread: false },
];

export const TopNav = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const bellRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    searchRef.current?.focus();
  };

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
        {/* Search */}
        <div
          className={`glass rounded-2xl px-4 py-2.5 flex items-center gap-3 w-[280px] glass-hover transition-all duration-300 ${
            searchFocused
              ? "border-neon-purple/30 shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.3)]"
              : ""
          }`}
          onClick={handleSearchClick}
        >
          <Search size={16} className="text-white/40" />
          <input
            ref={searchRef}
            placeholder="Search anything..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/30"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="text-[10px] flex items-center gap-1 text-white/40 border border-white/10 rounded-md px-1.5 py-0.5">
            <Command size={10} /> K
          </kbd>
        </div>

        {/* Notification Bell */}
        <button
          ref={bellRef}
          className="glass glass-hover w-11 h-11 rounded-[50%] grid place-items-center relative active:scale-[0.95] transition-transform"
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Bell size={16} className="text-white/70" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_hsl(var(--neon-cyan))] animate-pulse" />
        </button>

        {/* User profile */}
        <div className="glass rounded-2xl pl-2 pr-4 py-1.5 flex items-center gap-3 glass-hover">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue grid place-items-center text-xs font-bold">
            AM
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold leading-tight">Alex Morgan</p>
            <p className="text-[10px] text-white/40">Pro Account</p>
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
