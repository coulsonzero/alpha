import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  Users,
  Sparkles,
  MessageSquare,
  Settings,
  LifeBuoy,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Wallet, label: "Revenue" },
  { icon: Users, label: "Audience" },
  { icon: Sparkles, label: "AI Insights" },
  { icon: MessageSquare, label: "Messages" },
];

const Logomark = () => (
  <div className="relative w-12 h-12 grid place-items-center">
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_12px_hsl(270_95%_65%/0.5)]"
    >
      {/* Outer glow ring */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#logoGrad)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
      {/* Inner hexagon */}
      <path
        d="M20 6L33 14V26L20 34L7 26V14L20 6Z"
        fill="url(#logoGrad)"
        fillOpacity="0.15"
        stroke="url(#logoGrad)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Center diamond */}
      <path
        d="M20 12L27 20L20 28L13 20L20 12Z"
        fill="url(#logoGrad)"
        fillOpacity="0.8"
        stroke="white"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />
      {/* Center dot */}
      <circle cx="20" cy="20" r="2.5" fill="white" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveFromPath = () => {
    if (location.pathname === "/chat") return 5; // Messages
    return 0; // Overview (dashboard)
  };

  const [active, setActive] = useState(getActiveFromPath);

  useEffect(() => {
    setActive(getActiveFromPath());
  }, [location.pathname]);

  const handleClick = (index: number, label: string) => {
    setActive(index);
    if (label === "Messages") {
      navigate("/chat");
    } else if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <aside className="fixed left-6 top-[calc(50%-300px)] -translate-y-1/2 z-30 hidden lg:block animate-fade-in">
      <div className="glass-strong noise relative rounded-[2rem] p-3 flex flex-col items-center gap-2">
        {/* Logo */}
        <div className="mb-2">
          <Logomark />
        </div>

        <div className="w-8 h-px bg-white/10 my-1" />

        {/* Nav Items */}
        {items.map((it, i) => {
          const Icon = it.icon;
          const isActive = active === i;
          return (
            <button
              key={it.label}
              onClick={() => handleClick(i, it.label)}
              className={`group relative w-12 h-12 rounded-[50%] grid place-items-center transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-neon-purple/30 to-neon-cyan/20 text-white animate-icon-pulse"
                  : "text-white/50 hover:text-white hover:bg-white/5 hover:scale-[1.08]"
              }`}
              aria-label={it.label}
              style={{ transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-neon-purple to-neon-cyan shadow-[0_0_10px_hsl(var(--neon-purple)/0.6)]" />
              )}
              <Icon size={18} strokeWidth={1.8} />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-4 px-3 py-1.5 rounded-xl glass text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {it.label}
              </span>
              {/* Hover glow ring */}
              <span
                className="absolute inset-0 rounded-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-neon-purple/20"
                style={{
                  boxShadow: "0 0 15px -3px hsl(var(--neon-purple) / 0.3)",
                }}
              />
            </button>
          );
        })}

        <div className="w-8 h-px bg-white/10 my-1" />

        {/* Bottom icons */}
        {[Settings, LifeBuoy].map((Icon, i) => (
          <button
            key={i}
            className="w-12 h-12 rounded-[50%] grid place-items-center text-white/40 hover:text-white hover:bg-white/5 hover:scale-[1.08] transition-all duration-300"
            style={{ transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            <Icon size={18} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </aside>
  );
};
