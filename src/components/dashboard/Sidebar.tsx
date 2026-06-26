import { useState } from "react";
import { LayoutDashboard, BarChart3, Wallet, Users, Sparkles, MessageSquare, Settings, LifeBuoy } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Wallet, label: "Revenue" },
  { icon: Users, label: "Audience" },
  { icon: Sparkles, label: "AI Insights" },
  { icon: MessageSquare, label: "Messages" },
];

export const Sidebar = () => {
  const [active, setActive] = useState(0);
  return (
    <aside className="fixed left-6 top-[calc(50%-300px)] -translate-y-1/2 z-30 hidden lg:block animate-fade-in">
      <div className="glass-strong noise relative rounded-[2rem] p-3 flex flex-col items-center gap-2">
        <div className="relative w-12 h-12 rounded-2xl gradient-hero grid place-items-center mb-2 glow-purple">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <div className="w-8 h-px bg-white/10 my-1" />
        {items.map((it, i) => {
          const Icon = it.icon;
          const isActive = active === i;
          return (
            <button
              key={it.label}
              onClick={() => setActive(i)}
              className={`group relative w-12 h-12 rounded-2xl grid place-items-center transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-neon-purple/30 to-neon-cyan/20 text-white shadow-[0_0_25px_-5px_hsl(var(--neon-purple)/0.6)]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              aria-label={it.label}
            >
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-neon-purple to-neon-cyan" />
              )}
              <Icon size={18} strokeWidth={1.8} />
              <span className="pointer-events-none absolute left-full ml-4 px-3 py-1.5 rounded-xl glass text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {it.label}
              </span>
            </button>
          );
        })}
        <div className="w-8 h-px bg-white/10 my-1" />
        {[Settings, LifeBuoy].map((Icon, i) => (
          <button key={i} className="w-12 h-12 rounded-2xl grid place-items-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Icon size={18} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </aside>
  );
};
