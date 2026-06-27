import { useState } from "react";
import {
  Search, BookOpen, ArrowRight, Clock, Bookmark,
  Github, Twitter, MessageCircle, Heart, Reply, Send,
  ExternalLink, User, ChevronRight, Activity,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

/* ─── Data ─── */
const CATEGORIES = ["All Docs", "Blog", "Guides", "API", "Tutorials", "Changelog"];

const TAG_COLORS: Record<string, string> = {
  API: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(0,209,255,0.25)]",
  Blog: "border-violet-500/20 bg-violet-500/10 text-violet-300 shadow-[0_0_12px_rgba(123,47,247,0.25)]",
  Guide: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
  Tutorial: "border-amber-500/20 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
};

const ARTICLES = [
  { title: "Getting Started with Nebula", desc: "Everything you need to know to build your first dashboard in under 10 minutes.", tag: "Guide", readTime: "5 min", date: "Jun 24, 2026", featured: true, author: "Alex Morgan", avatar: "AM", comments: 12 },
  { title: "Building Real-Time Analytics Pipelines", desc: "Learn how to architect streaming data pipelines with WebSocket-based ingestion.", tag: "Tutorial", readTime: "12 min", date: "Jun 22, 2026", author: "Sarah Chen", avatar: "SC", comments: 8 },
  { title: "API Reference: Data Sources", desc: "Complete documentation for connecting external data sources to your workspace.", tag: "API", readTime: "8 min", date: "Jun 20, 2026", author: "Marcus Webb", avatar: "MW", comments: 4 },
  { title: "Advanced Glassmorphism Techniques", desc: "Deep-dive into layered blur, dynamic lighting, and premium material design.", tag: "Blog", readTime: "7 min", date: "Jun 18, 2026", author: "Priya Kapoor", avatar: "PK", comments: 15 },
  { title: "Optimizing React Performance at Scale", desc: "Pro tips for memoization, virtualization, and bundle splitting in large apps.", tag: "Guide", readTime: "10 min", date: "Jun 15, 2026", author: "James Liu", avatar: "JL", comments: 6 },
];

const TOC = ["Introduction", "Installation", "Quick Start", "Core Concepts", "Architecture", "Configuration", "Deployment", "Next Steps"];
const TABS = ["Articles", "Docs", "Links"];

const AUTHORS = [
  { name: "Alex Morgan", handle: "@alexmorgan", avatar: "AM", grad: "from-violet-500 to-cyan-400" },
  { name: "Sarah Chen", handle: "@sarahchen", avatar: "SC", grad: "from-pink-500 to-violet-500" },
  { name: "Marcus Webb", handle: "@marcuswebb", avatar: "MW", grad: "from-cyan-400 to-blue-500" },
  { name: "Priya Kapoor", handle: "@priyakapoor", avatar: "PK", grad: "from-emerald-400 to-cyan-400" },
];

const COMMENTS = [
  { name: "Alex Morgan", handle: "alex.dev", avatar: "AM", time: "2 hours ago", content: "Great article! The blur example helped a lot 🚀", likes: 12 },
  { name: "Sophie Laurent", handle: "sophie.tech", avatar: "SL", time: "5 hours ago", content: "Could you expand more on the WebSocket ingestion part? I'm building something similar at my company.", likes: 8 },
];

export default function DocsPage() {
  const [activeCat, setActiveCat] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const featured = ARTICLES.find(a => a.featured);

  const rowClass = "transition-all duration-300 hover:translate-y-[-3px] cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06]"
    + " shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6),0_0_30px_rgba(76,201,240,0.08)]"
    + " bg-white/[0.035] backdrop-blur-[24px]";
  const panelClass = "border-white/[0.06] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06),0_0_30px_rgba(76,201,240,0.06)]"
    + " bg-white/[0.035] backdrop-blur-[24px]";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 20% 20%, rgba(123,47,247,0.18), transparent 30%), radial-gradient(circle at 70% 60%, rgba(76,201,240,0.12), transparent 35%), linear-gradient(135deg, #050816 0%, #090B14 35%, #0A1020 100%)",
        padding: "36px",
      }}>
      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 z-0"
        style={{ background: "radial-gradient(circle, rgba(76,201,240,0.15), transparent 60%)" }} />
      <div className="pointer-events-none fixed bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px] opacity-25 z-0"
        style={{ background: "radial-gradient(circle, rgba(123,47,247,0.12), transparent 60%)" }} />

      <Sidebar />

      <div className="relative z-10 w-full max-w-[1600px] h-[calc(100vh-72px)] flex ml-24">

        {/* ═══ LEFT NAV ═══ */}
        <div className={`w-[180px] shrink-0 flex flex-col h-full rounded-l-[28px] overflow-hidden ${panelClass}`}
          style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="p-5 border-b border-white/[0.04]">
            <p className="text-[9px] font-semibold text-blue-400/60 uppercase tracking-[0.3em]">Browse</p>
            <h3 className="text-sm font-bold tracking-tight mt-1.5 text-white/90">Docs Hub</h3>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-1">
            {CATEGORIES.map((c, i) => {
              const isActive = i === activeCat;
              return (
                <button key={c} onClick={() => setActiveCat(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-[0_0_20px_rgba(123,47,247,0.25)] border border-blue-400/15"
                      : "text-white/40 hover:text-white/70 border border-transparent hover:bg-white/[0.04]"
                  }`}
                  style={isActive ? {
                    background: "linear-gradient(135deg, rgba(123,47,247,0.25), rgba(0,209,255,0.10))",
                  } : {}}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ CENTER ═══ */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "0 10px 40px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>

          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.03] flex items-center gap-4 shrink-0"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)" }}>
            <div className="flex-1">
              <p className="text-[9px] font-semibold text-blue-400/50 uppercase tracking-[0.25em]">Knowledge Base</p>
              <h1 className="text-[24px] font-bold tracking-tight mt-1"
                style={{ background: "linear-gradient(to right, #fff 20%, #4CC9F0 70%, #7B2FF7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Docs Hub
              </h1>
            </div>
            {/* Premium Search */}
            <div className="relative w-72">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400/40" />
              <input placeholder="Search documentation..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-full pl-10 pr-4 text-[12px] outline-none placeholder:text-white/15 text-white/80"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                }} />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-md border border-white/[0.05]">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 pb-2 flex items-center gap-6 border-b border-white/[0.02]">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)}
                className={`text-[12px] font-medium pb-2.5 border-b-2 transition-all duration-300 ${
                  activeTab === i
                    ? "text-white border-blue-400"
                    : "text-white/30 border-transparent hover:text-white/60"
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-none px-6 py-5 space-y-6">
            {/* Featured Hero */}
            {featured && (
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(76,201,240,0.6), rgba(123,47,247,0.45))",
                  boxShadow: "0 20px 60px -12px rgba(76,201,240,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}>
                {/* Floating orbs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-50"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)" }} />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-40"
                  style={{ background: "radial-gradient(circle, rgba(76,201,240,0.3), transparent 70%)" }} />
                <div className="absolute top-1/2 left-1/3 w-0.5 h-24 bg-white/10 rotate-[30deg] blur-sm" />

                <div className="relative p-8 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        ✦ Featured
                      </span>
                      <span className="text-[10px] text-white/60">{featured.date}</span>
                      <span className="text-[10px] text-white/40">{featured.readTime}</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-3 text-white leading-[1.08]">{featured.title}</h2>
                    <p className="text-[14px] text-white/75 leading-relaxed max-w-lg">{featured.desc}</p>
                    <div className="flex items-center gap-5 mt-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 grid place-items-center text-[9px] font-bold shadow-lg">AM</div>
                        <span className="text-[12px] text-white/70">{featured.author}</span>
                      </div>
                      <span className="text-[11px] text-white/50">{featured.comments} comments</span>
                    </div>
                  </div>
                  <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-xl grid place-items-center shrink-0 ml-6 border border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                    <BookOpen size={32} className="text-white/40" />
                  </div>
                </div>
              </div>
            )}

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ARTICLES.slice(1).map((a, i) => (
                <div key={i} className={rowClass}>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full border ${TAG_COLORS[a.tag] || "border-white/10 text-white/40"}`}>{a.tag}</span>
                      <span className="text-[9px] text-white/25">{a.readTime}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold tracking-tight mb-2 text-white/85 group-hover:text-white transition-colors">{a.title}</h3>
                    <p className="text-[12px] text-white/45 leading-relaxed line-clamp-2">{a.desc}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.03]">
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-white/15" />
                        <span className="text-[10px] text-white/25">{a.date}</span>
                      </div>
                      <ArrowRight size={14} className="text-white/20 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comments Section */}
            <div className="py-4">
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle size={14} className="text-blue-400/60" />
                <h3 className="text-sm font-semibold text-white/80">Comments</h3>
                <span className="text-[11px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">{COMMENTS.length}</span>
              </div>

              <div className="space-y-4 mb-6">
                {COMMENTS.map((c, i) => (
                  <div key={i} className="rounded-2xl p-4 border border-white/[0.05] bg-white/[0.02]"
                    style={{ boxShadow: "0 4px 12px -4px rgba(0,0,0,0.2)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 grid place-items-center text-[9px] font-bold shrink-0">{c.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <p className="text-[12px] font-semibold text-white/85">{c.name}</p>
                          <span className="text-[10px] text-white/25">{c.handle}</span>
                          <span className="text-[10px] text-white/20">·</span>
                          <span className="text-[10px] text-white/20">{c.time}</span>
                        </div>
                        <p className="text-[12px] text-white/60 leading-relaxed">{c.content}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-1.5 text-white/30 hover:text-rose-400 transition-all text-[11px]">
                            <Heart size={12} /> {c.likes}
                          </button>
                          <button className="flex items-center gap-1.5 text-white/30 hover:text-blue-400 transition-all text-[11px]">
                            <Reply size={12} /> Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Form */}
              <div className="rounded-2xl p-5 border border-white/[0.05]" style={{ background: "rgba(255,255,255,0.025)" }}>
                <p className="text-[12px] font-semibold text-white/70 mb-3">Leave a comment</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input placeholder="Your name"
                      className="flex-1 rounded-xl px-3.5 py-2.5 text-[12px] outline-none placeholder:text-white/15 text-white/70"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
                    <input placeholder="Email"
                      className="flex-1 rounded-xl px-3.5 py-2.5 text-[12px] outline-none placeholder:text-white/15 text-white/70"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
                  </div>
                  <textarea placeholder="Write your comment..."
                    rows={3}
                    className="w-full rounded-xl px-3.5 py-2.5 text-[12px] outline-none placeholder:text-white/15 text-white/70 resize-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/20">Markdown supported</span>
                    <button className="px-4 py-2 rounded-xl text-[11px] font-semibold text-white bg-white/[0.08] hover:bg-white/[0.12] transition-all border border-white/[0.06]">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className={`w-64 shrink-0 flex flex-col h-full overflow-y-auto scrollbar-none rounded-r-[28px] ${panelClass}`}
          style={{ borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
          {/* TOC */}
          <div className="p-5 border-b border-white/[0.04]">
            <p className="text-[9px] font-semibold text-blue-400/50 uppercase tracking-[0.2em] mb-3">On This Page</p>
            <div className="space-y-0.5">
              {TOC.map((t, i) => (
                <button key={t}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-all duration-200 ${
                    i === 0
                      ? "text-white bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-400 shadow-[0_0_15px_rgba(76,201,240,0.06)]"
                      : "text-white/30 hover:text-white/60 border-l-2 border-transparent hover:bg-white/[0.02]"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Authors */}
          <div className="p-5 border-b border-white/[0.04]">
            <p className="text-[9px] font-semibold text-blue-400/50 uppercase tracking-[0.2em] mb-3">Authors</p>
            <div className="space-y-2.5">
              {AUTHORS.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-all group">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.grad} grid place-items-center text-[9px] font-bold shrink-0 shadow-lg`}>
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white/80 group-hover:text-white transition-colors truncate">{a.name}</p>
                    <p className="text-[10px] text-white/25 truncate">{a.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social / Code */}
          <div className="p-5">
            <p className="text-[9px] font-semibold text-blue-400/50 uppercase tracking-[0.2em] mb-3">Connect</p>
            <div className="flex gap-2 mb-5">
              {[Github, Twitter, MessageCircle, Activity].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-xl grid place-items-center text-white/30 hover:text-white hover:bg-white/[0.06] border border-white/[0.05] transition-all duration-200 hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
            {/* Code block */}
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400/50" />
                  <span className="w-2 h-2 rounded-full bg-amber-400/50" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400/50" />
                  <span className="text-[9px] text-white/20 ml-2 font-mono">app.ts</span>
                </div>
                <span className="text-[8px] text-blue-400/50 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/10">typescript</span>
              </div>
              <pre className="p-3 text-[11px] leading-[1.7] overflow-x-auto scrollbar-none" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                <code>{`import { Dashboard }\n  from "@nebula/core"\n\nconst app = new\n  Dashboard({\n    theme: "glass",\n  })\n\napp.render("#root")`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
