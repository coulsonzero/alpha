import { useEffect, useState } from "react";
import { Eye, Globe, Users } from "lucide-react";
import { getVisitorStats } from "@/api/visitor";

function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + "k";
  return (n / 10000).toFixed(1) + "w";
}

export const VisitorCounter = () => {
  const [pv, setPv] = useState<number | null>(null);
  const [uv, setUv] = useState<number | null>(null);
  const [ip, setIp] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  useEffect(() => {
    const readIp = (data: any) => data?.ip || data?.client_ip || data?.clientIp || data?.remote_ip || data?.remoteIp || data?.visitor_ip || null;
    const readLocation = (data: any) => {
      const country = data?.country || data?.visitor_country || data?.geo?.country || "";
      const city = data?.city || data?.visitor_city || data?.geo?.city || "";
      const combined = [country, city].filter(Boolean).join(" · ");
      return data?.location || data?.country_city || data?.countryCity || combined || null;
    };
    const applyVisitorInfo = (data: any) => {
      const nextIp = readIp(data);
      if (nextIp) setIp(nextIp);
      const nextLocation = readLocation(data);
      if (nextLocation) setLocationLabel(nextLocation);
    };

    const fetchStats = async () => {
      try {
        const res = await getVisitorStats();
        const d = res.data?.data || res.data || {};
        setPv(Number(d.total_pv ?? d.pv ?? d.totalPv ?? 0));
        setUv(Number(d.total_uv ?? d.uv ?? d.totalUv ?? 0));
        applyVisitorInfo(d);
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
      style={{
        background: "rgba(8,10,16,0.42)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -12px 24px rgba(0,0,0,0.14), 0 14px 34px -22px rgba(0,0,0,0.85)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <Eye size={12} className="text-white" />
        <span className="text-xs font-medium text-white/80 tabular-nums">{pv === null ? "--" : formatCompact(pv)}</span>
      </div>
      <span className="text-white/15 text-[10px]">|</span>
      <div className="flex items-center gap-1.5">
        <Users size={12} className="text-white" />
        <span className="text-xs font-medium text-white/80 tabular-nums">{uv === null ? "--" : formatCompact(uv)}</span>
      </div>
      <span className="text-white/15 text-[10px]">|</span>
      <div className="flex items-center gap-1.5" title={ip ? `IP: ${ip}` : "Location"}>
        <Globe size={12} className="text-white" />
        <span className="max-w-[120px] truncate text-xs font-medium text-white/70 tabular-nums">{locationLabel ?? "--"}</span>
      </div>
    </div>
  );
};
