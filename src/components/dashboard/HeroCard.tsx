import { ArrowUpRight, Play, Sparkles } from "lucide-react";

export const HeroCard = () => (
  <div className="relative rounded-[2rem] overflow-hidden group animate-scale-in" style={{ animationDelay: "0.1s" }}>
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, #6d28d9 0%, #4f46e5 35%, #0891b2 75%, #06b6d4 100%)",
      }}
    />
    <div
      className="absolute inset-0 opacity-70"
      style={{
        background:
          "radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.6), transparent 50%), radial-gradient(circle at 10% 90%, rgba(34, 211, 238, 0.5), transparent 50%)",
      }}
    />
    <div className="absolute inset-0 noise" />
    <div
      className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-50"
      style={{ background: "radial-gradient(circle, #f0abfc, transparent 70%)" }}
    />
    <div
      className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full blur-3xl opacity-40"
      style={{ background: "radial-gradient(circle, #67e8f9, transparent 70%)" }}
    />

    <div className="relative p-8 md:p-10 min-h-[280px] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium">
          <Sparkles size={12} /> AI-Powered Insights
        </div>
        <button className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 grid place-items-center hover:bg-white/25 transition-all">
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="max-w-xl">
        <p className="text-white/70 text-sm font-medium mb-2">Quarterly Performance</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-2">
          Your revenue jumped <span className="italic font-light">38.2%</span> this quarter
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-md">
          Driven by a surge in enterprise upgrades and a 2.4× lift in conversion from the new onboarding flow.
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex gap-3">
          <button className="px-5 py-3 rounded-2xl bg-white text-zinc-900 text-sm font-semibold hover:scale-[1.02] transition-transform inline-flex items-center gap-2">
            <Play size={14} fill="currentColor" /> Watch Recap
          </button>
          <button className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold hover:bg-white/20 transition-all">
            View Report
          </button>
        </div>

        <div className="flex gap-6">
          {[
            { l: "MRR", v: "$284K", d: "+12%" },
            { l: "Churn", v: "1.2%", d: "-0.4%" },
            { l: "NPS", v: "72", d: "+8" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">{s.l}</p>
              <p className="text-xl font-bold">{s.v}</p>
              <p className="text-[10px] text-emerald-200 font-medium">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
