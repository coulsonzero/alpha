import { useState, useRef, useMemo } from "react";
import { BookOpen, Bookmark, ArrowLeft, Plus } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

import {
  ARTICLES, CATEGORIES, TAG_COLORS, CAT_COLORS, TAG_ICONS,
  Comment, INITIAL_COMMENTS, saveMd,
} from "@/components/doc/docsData";
import { renderMarkdown } from "@/components/doc/DocRenderer";
import { DocsSidebar } from "@/components/doc/DocsSidebar";
import { DocGrid } from "@/components/doc/DocGrid";
import { ArticleView } from "@/components/doc/ArticleView";
import { TimelineTab } from "@/components/doc/TimelineTab";
import { ProfileTab } from "@/components/doc/ProfileTab";
import { NewDocEditor } from "@/components/doc/NewDocEditor";

/* ─── Main ─── */
export default function DocsPage() {
  const [activeCat, setActiveCat] = useState(0);
  const [activeTab, setActiveTab] = useState(2);
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

  // Preview/Raw/Edit states
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [articleMd, setArticleMd] = useState<string>("");
  const prevSelRef = useRef<number | null>(null);

  // New doc editor
  const [showNewEditor, setShowNewEditor] = useState(false);

  const pc = "border-white/[0.06] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06),0_0_30px_rgba(76,201,240,0.06)] bg-white/[0.035] backdrop-blur-[24px]";
  const rc = "transition-all duration-300 hover:translate-y-[-3px] cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6),0_0_30px_rgba(76,201,240,0.08)] bg-white/[0.035] backdrop-blur-[24px]";

  const sel = selectedIdx !== null ? ARTICLES[selectedIdx] : null;
  const featured = ARTICLES.find(a => a.featured);

  // Memoize rendered markdown to avoid re-highlight on every render
  const renderedContent = useMemo(() => {
    const md = articleMd || sel?.md || "";
    if (!md) return null;
    return renderMarkdown(md);
  }, [articleMd, sel?.md]);

  // Compute per-category counts from ARTICLES
  const catCounts = CATEGORIES.map(cat =>
    cat.label === "All Documents" ? ARTICLES.length : ARTICLES.filter(a => a.tag === cat.label).length
  );

  // Filter articles by active category
  const filteredArticles = activeCat === 0
    ? ARTICLES
    : ARTICLES.filter(a => a.tag === CATEGORIES[activeCat].label);

  // Init edit/article state when switching articles
  if (sel && selectedIdx !== prevSelRef.current) {
    prevSelRef.current = selectedIdx;
    setEditContent(sel.md || "");
    setArticleMd(sel.md || "");
    setViewMode("preview");
    setIsEditing(false);
  }

  let bodyContent: React.ReactNode;
  if (sel) {
    bodyContent = (
      <ArticleView
        sel={sel}
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editContent={editContent}
        setEditContent={setEditContent}
        articleMd={articleMd}
        setArticleMd={setArticleMd}
        renderedContent={renderedContent}
        comments={comments}
        setComments={setComments}
        form={form}
        setForm={setForm}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        replyText={replyText}
        setReplyText={setReplyText}
        liked={liked}
        setLiked={setLiked}
        showEmoji={showEmoji}
        setShowEmoji={setShowEmoji}
        showReplyEmoji={showReplyEmoji}
        setShowReplyEmoji={setShowReplyEmoji}
        commentEndRef={commentEndRef}
        TAG_COLORS={TAG_COLORS}
        TAG_ICONS={TAG_ICONS}
      />
    );
  } else if (activeTab === 1) {
    bodyContent = (
      <TimelineTab
        filteredArticles={filteredArticles}
        ARTICLES={ARTICLES}
        setSelectedIdx={setSelectedIdx}
        TAG_COLORS={TAG_COLORS}
        TAG_ICONS={TAG_ICONS}
      />
    );
  } else if (activeTab === 2) {
    bodyContent = (
      <ProfileTab activeTab={activeTab} />
    );
  } else {
    bodyContent = (
      <DocGrid
        activeCat={activeCat}
        ARTICLES={ARTICLES}
        filteredArticles={filteredArticles}
        featured={featured}
        setSelectedIdx={setSelectedIdx}
        rc={rc}
        TAG_COLORS={TAG_COLORS}
        TAG_ICONS={TAG_ICONS}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(circle at 20% 20%, rgba(123,47,247,0.18), transparent 30%), radial-gradient(circle at 70% 60%, rgba(76,201,240,0.12), transparent 35%), linear-gradient(135deg, #050816 0%, #090B14 35%, #0A1020 100%)", padding: "36px" }}>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      <div className="pointer-events-none fixed top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 z-0" style={{ background: "radial-gradient(circle, rgba(76,201,240,0.15), transparent 60%)" }} />
      <div className="pointer-events-none fixed bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px] opacity-25 z-0" style={{ background: "radial-gradient(circle, rgba(123,47,247,0.12), transparent 60%)" }} />
      <Sidebar />
      <div className="relative z-10 w-full max-w-[1600px] h-[calc(100vh-72px)] flex ml-24">
        {/* ═══ Left Nav ═══ */}
        <div className={`w-[220px] shrink-0 flex flex-col h-full rounded-l-[28px] overflow-hidden ${pc}`} style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="p-5 border-b border-white/[0.04]">
            <p className="text-[9px] font-semibold text-blue-400/60 uppercase tracking-[0.3em]">Browse</p>
            <h3 className="text-sm font-bold tracking-tight mt-1.5 text-white/90">Docs Hub</h3>
          </div>
          <DocsSidebar
            CATEGORIES={CATEGORIES}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            setSelectedIdx={setSelectedIdx}
            catCounts={catCounts}
            CAT_COLORS={CAT_COLORS}
            onNavigate={() => setShowNewEditor(false)}
          />
        </div>

        {/* ═══ Center ═══ */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 10px 40px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
          {/* Header — no search bar */}
          <div className="px-6 py-4 border-b border-white/[0.03] flex items-center gap-4 shrink-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)" }}>
            {sel && (
              <button onClick={() => { setSelectedIdx(null); }}
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
          </div>
          {!sel && (
            <div className="px-6 pt-4 pb-2 flex items-center border-b border-white/[0.02] transition-all duration-300">
              <div className="flex items-center gap-6 flex-1">
                {["Docs", "Timeline", "Profile"].map((t, i) => (
                <button key={t} onClick={() => { setActiveTab(i); setShowNewEditor(false); }}
                  className={`text-[12px] font-medium pb-2.5 border-b-2 transition-all duration-300 ${activeTab === i ? "text-white border-blue-400" : "text-white/30 border-transparent hover:text-white/60"}`}>{t}</button>
              ))}
              </div>
              {activeTab === 0 && (
                <button
                  onClick={() => setShowNewEditor(true)}
                  className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, rgba(76,201,240,0.15), rgba(123,47,247,0.12))",
                    border: "1px solid rgba(76,201,240,0.2)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Plus size={13} />
                  New Doc
                </button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto scrollbar-none px-6 py-5 space-y-5">
            {showNewEditor ? (
              <NewDocEditor onClose={() => setShowNewEditor(false)} />
            ) : (
              bodyContent
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
