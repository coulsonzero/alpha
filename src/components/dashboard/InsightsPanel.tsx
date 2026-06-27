import { Sparkles, ArrowUpRight, Globe, CreditCard, UserPlus, MessageCircle } from "lucide-react";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";

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

export const InsightsPanel = () => (
  <div className="flex flex-col gap-5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
    {/* Weekly Calendar */}
    <WeeklyCalendar />

    {/* AI insight */}
    <div className="glass-strong noise relative rounded-3xl p-6 overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-50 blur-3xl bg-gradient-to-br from-neon-purple to-neon-pink" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan grid place-items-center animate-pulse-glow">
            <Sparkles size={14} />
          </div>
          <p className="text-xs font-semibold tracking-wider uppercase text-white/60">AI Suggestion</p>
        </div>
        <p className="text-base leading-relaxed font-medium mb-4">
          Your <span className="gradient-text font-semibold">Pro plan</span> is converting 2.4× faster on mobile. Consider doubling spend on iOS ads this week.
        </p>
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-cyan hover:gap-2.5 transition-all">
          Apply suggestion <ArrowUpRight size={12} />
        </button>
      </div>
    </div>

    {/* Goals */}
    <div className="glass glass-hover noise rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-semibold">Quarter Goals</h4>
        <button className="text-[10px] text-white/40 hover:text-white">View all</button>
      </div>
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
    </div>

    {/* Activity */}
    <div className="glass glass-hover noise rounded-3xl p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold">Live Activity</h4>
        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300 font-medium">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
            <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-400" />
          </span>
          Live
        </span>
      </div>
      <div className="space-y-3">
        {activity.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} grid place-items-center shrink-0 shadow-lg`}>
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
    </div>
  </div>
);
