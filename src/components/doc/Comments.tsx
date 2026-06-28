import { useState, useRef } from "react";
import { MessageCircle, Heart, Reply, Send, Smile, Check } from "lucide-react";
import { EmojiPop } from "@/components/doc/EmojiPop";
import { MiniMd } from "@/components/doc/DocRenderer";
import type { Comment } from "@/components/doc/docsData";
import { saveMd } from "@/components/doc/docsData";
import type { Article } from "@/components/doc/docsData";

/* ─── Comments Section ─── */
interface CommentsSectionProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  form: { name: string; email: string; website: string; content: string; };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; website: string; content: string; }>>;
  replyTo: number | null;
  setReplyTo: React.Dispatch<React.SetStateAction<number | null>>;
  replyText: string;
  setReplyText: React.Dispatch<React.SetStateAction<string>>;
  liked: Set<number>;
  setLiked: React.Dispatch<React.SetStateAction<Set<number>>>;
  showEmoji: boolean;
  setShowEmoji: React.Dispatch<React.SetStateAction<boolean>>;
  showReplyEmoji: number | null;
  setShowReplyEmoji: React.Dispatch<React.SetStateAction<number | null>>;
  commentEndRef: React.RefObject<HTMLDivElement | null>;
}

export const CommentsSection = ({
  comments, setComments, form, setForm, replyTo, setReplyTo, replyText, setReplyText,
  liked, setLiked, showEmoji, setShowEmoji, showReplyEmoji, setShowReplyEmoji, commentEndRef,
}: CommentsSectionProps) => {

  const toggleLike = (id: number) => {
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
      id: Date.now(), name: form.name, email: form.email, website: form.website || form.name.toLowerCase().replace(/\s/g, "."),
      avatar: form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      time: "Just now", content: form.content, likes: 0, parentId: null, replies: [],
    };
    setComments(p => [...p, n]);
    setForm({ name: "", email: "", website: "", content: "" });
  };

  const pubReply = (pid: number) => {
    if (!replyText.trim()) return;
    const r: Comment = {
      id: Date.now(), name: "You", email: "", website: "",
      avatar: "YO", time: "Just now", content: replyText, likes: 0, parentId: pid,
    };
    setComments(p => p.map(c => c.id === pid ? { ...c, replies: [...(c.replies || []), r] } : c));
    setReplyText(""); setReplyTo(null);
  };

  return (
    <div className="mt-10 pt-8 border-t border-white/[0.06]">
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle size={15} className="text-blue-400/60" />
        <h3 className="text-sm font-semibold text-white/85">Comments</h3>
        <span className="text-[11px] text-white/25 ml-1">{comments.length}</span>
      </div>
      <div className="space-y-6 mb-8">
        {comments.map(c => (
          <div key={c.id}>
            <div className="group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 grid place-items-center text-[9px] font-bold shrink-0 text-white">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2.5 mb-1.5">
                    <p className="text-[13px] font-medium text-white/90">{c.name}</p>
                    {c.email && <span className="text-[10px] text-white/25">{c.email}</span>}
                    {c.website && <span className="text-[10px] text-blue-300/50">{c.website}</span>}
                    <span className="text-[10px] text-white/15">·</span>
                    <span className="text-[10px] text-white/25">{c.time}</span>
                  </div>
                  <div className="text-[12px] text-white/60 leading-relaxed">{MiniMd(c.content)}</div>
                  <div className="flex items-center gap-5 mt-2.5">
                    <button onClick={() => toggleLike(c.id)}
                      className="flex items-center gap-1.5 text-[11px] transition-all border-b border-transparent hover:border-white/20 pb-0.5" style={{ color: liked.has(c.id) ? "#fb7185" : "rgba(255,255,255,0.3)" }}>
                      <Heart size={12} fill={liked.has(c.id) ? "#fb7185" : "none"} /> <span>{c.likes + (liked.has(c.id) ? 1 : 0)}</span>
                    </button>
                    <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                      className="flex items-center gap-1.5 text-white/30 hover:text-blue-400 transition-all text-[11px] border-b border-transparent hover:border-blue-400/30 pb-0.5"><Reply size={12} /> Reply</button>
                  </div>
                </div>
              </div>
            </div>
            {replyTo === c.id && (
              <div className="ml-11 mt-3 relative">
                <div className="flex gap-2 animate-slide-up">
                  <input placeholder="Write a reply..." value={replyText} onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && pubReply(c.id)}
                    className="flex-1 border-b border-white/[0.08] bg-transparent px-0 py-2 text-[12px] outline-none text-white/70 placeholder:text-white/15 focus:border-blue-400/30 transition-colors" />
                  <button onClick={() => setShowReplyEmoji(showReplyEmoji === c.id ? null : c.id)}
                    className="w-7 h-7 grid place-items-center text-white/25 hover:text-white/60 transition-all"><Smile size={14} /></button>
                  <button onClick={() => pubReply(c.id)}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 grid place-items-center shadow-lg hover:scale-105 transition-all"><Send size={12} /></button>
                </div>
                {showReplyEmoji === c.id && (
                  <EmojiPop onSelect={e => setReplyText(p => p + e)} onClose={() => setShowReplyEmoji(null)} />
                )}
              </div>
            )}
            {c.replies && c.replies.length > 0 && (
              <div className="ml-11 mt-3 space-y-3">
                {c.replies.map(r => (
                  <div key={r.id}>
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-violet-400 grid place-items-center text-[8px] font-bold shrink-0 text-white">{r.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <p className="text-[12px] font-medium text-white/85">{r.name}</p>
                          <span className="text-[9px] text-white/25">{r.email}</span>
                          <span className="text-[9px] text-white/20">{r.time}</span>
                        </div>
                        <p className="text-[11px] text-white/55 leading-relaxed">{r.content}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <button onClick={() => toggleLike(r.id)}
                            className="flex items-center gap-1 text-[10px] border-b border-transparent hover:border-white/20 pb-0.5 transition-all" style={{ color: liked.has(r.id) ? "#fb7185" : "rgba(255,255,255,0.25)" }}>
                            <Heart size={10} fill={liked.has(r.id) ? "#fb7185" : "none"} /> {r.likes + (liked.has(r.id) ? 1 : 0)}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* subtle divider between comments */}
            <div className="mt-6 border-b border-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <div className="pt-2">
        <div className="space-y-4">
          <div className="flex gap-5">
            <div className="flex-1 border-b border-white/[0.06] focus-within:border-blue-400/30 transition-colors">
              <div className="flex items-center gap-2">
                <input placeholder="Name" value={form.name} onChange={e => setForm(p => ({ ...p,name: e.target.value }))}
                  className="w-full bg-transparent px-0 py-2 text-[12px] outline-none text-white/80 placeholder:text-white/15" />
                <span className="text-[9px] text-white/20 font-light tracking-wide whitespace-nowrap">(Required)</span>
              </div>
            </div>
            <div className="flex-1 border-b border-white/[0.06] focus-within:border-blue-400/30 transition-colors">
              <input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p,email: e.target.value }))}
                className="w-full bg-transparent px-0 py-2 text-[12px] outline-none text-white/80 placeholder:text-white/15" />
            </div>
            <div className="flex-1 border-b border-white/[0.06] focus-within:border-blue-400/30 transition-colors">
              <input placeholder="Website" value={form.website} onChange={e => setForm(p => ({ ...p,website: e.target.value }))}
                className="w-full bg-transparent px-0 py-2 text-[12px] outline-none text-white/80 placeholder:text-white/15" />
            </div>
          </div>
          <div className="relative border-b border-white/[0.06] focus-within:border-blue-400/30 transition-colors">
            <textarea placeholder="Write your comment... (Markdown supported)" value={form.content}
              onChange={e => setForm(p => ({ ...p,content: e.target.value }))} rows={2}
              className="w-full bg-transparent px-0 py-2 text-[12px] outline-none text-white/70 placeholder:text-white/15 resize-none pr-8" />
            <button onClick={() => setShowEmoji(!showEmoji)}
              className="absolute right-0 bottom-2.5 w-6 h-6 grid place-items-center text-white/20 hover:text-white/50 transition-all"><Smile size={14} /></button>
            {showEmoji && <EmojiPop onSelect={e => setForm(p => ({ ...p,content: p.content + e }))} onClose={() => setShowEmoji(false)} />}
          </div>
          <div className="flex items-center justify-end pt-1">
            <button onClick={pubComment}
              className="px-5 py-2 rounded-xl text-[11px] font-medium text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-[0_0_18px_rgba(76,201,240,0.25)] transition-all">Post Comment</button>
          </div>
        </div>
      </div>
      <div ref={commentEndRef} />
    </div>
  );
};
