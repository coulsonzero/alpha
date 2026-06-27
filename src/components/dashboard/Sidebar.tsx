import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Users,
  Sparkles,
  MessageSquare,
  Settings,
  LifeBuoy,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Docs" },
  { icon: Users, label: "Audience" },
  { icon: Sparkles, label: "AI Insights" },
  { icon: MessageSquare, label: "Messages" },
];

const Logomark = () => (
<div class="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_24px_hsl(var(--primary)/0.5)]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles h-4 w-4 text-primary-foreground"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg></div>
);

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveFromPath = () => {
    if (location.pathname === "/chat") return 5; // Messages
    if (location.pathname === "/docs") return 2; // Docs
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
    } else if (label === "Docs") {
      navigate("/docs");
    } else if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <aside className="fixed left-4 top-[calc(50%-280px)] -translate-y-1/2 z-30 hidden lg:block animate-slide-left">
      <div className="rounded-[1.5rem] p-2.5 flex flex-col items-center gap-[3px]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))", backdropFilter: "blur(40px) saturate(160%)", boxShadow: "0 30px 80px -20px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255,255,255,0.1), inset 0 -1px 0 0 rgba(255,255,255,0.03)" }}>
        {/* Logo */}
        <div className="mb-1">
          <Logomark />
        </div>

        <div className="w-6 h-px bg-white/10 my-[2px]" />

        {/* Nav Items */}
        {items.map((it, i) => {
          const Icon = it.icon;
          const isActive = active === i;
          return (
            <button
              key={it.label}
              onClick={() => handleClick(i, it.label)}
              className={`group relative w-10 h-10 rounded-[50%] grid place-items-center transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-neon-purple/30 to-neon-cyan/20 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              aria-label={it.label}
              style={{ transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-neon-purple to-neon-cyan shadow-[0_0_10px_hsl(var(--neon-purple)/0.6)]" />
              )}
              <Icon size={16} strokeWidth={1.8} />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-[50%] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px]"
                style={{ background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(32px)", color: "rgba(255,255,255,0.7)" }}>
                {it.label}
              </span>
              {/* Hover glow ring */}
              <span
                className="absolute inset-0 rounded-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "0 0 15px -3px hsl(var(--neon-purple) / 0.3)",
                }}
              />
            </button>
          );
        })}

        <div className="w-6 h-px bg-white/10 my-[2px]" />

        {/* Bottom icons */}
        {[Settings, LifeBuoy].map((Icon, i) => (
          <button
            key={i}
            className="w-10 h-10 rounded-[50%] grid place-items-center text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
            style={{ transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            <Icon size={16} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </aside>
  );
};
