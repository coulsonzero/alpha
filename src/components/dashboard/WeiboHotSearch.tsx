import { useState, useEffect, useRef } from "react"
import { getHotSearch } from "@/api/hotSearch"
import {
  ExternalLink,
  TrendingUp,
  Flame,
  RefreshCw,
  Globe,
} from "lucide-react"

interface HotSearchItem {
  rank: number
  title: string
  hot: number
  label?: string
  url?: string
  category?: string
}

const rankColors = [
  "from-red-500 via-orange-400 to-yellow-400",
  "from-orange-400 to-amber-400",
  "from-amber-400 to-yellow-300",
]

const rankGlow = [
  "shadow-[0_0_12px_hsla(0,100%,60%,0.5)]",
  "shadow-[0_0_10px_hsla(30,100%,55%,0.4)]",
  "shadow-[0_0_8px_hsla(45,100%,50%,0.3)]",
]

function formatHot(hot: unknown) {
  if (typeof hot !== "number" || hot <= 0) return ""
  if (hot >= 100_000_000) return (hot / 100_000_000).toFixed(2) + "亿"
  if (hot >= 10_000) return (hot / 10_000).toFixed(1) + "万"
  return String(hot)
}

const LABEL_STYLES: Record<string, string> = {
  "新": "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
  "热": "bg-red-500/20 text-red-300 border-red-400/30",
  "荐": "bg-amber-500/20 text-amber-300 border-amber-400/30",
  "沸": "bg-orange-500/20 text-orange-300 border-orange-400/30",
  "爆": "bg-rose-500/20 text-rose-300 border-rose-400/30",
}

export const WeiboHotSearch = () => {
  const [items, setItems] = useState<HotSearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchData = async () => {
    try {
      setError(false)
      const res = await getHotSearch()
      const body = res.data
      setItems(Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const timer = setInterval(fetchData, 60000)
    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="glass noise rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-[50%] bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 grid place-items-center shadow-[0_0_20px_hsla(0,80%,55%,0.35)]">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <div className="h-3 w-16 bg-white/10 rounded mb-1.5" />
            <div className="h-4 w-20 bg-white/10 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-7 h-6 rounded-lg bg-white/5" />
              <div className="flex-1 h-4 rounded-lg bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass noise rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-[50%] bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 grid place-items-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <h4 className="text-sm font-bold">微博热搜</h4>
        </div>
        <div className="flex flex-col items-center gap-3 py-8 text-white/30">
          <Globe size={28} />
          <p className="text-sm font-medium text-white/40">数据加载失败</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass glass-hover noise rounded-3xl p-[1px]">
      <div className="relative rounded-[calc(1.75rem-1px)] overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/60 to-red-500/0" />

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-[50%] bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 grid place-items-center shadow-[0_0_20px_hsla(0,80%,55%,0.35)]">
              <TrendingUp size={16} className="text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-medium tracking-[0.2em] uppercase">Weibo</p>
              <h4 className="text-sm font-bold flex items-center gap-2">
                微博热搜
                <span className="text-[9px] font-medium text-emerald-300/80 tracking-wider bg-emerald-400/10 px-1.5 py-0.5 rounded-full border border-emerald-400/20">
                  LIVE
                </span>
              </h4>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="w-8 h-8 rounded-[50%] bg-white/5 grid place-items-center hover:bg-white/10 active:scale-90 transition-all"
          >
            <RefreshCw size={13} className="text-white/40" />
          </button>
        </div>

        {/* List — fixed height, scrollable */}
        <div className="px-2 pb-2 max-h-[440px] overflow-y-auto scrollbar-thin">
          <div className="space-y-0.5">
            {items.map((item, index) => {
              const isTop3 = index < 3
              const labelStyle = item.label ? LABEL_STYLES[item.label] : null

              return (
                <a
                  key={`${item.rank}-${item.title}`}
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-white/[0.06] transition-all duration-200 group text-left no-underline"
                >
                  {/* Rank */}
                  <span
                    className={`relative flex-shrink-0 w-7 h-6 rounded-lg grid place-items-center text-[11px] font-extrabold tabular-nums ${
                      isTop3
                        ? `bg-gradient-to-br ${rankColors[index]} text-white ${rankGlow[index]}`
                        : "text-white/40 bg-white/[0.04]"
                    }`}
                  >
                    {item.rank}
                    {isTop3 && (
                      <span className="absolute inset-0 rounded-lg animate-pulse opacity-40 bg-white/20" />
                    )}
                  </span>

                  {/* Title */}
                  <span className="flex-1 text-[13px] font-medium truncate text-white/65 group-hover:text-white/85 transition-colors">
                    {item.title}
                  </span>

                  {/* Label */}
                  {item.label && labelStyle && (
                    <span
                      className={`flex-shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${labelStyle}`}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Heat */}
                  {item.hot > 0 && (
                    <span className="text-[10px] text-white/30 tabular-nums font-medium flex-shrink-0">
                      {formatHot(item.hot)}
                    </span>
                  )}

                  {/* Icon */}
                  <ExternalLink
                    size={10}
                    className="flex-shrink-0 text-white/20 group-hover:text-white/50 transition-colors"
                  />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
