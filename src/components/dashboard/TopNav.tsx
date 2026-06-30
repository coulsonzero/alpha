import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Bell, X, ChevronDown } from "lucide-react";
import { VisitorCounter } from "./VisitorCounter";
import { useAuth } from "./AuthProvider";
import { resolveAvatar } from "@/lib/avatar";

const notifications = [
  { text: "New enterprise signup — Acme Industries", time: "2m ago", unread: true },
  { text: "Payment received — $12,400 via Stripe", time: "14m ago", unread: true },
  { text: "Your Pro plan is converting 2.4× faster", time: "1h ago", unread: false },
  { text: "System update completed successfully", time: "3h ago", unread: false },
];

export const TopNav = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [profileDropdownPos, setProfileDropdownPos] = useState({ top: 0, right: 0 });
  const bellRef = useRef<HTMLButtonElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const { user, openAuth, logout } = useAuth();

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

  const updateProfilePos = useCallback(() => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setProfileDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  useEffect(() => {
    if (profileOpen) {
      updateProfilePos();
      window.addEventListener("scroll", updateProfilePos, true);
      window.addEventListener("resize", updateProfilePos);
    }
    return () => {
      window.removeEventListener("scroll", updateProfilePos, true);
      window.removeEventListener("resize", updateProfilePos);
    };
  }, [profileOpen, updateProfilePos]);

  const [avatarErr, setAvatarErr] = useState(false);
  const prevUserIdRef = useRef(user?.id);

  useEffect(() => {
    if (prevUserIdRef.current !== user?.id) {
      setAvatarErr(false);
      prevUserIdRef.current = user?.id;
    }
  }, [user?.id]);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AM";

  const isLoading = user === undefined;
  const avatarUrl = !avatarErr && user?.avatar ? resolveAvatar(user.avatar) : null;

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
          Welcome back, <span className="gradient-text">{user?.username || "Alex"}</span>
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

        {/* User profile pill */}
        <button
          ref={avatarRef}
          className="group flex items-center gap-2.5 px-3 h-11 rounded-full transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none"
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          onClick={() => setProfileOpen(!profileOpen)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.35)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          {isLoading ? null : (
            <>
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden bg-white/10">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.username} className="w-full h-full object-cover" onError={() => setAvatarErr(true)} />
                ) : (
                  <div className="w-full h-full grid place-items-center text-[11px] font-semibold text-white/80 bg-gradient-to-br from-violet-500 to-indigo-500">
                    {(user?.username || "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Username */}
              <span className="text-[13px] font-medium truncate max-w-[100px]" style={{ color: "rgba(255,255,255,0.9)" }}>
                {user?.username || "Sign In"}
              </span>
              {/* Chevron */}
              <ChevronDown
                size={12}
                className="shrink-0 transition-transform duration-300"
                style={{ color: "rgba(255,255,255,0.5)", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </>
          )}
        </button>
      </div>

      {/* Profile Dropdown — Portal to document.body */}
      {profileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999]">
            <div className="absolute inset-0" onClick={() => setProfileOpen(false)} />
            <div
              className="absolute w-44 glass-strong rounded-2xl p-1.5 animate-dropdown-in overflow-hidden"
              style={{
                top: `${profileDropdownPos.top}px`,
                right: `${profileDropdownPos.right}px`,
              }}
            >
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs font-medium text-white">{user.username}</p>
                    {user.email && <p className="text-[10px] text-white/40 truncate">{user.email}</p>}
                  </div>
                  <button className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-white/40 hover:bg-white/5 transition-colors">
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-white/40 hover:bg-white/5 transition-colors"
                    onClick={() => { setProfileOpen(false); logout(); }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-white/80 hover:bg-white/5 transition-colors"
                    onClick={() => { setProfileOpen(false); openAuth("login"); }}
                  >
                    Sign In
                  </button>
                  <button
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-white/80 hover:bg-white/5 transition-colors"
                    onClick={() => { setProfileOpen(false); openAuth("signup"); }}
                  >
                    Sign Up
                  </button>
                  <hr className="border-white/5 my-1" />
                  <button className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-white/40 hover:bg-white/5 transition-colors">
                    Settings
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}

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
