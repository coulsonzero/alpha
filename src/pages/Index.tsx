import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { StatCards } from "@/components/dashboard/StatCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { PerformanceWidgets } from "@/components/dashboard/PerformanceWidgets";
import { Particles } from "@/components/dashboard/Particles";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Particles />
      <Sidebar />

      <main className="relative z-10 lg:pl-32 pr-6 pl-6 py-8 max-w-[1600px] mx-auto">
        <TopNav />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="flex flex-col gap-6">
            <HeroCard />
            <StatCards />
            <RevenueChart />
            <PerformanceWidgets />
          </div>

          <InsightsPanel />
        </div>

        <footer className="mt-12 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/30">
          <p>© 2026 Nebula · Crafted with precision</p>
          <div className="flex gap-5">
            <a className="hover:text-white/70 transition-colors" href="#">Changelog</a>
            <a className="hover:text-white/70 transition-colors" href="#">Privacy</a>
            <a className="hover:text-white/70 transition-colors" href="#">Status · All systems normal</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
