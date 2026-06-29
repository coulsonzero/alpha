import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";
import { getVisitorStats, recordVisit } from "@/api/visitor";

function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + "k";
  return (n / 10000).toFixed(1) + "w";
}

export const VisitorCounter = () => {
  const [pv, setPv] = useState<number | null>(null);
  const [uv, setUv] = useState<number | null>(null);

  useEffect(() => {
    recordVisit().catch(() => {});

    const fetchStats = async () => {
      try {
        const res = await getVisitorStats();
        const d = res.data.data;
        setPv(d.total_pv);
        setUv(d.total_uv);
      } catch {
        /* ignore */
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2 rounded-full"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(32px)" }}
    >
      <div className="flex items-center gap-1.5">
        <Eye size={12} className="text-neon-cyan" />
        <span className="text-xs font-medium text-white/80 tabular-nums">{pv ?? "--"}</span>
      </div>
      <span className="text-white/15 text-[10px]">|</span>
      <div className="flex items-center gap-1.5">
        <Users size={12} className="text-neon-cyan" />
        <span className="text-xs font-medium text-white/80 tabular-nums">{uv ?? "--"}</span>
      </div>
    </div>
  );
};
