import { useState, useRef } from "react";
import {
  Search, BookOpen, ArrowRight, Clock, MessageCircle, Heart, Reply,
  Send, ArrowLeft, Copy, Check, Smile, Globe, AtSign, ChevronDown,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

/* ─── Sample markdown ─── */
const MD_CONTENT = `# Getting Started with Nebula

Everything you need to know to build your first dashboard.

## Installation

\`\`\`bash
npm create nebula@latest my-dashboard
cd my-dashboard
npm install
\`\`\`

## Quick Start

\`\`\`typescript
import { Dashboard } from "@nebula/core";

const app = new Dashboard({
  theme: "glass",
  analytics: true,
  features: ["realtime"],
});

app.render("#root");
\`\`\`

## Core Concepts

### Glassmorphism System

\`\`\`css
.glass-base {
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.5rem;
}
\`\`\`

## API Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`theme\` | string | "glass" | Visual theme |
| \`analytics\` | boolean | false | Enable analytics |
| \`features\` | string[] | [] | Feature flags |

## Events

\`\`\`typescript
dashboard.on("ready", () => {
  console.log("Dashboard is ready!");
});
\`\`\``;

const CATEGORIES = ["frontend", "backend", "database", "DevOps"];

const TAG_COLORS: Record<string, string> = {
  API: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  Blog: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  Guide: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  Tutorial: "border-amber-500/20 bg-amber-500/10 text-amber-300",
};

const ARTICLES = [
  { title: "Getting Started with Nebula", desc: "Build your first dashboard in under 10 minutes.", tag: "Guide", readTime: "5 min", date: "Jun 24, 2026", md: MD_CONTENT, featured: true, author: "Alex Morgan", avatar: "AM", comments: 12 },
  { title: "Building Real-Time Analytics Pipelines", desc: "Architect streaming data pipelines with WebSocket ingestion.", tag: "Tutorial", readTime: "12 min", date: "Jun 22, 2026", md: "## Real-Time Pipelines\n\n### Overview\n\n```typescript\nconst pipeline = new Pipeline({\n  source: \"kafka\",\n  transform: (e) => ({ ...e, ts: Date.now() }),\n});\n```", author: "Sarah Chen", avatar: "SC", comments: 8 },
  { title: "API Reference: Data Sources", desc: "Connect external data sources to your workspace.", tag: "API", readTime: "8 min", date: "Jun 20, 2026", md: "## API Reference\n\n### GET /api/sources\n\n```json\n{\n  \"id\": \"src_123\",\n  \"name\": \"Production DB\",\n  \"type\": \"postgresql\"\n}\n```", author: "Marcus Webb", avatar: "MW", comments: 4 },
  { title: "Advanced Glassmorphism Techniques", desc: "Layered blur, dynamic lighting, and premium material design.", tag: "Blog", readTime: "7 min", date: "Jun 18, 2026", md: "## Glassmorphism Deep Dive\n\n```css\n.card {\n  background: rgba(255,255,255,0.04);\n  backdrop-filter: blur(32px);\n}\n```", author: "Priya Kapoor", avatar: "PK", comments: 15 },
  { title: "Optimizing React Performance", desc: "Memoization, virtualization, and bundle splitting.", tag: "Guide", readTime: "10 min", date: "Jun 15, 2026", md: "## Performance\n\n```tsx\nconst MemoizedChart = React.memo(({ data }) => (\n  <Chart data={data} />\n));\n```", author: "James Liu", avatar: "JL", comments: 6 },
];

interface Comment {
  id: number; name: string; website: string; avatar: string; time: string;
  content: string; likes: number; liked?: boolean;
  parentId: number | null; replies?: Comment[];
}

const EMOJI_LIST = Array.from("😀😂❤️🔥👍🎉💯👋✨🚀🥳🙌💪");

/* ─── Sample comments ─── */
const INITIAL_COMMENTS: Comment[] = [
  { id: 1, name: "Alex Morgan", website: "alex.dev", avatar: "AM", time: "2 hours ago", content: "**Great article!** The blur example helped a lot 🚀 _Really appreciate it._", likes: 12, parentId: null, replies: [
    { id: 4, name: "Priya Kapoor", website: "priya.design", avatar: "PK", time: "1 hour ago", content: "Glad it helped! More advanced techniques coming soon.", likes: 5, parentId: 1 },
  ]},
  { id: 2, name: "Sophie Laurent", website: "sophie.tech", avatar: "SL", time: "5 hours ago", content: "Could you expand the WebSocket ingestion part? Building something similar at my company.", likes: 8, parentId: null, replies: [] },
  { id: 3, name: "Marcus Webb", website: "marcus.codes", avatar: "MW", time: "3 hours ago", content: "The glassmorphism system is incredible. 🔥 Well documented!", likes: 6, parentId: null, replies: [] },
];

/* ─── Syntax Highlight (github-dark) ─── */
function hl(code: string): string {
  return code
    .replace(/(\/\/.*)/g, '<span style="color:#6e7681">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#a5d6ff">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, "<span style=\"color:#a5d6ff\">$1</span>")
    .replace(/\b(import|from|const|let|var|function|return|if|else|async|await|new|export|default|console)\b/g, '<span style="color:#c792ea">$1</span>')
    .replace(/\b(string|number|boolean|void|any|Record|React)\b/g, '<span style="color:#82aaff">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#f77669">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#ff9cac">$1</span>')
    .replace(/(\{|\}|\(|\)|\[|\])/g, '<span style="color:#89ddff">$1</span>')
    .replace(/(\.)(map|filter|reduce|forEach|catch|then)/g, '<span style="color:#82aaff">$1$2</span>');
}

/* ─── Code Block (github-dark style) ─── */
interface CodeBlockProps { code: string; lang: string; }
const CodeBlock = ({ code, lang }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  return (
    <div className="my-5 rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0d1117", boxShadow: "0 8px 24px -8px rgba(0,0,0,0.4)" }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
        <span className="text-[10px] font-mono font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1.5 text-[10px] transition-all" style={{ color: copied ? "#7ee787" : "rgba(255,255,255,0.35)" }}>
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <div className="flex overflow-x-auto scrollbar-none">
        <div className="select-none text-right px-3 py-3 text-[11px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.12)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", minWidth: `${String(lines.length).length + 2}ch`, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="flex-1 p-3 text-[11px] leading-[1.7] overflow-x-auto scrollbar-none" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
          dangerouslySetInnerHTML={{ __html: hl(code) }} />
      </div>
    </div>
  );
};

/* ─── Mini MD renderer ─── */
function MiniMd(text: string) {
  return text
    .split(/(?=\n|$)/).map((part, i) => {
      let html = part
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:rgba(255,255,255,0.9)">$1</strong>')
        .replace(/_(.+?)_/g, '<em style="color:rgba(255,255,255,0.6)">$1</em>')
        .replace(/`(.+?)`/g, '<code style="color:#a5d6ff;background:rgba(255,255,255,0.06);padding:1px 4px;border-radius:4px;font-size:inherit">$1</code>');
      return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });
}

/* ─── Markdown Renderer ─── */
function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const els: React.ReactNode[] = [];
  let inCode = false, code: string[] = [], lang = "";
  let inTable = false;

  const pushTable = () => { inTable = false; };

  lines.forEach((line, i) => {
    const k = `md-${i}`;
    if (line.startsWith("```")) {
      if (inCode) { els.push(<CodeBlock key={k} code={code.join("\n")} lang={lang} />); code = []; lang = ""; inCode = false; }
      else { inCode = true; lang = line.slice(3).trim(); }
      return;
    }
    if (inCode) { code.push(line); return; }

    if (line.startsWith("## ")) { pushTable(); els.push(<h2 key={k} className="text-xl font-bold text-white/90 mt-8 mb-3">{line.slice(3)}</h2>); }
    else if (line.startsWith("# ")) { pushTable(); els.push(<h1 key={k} className="text-[26px] font-bold text-white leading-[1.08] mb-4">{line.slice(2)}</h1>); }
    else if (line.startsWith("### ")) { pushTable(); els.push(<h3 key={k} className="text-base font-semibold text-white/80 mt-6 mb-2">{line.slice(4)}</h3>); }
    else if (line.startsWith("| ")) {
      if (line.includes("---")) return;
      const cols = line.split("|").filter(Boolean).map(c => c.trim());
      const isHeader = lines[i + 1]?.includes("---");
      els.push(<div key={k} className="flex gap-4 px-3 py-1.5 text-[12px]" style={{ color: isHeader ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)" }}>{cols.map((c, j) => <span key={j} className="flex-1 [font-weight:inherit]">{c.replace(/`/g, "")}</span>)}</div>);
    } else if (line.startsWith("- ")) { pushTable(); els.push(<li key={k} className="text-[13px] text-white/60 ml-4 list-disc">{line.slice(2)}</li>); }
    else if (line.trim()) { pushTable(); els.push(<p key={k} className="text-[13px] text-white/65 leading-[1.9] mb-1">{line}</p>); }
    else { pushTable(); }
  });
  if (inCode) els.push(<CodeBlock key="md-end" code={code.join("\n")} lang={lang} />);
  return els;
}

/* ─── Emoji Picker ─── */
const EmojiPop = ({ onSelect, onClose }: { onSelect: (e: string) => void; onClose: () => void }) => (
  <div className="absolute bottom-full left-0 mb-2 rounded-2xl p-2 z-50 animate-dropdown-in"
    style={{ background: "rgba(16,14,24,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.7)" }}>
    <div className="grid grid-cols-6 gap-1">
      {EMOJI_LIST.map(e => (
        <button key={e} onClick={() => { onSelect(e); onClose(); }}
          className="w-8 h-8 rounded-lg grid place-items-center text-lg hover:bg-white/10 transition-all hover:scale-110">{e}</button>
      ))}
    </div>
  </div>
);

/* ─── Main ─── */
export default function DocsPage() {
  const [activeCat, setActiveCat] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [form, setForm] = useState({ name: "", email: "", website: "", content: "" });
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [showEmoji, setShowEmoji] = useState(false);
  const [showReplyEmoji, setShowReplyEmoji] = useState<number | null>(null);
  const commentEndRef = useRef<HTMLDivElement>(null);

  const pc = "border-white/[0.06] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06),0_0_30px_rgba(76,201,240,0.06)] bg-white/[0.035] backdrop-blur-[24px]";
  const rc = "transition-all duration-300 hover:translate-y-[-3px] cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6),0_0_30px_rgba(76,201,240,0.08)] bg-white/[0.035] backdrop-blur-[24px]";
  const ic = "w-full rounded-xl px-3.5 py-2.5 text-[12px] outline-none placeholder:text-white/15 text-white/70 border border-white/[0.06] bg-white/[0.04] focus:border-blue-400/20 transition-colors";

  const sel = selectedIdx !== null ? ARTICLES[selectedIdx] : null;
  const featured = ARTICLES.find(a => a.featured);

  const toggleLike = (id: number) => {
    setComments(prev => prev.map(c => c.id === id || c.replies?.some(r => r.id === id) ? c : c));
    setLiked(p => {
      const n = new Set(p);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
    setComments(prev => prev.map(c => {
      if (c.id === id) return { ...c, likes: c.likes + (liked.has(id) ? -1 : 1) };
      if (c.replies) return { ...c, replies: c.replies.map(r => r.id === id ? { ...r, likes: r.likes + (liked.has(id) ? -1 : 1) } : r) };
      return c;
    }));
  };

  const pubComment = () => {
    if (!form.name.trim() || !form.content.trim()) return;
    const n: Comment = {
      id: Date.now(), name: form.name, website: form.website || form.name.toLowerCase().replace(/\s/g, "."),
      avatar: form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      time: "Just now", content: form.content, likes: 0, parentId: null, replies: [],
    };
    setComments(p => [...p, n]);
    setForm({ name: "", email: "", website: "", content: "" });
  };

  const pubReply = (pid: number) => {
    if (!replyText.trim()) return;
    const r: Comment = {
      id: Date.now(), name: "You", website: "",
      avatar: "YO", time: "Just now", content: replyText, likes: 0, parentId: pid,
    };
    setComments(p => p.map(c => c.id === pid ? { ...c, replies: [...(c.replies || []), r] } : c));
    setReplyText(""); setReplyTo(null);
  };

  const filtered = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(circle at 20% 20%, rgba(123,47,247,0.18), transparent 30%), radial-gradient(circle at 70% 60%, rgba(76,201,240,0.12), transparent 35%), linear-gradient(135deg, #050816 0%, #090B14 35%, #0A1020 100%)", padding: "36px" }}>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      <div className="pointer-events-none fixed top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 z-0" style={{ background: "radial-gradient(circle, rgba(76,201,240,0.15), transparent 60%)" }} />
      <div className="pointer-events-none fixed bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px] opacity-25 z-0" style={{ background: "radial-gradient(circle, rgba(123,47,247,0.12), transparent 60%)" }} />
      <Sidebar />
      <div className="relative z-10 w-full max-w-[1600px] h-[calc(100vh-72px)] flex ml-24">
        {/* ═══ Left Nav ═══ */}
        <div className={`w-[180px] shrink-0 flex flex-col h-full rounded-l-[28px] overflow-hidden ${pc}`} style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="p-5 border-b border-white/[0.04]">
            <p className="text-[9px] font-semibold text-blue-400/60 uppercase tracking-[0.3em]">Browse</p>
            <h3 className="text-sm font-bold tracking-tight mt-1.5 text-white/90">Docs Hub</h3>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-1">
            {CATEGORIES.map((c, i) => (
              <button key={c} onClick={() => { setActiveCat(i); setSelectedIdx(null); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-300 ${i === activeCat ? "text-white border border-blue-400/15" : "text-white/40 hover:text-white/70 border border-transparent hover:bg-white/[0.04]"}`}
                style={i === activeCat ? { background: "linear-gradient(135deg, rgba(123,47,247,0.25), rgba(0,209,255,0.10))" } : {}}>{c}</button>
            ))}
          </div>
        </div>

        {/* ═══ Center ═══ */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 10px 40px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.03] flex items-center gap-4 shrink-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)" }}>
            {sel && (
              <button onClick={() => setSelectedIdx(null)}
                className="w-8 h-8 rounded-full grid place-items-center transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <ArrowLeft size={14} className="text-white/80" />
              </button>
            )}
            <div className="flex-1">
              <p className="text-[9px] font-semibold text-blue-400/50 uppercase tracking-[0.25em]">Knowledge Base</p>
              <h1 className="text-[24px] font-bold tracking-tight mt-1" style={{ background: "linear-gradient(to right, #fff 20%, #4CC9F0 70%, #7B2FF7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {sel ? sel.title : "Docs Hub"}
              </h1>
            </div>
            <div className="relative w-72">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400/40" />
              <input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-full pl-10 pr-4 text-[12px] outline-none placeholder:text-white/15 text-white/80"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 pb-2 flex items-center gap-6 border-b border-white/[0.02]">
            {["Articles", "Docs", "Links"].map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)}
                className={`text-[12px] font-medium pb-2.5 border-b-2 transition-all duration-300 ${activeTab === i ? "text-white border-blue-400" : "text-white/30 border-transparent hover:text-white/60"}`}>{t}</button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-none px-6 py-5 space-y-5">
            {sel ? (
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-3">
                  <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${TAG_COLORS[sel.tag] || ""}`}>{sel.tag}</span>
                  <span className="text-[11px] text-white/40">{sel.author} · {sel.date} · {sel.readTime}</span>
                </div>
                {renderMarkdown(sel.md || "")}

                {/* Comments */}
                <div className="mt-10 pt-6 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-6">
                    <MessageCircle size={14} className="text-blue-400/60" />
                    <h3 className="text-sm font-semibold text-white/80">Comments</h3>
                    <span className="text-[11px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">{comments.length}</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    {comments.map(c => (
                      <div key={c.id}>
                        <div className="rounded-2xl p-4 border border-white/[0.05]" style={{ background: "rgba(255,255,255,0.025)" }}>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 grid place-items-center text-[9px] font-bold shrink-0">{c.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <p className="text-[12px] font-semibold text-white/85">{c.name}</p>
                                <span className="text-[10px] text-blue-300/60">{c.website}</span>
                                <span className="text-[10px] text-white/15">·</span>
                                <span className="text-[10px] text-white/20">{c.time}</span>
                              </div>
                              <p className="text-[12px] text-white/60 leading-relaxed">{MiniMd(c.content)}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <button onClick={() => toggleLike(c.id)}
                                  className="flex items-center gap-1.5 text-[11px] transition-all" style={{ color: liked.has(c.id) ? "#fb7185" : "rgba(255,255,255,0.3)" }}>
                                  <Heart size={12} fill={liked.has(c.id) ? "#fb7185" : "none"} /> {c.likes + (liked.has(c.id) ? 1 : 0)}
                                </button>
                                <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                                  className="flex items-center gap-1.5 text-white/30 hover:text-blue-400 transition-all text-[11px]"><Reply size={12} /> Reply</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {replyTo === c.id && (
                          <div className="ml-10 mt-2 relative">
                            <div className="flex gap-2 animate-slide-up">
                              <input placeholder="Write a reply..." value={replyText} onChange={e => setReplyText(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && pubReply(c.id)}
                                className="flex-1 rounded-xl px-3.5 py-2 text-[12px] outline-none text-white/70 border border-white/[0.06] bg-white/[0.04]" />
                              <button onClick={() => setShowReplyEmoji(showReplyEmoji === c.id ? null : c.id)}
                                className="w-8 h-8 rounded-xl grid place-items-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"><Smile size={14} /></button>
                              <button onClick={() => pubReply(c.id)}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 grid place-items-center shadow-lg hover:scale-105 transition-all"><Send size={12} /></button>
                            </div>
                            {showReplyEmoji === c.id && (
                              <EmojiPop onSelect={e => setReplyText(p => p + e)} onClose={() => setShowReplyEmoji(null)} />
                            )}
                          </div>
                        )}
                        {c.replies && c.replies.length > 0 && (
                          <div className="ml-10 mt-2 space-y-2">
                            {c.replies.map(r => (
                              <div key={r.id} className="rounded-xl p-3 border border-white/[0.04]" style={{ background: "rgba(255,255,255,0.02)" }}>
                                <div className="flex items-start gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-violet-400 grid place-items-center text-[8px] font-bold shrink-0">{r.avatar}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <p className="text-[11px] font-semibold text-white/80">{r.name}</p>
                                      <span className="text-[9px] text-white/20">{r.time}</span>
                                    </div>
                                    <p className="text-[11px] text-white/55 leading-relaxed">{r.content}</p>
                                    <button onClick={() => { const nid = r.id * 100 + 1; toggleLike(c.id); }}
                                      className="flex items-center gap-1 mt-1.5 text-[10px] transition-all" style={{ color: "rgba(255,255,255,0.25)" }}>
                                      <Heart size={10} /> {r.likes}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Comment Form */}
                  <div className="rounded-2xl p-5 border border-white/[0.05]" style={{ background: "rgba(255,255,255,0.025)" }}>
                    <p className="text-[12px] font-semibold text-white/70 mb-4">Leave a comment</p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input placeholder="Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={ic} />
                        <input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={ic} />
                        <input placeholder="Website" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} className={ic} />
                      </div>
                      <div className="relative">
                        <textarea placeholder="Write your comment... (Markdown supported)" value={form.content}
                          onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={3} className={`${ic} resize-none pr-10`} />
                        <button onClick={() => setShowEmoji(!showEmoji)}
                          className="absolute right-2.5 bottom-3 w-7 h-7 rounded-lg grid place-items-center text-white/25 hover:text-white/60 transition-all"><Smile size={14} /></button>
                        {showEmoji && <EmojiPop onSelect={e => setForm(p => ({ ...p, content: p.content + e }))} onClose={() => setShowEmoji(false)} />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/20">Supports **bold**, _italic_, `code`</span>
                        <button onClick={pubComment}
                          className="px-6 py-2.5 rounded-xl text-[11px] font-semibold text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-[0_0_20px_rgba(76,201,240,0.3)] transition-all">Post Comment</button>
                      </div>
                    </div>
                  </div>
                  <div ref={commentEndRef} />
                </div>
              </div>
            ) : (
              <>
                {featured && (
                  <div className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    style={{ background: "linear-gradient(135deg, rgba(76,201,240,0.6), rgba(123,47,247,0.45))", boxShadow: "0 20px 60px -12px rgba(76,201,240,0.25), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                    onClick={() => setSelectedIdx(ARTICLES.indexOf(featured))}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)" }} />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, rgba(76,201,240,0.3), transparent 70%)" }} />
                    <div className="relative p-8 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-4">
                          <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">✦ Featured</span>
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
                      <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-xl grid place-items-center shrink-0 ml-6 border border-white/15"><BookOpen size={32} className="text-white/40" /></div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.slice(featured ? 1 : 0).map((a, i) => (
                    <div key={i} className={rc} onClick={() => setSelectedIdx(ARTICLES.indexOf(a))}>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full border ${TAG_COLORS[a.tag] || "border-white/10 text-white/40"}`}>{a.tag}</span>
                          <span className="text-[9px] text-white/25">{a.readTime}</span>
                        </div>
                        <h3 className="text-[14px] font-semibold tracking-tight mb-2 text-white/85 group-hover:text-white">{a.title}</h3>
                        <p className="text-[12px] text-white/45 leading-relaxed line-clamp-2">{a.desc}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.03]">
                          <div className="flex items-center gap-2"><Clock size={11} className="text-white/15" /><span className="text-[10px] text-white/25">{a.date}</span></div>
                          <ArrowRight size={14} className="text-white/20 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
