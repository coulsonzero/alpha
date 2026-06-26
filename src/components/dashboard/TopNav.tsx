import { Search, Bell, Command } from "lucide-react";

export const TopNav = () => (
  <header className="flex items-center gap-4 mb-8 animate-fade-in">
    <div>
      <p className="text-xs text-white/40 font-medium tracking-widest uppercase">Friday · June 26</p>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Welcome back, <span className="gradient-text">Alex</span>
      </h1>
    </div>

    <div className="ml-auto flex items-center gap-3">
      <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3 w-[280px] glass-hover">
        <Search size={16} className="text-white/40" />
        <input
          placeholder="Search anything..."
          className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/30"
        />
        <kbd className="text-[10px] flex items-center gap-1 text-white/40 border border-white/10 rounded-md px-1.5 py-0.5">
          <Command size={10} /> K
        </kbd>
      </div>

      <button className="glass glass-hover w-11 h-11 rounded-2xl grid place-items-center relative">
        <Bell size={16} className="text-white/70" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_hsl(var(--neon-cyan))]" />
      </button>

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
  </header>
);
