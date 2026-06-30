import { useEffect, useState } from "react";
import { Eye, Globe, Users } from "lucide-react";
import { getVisitorStats } from "@/api/visitor";

const VISITOR_PROFILE_KEY = "visitor_profile";

function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + "k";
  return (n / 10000).toFixed(1) + "w";
}

function readStoredLocation(): { country?: string; city?: string } {
  try {
    const raw = localStorage.getItem(VISITOR_PROFILE_KEY);
    if (!raw) return {};
    const profile = JSON.parse(raw);
    return {
      country: profile?.country || "",
      city: profile?.city || "",
    };
  } catch {
    return {};
  }
}

export const VisitorCounter = () => {
  const [pv, setPv] = useState<number | null>(null);
  const [uv, setUv] = useState<number | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>("--");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getVisitorStats();
        const d = res.data?.data || res.data || {};
        setPv(Number(d.total_pv ?? d.pv ?? d.totalPv ?? 0));
        setUv(Number(d.total_uv ?? d.uv ?? d.totalUv ?? 0));
        // Refresh location from localStorage (updated by VisitorTracker)
        const { country, city } = readStoredLocation();
        if (country) {
          setLocationLabel(city && city !== country ? `${country} · ${city}` : country);
        }
      } catch {
        /* ignore */
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    // Listen for VisitorTracker profile updates (fires when /visit response arrives)
    const onProfileUpdated = () => {
      const { country, city } = readStoredLocation();
      if (country) {
        setLocationLabel(city && city !== country ? `${country} · ${city}` : country);
      }
    };
    window.addEventListener("visitor-profile-updated", onProfileUpdated);
    return () => {
      clearInterval(interval);
      window.removeEventListener("visitor-profile-updated", onProfileUpdated);
    };
  }, []);

  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2 rounded-full"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {/* PV — total visits */}
      <div className="flex items-center gap-1.5" title="Total Visits">
        <Eye size={12} className="text-white/60" />
        <span className="text-[11px] font-medium text-white/85 tabular-nums">
          {pv === null ? "--" : formatCompact(pv)}
        </span>
      </div>

      <span className="text-white/10 text-[10px] select-none">|</span>

      {/* UV — unique visitors */}
      <div className="flex items-center gap-1.5" title="Unique Visitors">
        <Users size={12} className="text-white/60" />
        <span className="text-[11px] font-medium text-white/85 tabular-nums">
          {uv === null ? "--" : formatCompact(uv)}
        </span>
      </div>

      <span className="text-white/10 text-[10px] select-none">|</span>

      {/* Country · City */}
      <div className="flex items-center gap-1.5" title={locationLabel}>
        <Globe size={12} className="text-white/60" />
        <span className="max-w-[130px] truncate text-[11px] font-medium text-white/70 tabular-nums">
          {locationLabel}
        </span>
      </div>
    </div>
  );
};
