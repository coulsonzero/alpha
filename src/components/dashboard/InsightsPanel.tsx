import { useState, useRef, useCallback } from "react";
import { Sparkles, ArrowUpRight, Globe, CreditCard, UserPlus, MessageCircle, ChevronDown } from "lucide-react";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";
import { TodoCard } from "@/components/dashboard/TodoCard";

const activity = [
  { icon: UserPlus, color: "from-neon-cyan to-neon-blue", title: "New enterprise signup", who: "Acme Industries", time: "2m ago" },
  { icon: CreditCard, color: "from-neon-purple to-neon-pink", title: "Payment received", who: "$12,400 · Stripe", time: "14m ago" },
  { icon: MessageCircle, color: "from-neon-green to-neon-cyan", title: "Support resolved", who: "Maria · #4821", time: "1h ago" },
  { icon: Globe, color: "from-neon-pink to-neon-purple", title: "Site traffic spike", who: "+312% from /pricing", time: "3h ago" },
];

const goals = [
  { label: "Q3 Revenue", value: 78, color: "from-neon-purple to-neon-cyan" },
  { label: "New Customers", value: 64, color: "from-neon-cyan to-neon-blue" },
  { label: "Retention Rate", value: 92, color: "from-neon-green to-neon-cyan" },
];

const CollapsibleCard = ({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="glass glass-hover noise rounded-3xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-6 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <h4 className="text-sm font-semibold">{title}</h4>
        </div>
        <ChevronDown
          size={16}
          className={`text-white/40 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight ?? 1000}px` : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export const InsightsPanel = () => (
  <div className="flex flex-col gap-5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
    {/* Weekly Calendar */}
    <WeeklyCalendar />

    {/* Todo */}
    <TodoCard />

    {/* AI insight */}
    <CollapsibleCard
      title="AI Suggestion"
      icon={
        <div className="w-8 h-8 rounded-[50%]
bg-gradient-to-br from-neon-purple to-neon-cyan grid place-items-center animate-pulse-glow">
          <Sparkles size={14} />
        </div>
      }
    >
      <p className="text-base leading-relaxed font-medium mb-4">
        Your <span className="gradient-text font-semibold">Pro plan</span> is converting 2.4× faster on mobile. Consider doubling spend on iOS ads this week.
      </p>
      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-cyan hover:gap-2.5 transition-all">
        Apply suggestion <ArrowUpRight size={12} />
      </button>
    </CollapsibleCard>

    {/* Goals */}
    <CollapsibleCard title="Quarter Goals">
      <div className="space-y-4">
        {goals.map((g) => (
          <div key={g.label}>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/70">{g.label}</span>
              <span className="font-semibold">{g.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${g.color} shadow-[0_0_10px_hsl(var(--neon-purple)/0.5)]`}
                style={{ width: `${g.value}%`, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </CollapsibleCard>

    {/* Activity */}
    <CollapsibleCard
      title="Live Activity"
      icon={
        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300 font-medium">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
            <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-400" />
          </span>
          Live
        </span>
      }
    >
      <div className="space-y-3">
        {activity.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className={`w-9 h-9 rounded-[50%]
bg-gradient-to-br ${a.color} grid place-items-center shrink-0 shadow-lg`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{a.title}</p>
                <p className="text-[10px] text-white/40 truncate">{a.who}</p>
              </div>
              <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors">{a.time}</span>
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  </div>
);
