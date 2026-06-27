import { useState, useRef, useEffect } from "react";
import {
  Search, Smile, Paperclip, Image, Send, Mic,
  Star, ChevronDown, Circle, MoreHorizontal,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

/* ─── Types ─── */
interface Contact {
  id: number; name: string; avatar: string; lastMsg: string;
  time: string; unread: number; online: boolean;
}
interface Message {
  id: number; sender: "me" | "them"; type: "text" | "emoji" | "image" | "voice";
  content: string; time: string; reactions?: string[];
}
interface ChatData {
  messages: Message[];
  pinned?: string;
}

/* ─── Data ─── */
const CONTACTS: Contact[] = [
  { id: 1, name: "Sarah Chen", avatar: "SC", lastMsg: "Sure, sending the deck now", time: "2:41 PM", unread: 3, online: true },
  { id: 2, name: "Alex Morgan", avatar: "AM", lastMsg: "You: Sounds great!", time: "1:22 PM", unread: 0, online: true },
  { id: 3, name: "Marcus Webb", avatar: "MW", lastMsg: "The build passed all tests ✅", time: "11:05 AM", unread: 1, online: false },
  { id: 4, name: "Priya Kapoor", avatar: "PK", lastMsg: "Can we sync at 3?", time: "Yesterday", unread: 0, online: true },
  { id: 5, name: "James Liu", avatar: "JL", lastMsg: "Updated the Figma file", time: "Yesterday", unread: 0, online: false },
  { id: 6, name: "Elena Rossi", avatar: "ER", lastMsg: "Coffee run? ☕", time: "Mon", unread: 2, online: true },
  { id: 7, name: "Dev Team", avatar: "DT", lastMsg: "Sprint review at 4pm", time: "Mon", unread: 5, online: false },
];

const CHATS: Record<number, ChatData> = {
  1: {
    pinned: "📎 Sprint planning at 3pm — don't miss it!",
    messages: [
      { id: 1, sender: "them", type: "text", content: "Hey! Are you free today?", time: "2:30 PM" },
      { id: 2, sender: "me", type: "text", content: "Yes! Just wrapped up the design review", time: "2:31 PM" },
      { id: 3, sender: "them", type: "emoji", content: "😄", time: "2:31 PM", reactions: ["❤️"] },
      { id: 4, sender: "them", type: "text", content: "Let's jump into the meeting in 10 mins", time: "2:32 PM" },
      { id: 5, sender: "me", type: "text", content: "Perfect, I'll set up the Zoom link", time: "2:33 PM" },
      { id: 6, sender: "them", type: "text", content: "Also, can you share the latest mockups?", time: "2:34 PM", reactions: ["👍"] },
      { id: 7, sender: "me", type: "image", content: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", time: "2:35 PM" },
      { id: 8, sender: "them", type: "text", content: "Looks amazing! The gradients are 👌", time: "2:36 PM" },
      { id: 9, sender: "me", type: "voice", content: "0:42", time: "2:38 PM" },
      { id: 10, sender: "them", type: "text", content: "Great, meeting link received. Joining now 🚀", time: "2:40 PM" },
    ],
  },
  2: {
    messages: [
      { id: 1, sender: "them", type: "text", content: "How's the new dashboard coming along?", time: "1:00 PM" },
      { id: 2, sender: "me", type: "text", content: "Really good! Almost done with the animations", time: "1:05 PM" },
      { id: 3, sender: "them", type: "text", content: "Can I see a preview?", time: "1:10 PM" },
      { id: 4, sender: "me", type: "text", content: "Sure! Here's a sneak peek 👀", time: "1:15 PM" },
      { id: 5, sender: "me", type: "image", content: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", time: "1:16 PM" },
      { id: 6, sender: "them", type: "emoji", content: "🔥", time: "1:18 PM" },
      { id: 7, sender: "them", type: "text", content: "That looks incredible! The glass effects are on point", time: "1:20 PM" },
      { id: 8, sender: "me", type: "text", content: "Thanks! Still tweaking the holographic feel", time: "1:22 PM" },
    ],
  },
};

function getDefaultMessages(): Message[] {
  return [
    { id: 1, sender: "them", type: "text", content: "Hey! How's it going?", time: "10:00 AM" },
    { id: 2, sender: "me", type: "text", content: "All good! Working on the new features", time: "10:05 AM" },
  ];
}

const EMOJI_LIST = ["😀","😂","❤️","🔥","👍","🎉","💯","😍","🤔","👋","✨","🚀","💪","🙌","😎","🥳"];

const AVATAR_GRADS = [
  "from-violet-500 to-cyan-400", "from-pink-500 to-violet-500",
  "from-cyan-400 to-blue-500", "from-emerald-400 to-cyan-400",
  "from-fuchsia-500 to-pink-500", "from-violet-500 to-fuchsia-500",
  "from-blue-400 to-cyan-400",
];

/* ─── Chat Page ─── */
const ChatPage = () => {
  const [activeContact, setActiveContact] = useState(0);
  const [chatData, setChatData] = useState<Record<number, ChatData>>(CHATS);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const contact = CONTACTS[activeContact];
  const currentChat = chatData[contact.id] || { messages: getDefaultMessages() };
  const messages = currentChat.messages;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeContact]);

  const simulateTyping = () => { setIsTyping(true); setTimeout(() => setIsTyping(false), 2500); };

  const sendMessage = () => {
    const content = input.trim();
    if (!content) return;
    const isEmoji = /^[\p{Emoji}]+$/u.test(content) && content.length <= 3;
    const msg: Message = {
      id: Date.now(), sender: "me",
      type: isEmoji ? "emoji" : "text", content,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
    setChatData(prev => ({
      ...prev,
      [contact.id]: {
        ...prev[contact.id],
        messages: [...(prev[contact.id]?.messages || getDefaultMessages()), msg],
      },
    }));
    setInput(""); setShowEmoji(false);
    simulateTyping();
  };

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full flex bg-[#050508] overflow-hidden">
      {/* Ambient holographic orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, hsla(270,90%,55%,0.2), transparent 60%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[100px] opacity-12"
          style={{ background: "radial-gradient(circle, hsla(190,100%,50%,0.15), transparent 60%)" }} />
      </div>

      <Sidebar />

      <main className="relative z-10 flex flex-1 lg:pl-24 h-screen overflow-hidden">
        {/* ═══ Left Panel: Contacts ═══ */}
        <div className="w-[340px] shrink-0 flex flex-col h-full"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%)",
            backdropFilter: "blur(80px) saturate(200%)",
            WebkitBackdropFilter: "blur(80px) saturate(200%)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}>
          {/* Header */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[10px] font-semibold text-violet-400/60 uppercase tracking-[0.2em] mb-1">Inbox</p>
                <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                  Messages
                </h2>
              </div>
              <span className="text-[10px] text-white/20 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.04]">
                {CONTACTS.reduce((s, c) => s + c.unread, 0)} new
              </span>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] rounded-2xl pl-9 pr-4 py-2.5 text-xs outline-none placeholder:text-white/12 border border-white/[0.05] focus:border-violet-400/15 focus:bg-white/[0.05] transition-all duration-300"
              />
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto scrollbar-none px-3">
            {filteredContacts.map((c, i) => {
              const isActive = i === activeContact;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveContact(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center gap-3.5 transition-all duration-300 mb-1 group relative ${
                    isActive
                      ? "bg-white/[0.06] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-gradient-to-b from-violet-400 via-cyan-400 to-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
                  )}
                  <div className="relative shrink-0">
                    <div className={`w-11 h-11 rounded-2xl grid place-items-center text-xs font-bold bg-gradient-to-br ${AVATAR_GRADS[i % 7]} shadow-lg ${isActive ? "shadow-[0_0_20px_-3px_rgba(139,92,246,0.4)]" : ""} transition-shadow duration-300`}>
                      {c.avatar}
                    </div>
                    {c.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-[3px] border-[#08080d] shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className={`text-[13px] font-semibold truncate transition-colors ${isActive ? "text-white" : "text-white/80"}`}>
                        {c.name}
                      </p>
                      <span className="text-[10px] text-white/20 shrink-0 ml-2 font-medium">{c.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-[11px] truncate transition-colors ${isActive ? "text-white/40" : "text-white/25"}`}>
                        {c.lastMsg}
                      </p>
                      {c.unread > 0 && !isActive && (
                        <span className="text-[10px] font-bold bg-violet-500 text-white min-w-[18px] h-[18px] rounded-full grid place-items-center leading-none ml-2 shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom profile */}
          <div className="p-4 border-t border-white/[0.03]">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-white/[0.02] transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-400 via-violet-500 to-cyan-400 grid place-items-center text-[10px] font-bold shadow-lg">
                YO
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold">You</p>
                <p className="text-[10px] text-white/20">Online</p>
              </div>
              <ChevronDown size={14} className="text-white/15" />
            </div>
          </div>
        </div>

        {/* ═══ Center: Chat Window ═══ */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative">
          {/* Top holographic edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/15 to-transparent z-10" />

          {/* Chat header */}
          <div className="px-6 py-3.5 flex items-center gap-4 shrink-0 border-b border-white/[0.03]"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.025), transparent)",
              backdropFilter: "blur(40px)",
            }}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${AVATAR_GRADS[activeContact % 7]} grid place-items-center text-[11px] font-bold shadow-lg`}>
                  {contact.avatar}
                </div>
                {contact.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-[3px] border-[#07070d] shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{contact.name}</p>
                <p className="text-[10px] text-white/25 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${contact.online ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-white/15"}`} />
                  {contact.online ? "Online" : "Last seen recently"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-xl grid place-items-center text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <Star size={14} />
              </button>
              <button className="w-8 h-8 rounded-xl grid place-items-center text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <Search size={14} />
              </button>
              <button className="w-8 h-8 rounded-xl grid place-items-center text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>

          {/* Pinned message */}
          {currentChat.pinned && (
            <div className="mx-5 mt-3 px-4 py-2 rounded-2xl flex items-center gap-3 text-[11px] animate-slide-up"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.12)",
              }}>
              <span className="text-violet-400">📌</span>
              <span className="text-white/60 flex-1 truncate">{currentChat.pinned}</span>
              <button className="text-white/20 hover:text-white/50 transition-colors shrink-0">✕</button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-none px-6 py-4 space-y-1.5">
            {/* Date divider */}
            <div className="flex items-center gap-3 py-2">
              <span className="flex-1 h-px bg-white/[0.03]" />
              <span className="text-[10px] text-white/15 font-medium uppercase tracking-wider">Today</span>
              <span className="flex-1 h-px bg-white/[0.03]" />
            </div>

            {messages.map((m, i) => {
              const showAvatar = m.sender === "them" && (i === 0 || messages[i-1]?.sender !== "them");
              return (
                <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"} animate-slide-up`}>
                  <div className={`flex gap-2.5 max-w-[70%] ${m.sender === "me" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar for received */}
                    {m.sender === "them" && (
                      <div className="shrink-0 mt-1">
                        {showAvatar ? (
                          <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${AVATAR_GRADS[activeContact % 7]} grid place-items-center text-[9px] font-bold`}>
                            {contact.avatar}
                          </div>
                        ) : <div className="w-7" />}
                      </div>
                    )}

                    <div className={`flex flex-col ${m.sender === "me" ? "items-end" : "items-start"} gap-0.5`}>
                      {m.type === "text" && (
                        <div className={`px-4 py-2.5 text-[13px] leading-relaxed ${
                          m.sender === "me"
                            ? "rounded-[18px] rounded-br-md text-white"
                            : "rounded-[18px] rounded-bl-md text-white/90"
                        } ${
                          m.sender === "me" && i === messages.length - 1 ? "animate-slide-up" : ""
                        }`}
                        style={m.sender === "me"
                          ? { background: "linear-gradient(135deg, rgba(139,92,246,0.7), rgba(6,182,212,0.55))", backdropFilter: "blur(10px)" }
                          : { background: "rgba(255,255,255,0.045)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.04)" }}>
                          {m.content}
                        </div>
                      )}
                      {m.type === "emoji" && (
                        <div className="text-4xl leading-none">{m.content}</div>
                      )}
                      {m.type === "image" && (
                        <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/[0.06] max-w-[280px]">
                          <img src={m.content} alt="shared" className="w-full object-cover" loading="lazy" />
                        </div>
                      )}
                      {m.type === "voice" && (
                        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-[18px] ${
                          m.sender === "me"
                            ? "bg-gradient-to-r from-violet-500/50 to-cyan-400/40 rounded-br-md"
                            : "bg-white/[0.05] border border-white/[0.04] rounded-bl-md"
                        }`}>
                          <button className="w-7 h-7 rounded-full bg-white/20 grid place-items-center hover:bg-white/30 transition-all">
                            <svg width="11" height="11" viewBox="0 0 14 14"><polygon points="3,1 13,7 3,13" fill="white" /></svg>
                          </button>
                          <div className="w-24 h-1 rounded-full bg-white/15 overflow-hidden">
                            <div className="h-full w-[65%] rounded-full bg-white/50" />
                          </div>
                          <span className="text-[10px] text-white/50 tabular-nums">{m.content}</span>
                        </div>
                      )}
                      <div className={`flex items-center gap-2 ${m.sender === "me" ? "flex-row-reverse" : ""}`}>
                        <span className="text-[9px] text-white/12">{m.time}</span>
                        {m.reactions && (
                          <button className="text-[11px] bg-white/[0.03] hover:bg-white/[0.06] rounded-full px-2 py-0.5 border border-white/[0.03] transition-all">
                            {m.reactions.join(" ")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing dots */}
            {isTyping && (
              <div className="flex gap-2.5 animate-slide-up">
                <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${AVATAR_GRADS[activeContact % 7]} grid place-items-center text-[9px] font-bold shrink-0 mt-1`}>
                  {contact.avatar}
                </div>
                <div className="px-4 py-3 rounded-[18px] rounded-bl-md flex items-center gap-1.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-[5px] h-[5px] rounded-full bg-white/25 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div className="px-5 py-3 shrink-0"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.015))",
              backdropFilter: "blur(40px)",
              borderTop: "1px solid rgba(255,255,255,0.035)",
            }}>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`w-9 h-9 rounded-xl grid place-items-center transition-all duration-200 ${
                    showEmoji ? "bg-white/[0.08] text-violet-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
                  }`}>
                  <Smile size={16} />
                </button>
                {showEmoji && (
                  <div className="absolute bottom-full left-0 mb-2 rounded-2xl p-3 w-[272px] animate-dropdown-in z-50 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]"
                    style={{ background: "rgba(18,18,28,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="grid grid-cols-8 gap-1.5">
                      {EMOJI_LIST.map(e => (
                        <button key={e}
                          onClick={() => { setInput(p => p + e); setShowEmoji(false); }}
                          className="w-7 h-7 rounded-lg grid place-items-center text-lg hover:bg-white/10 transition-all hover:scale-110">
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="w-9 h-9 rounded-xl grid place-items-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <Paperclip size={16} />
              </button>

              <button className="w-9 h-9 rounded-xl grid place-items-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <Image size={16} />
              </button>

              <div className="flex-1 rounded-2xl px-4 h-[42px] flex items-center"
                style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input
                  type="text"
                  placeholder="Message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  className="w-full bg-transparent outline-none text-[13px] placeholder:text-white/18"
                />
              </div>

              <button className="w-9 h-9 rounded-xl grid place-items-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <Mic size={16} />
              </button>

              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-full grid place-items-center transition-all duration-200 ${
                  input.trim()
                    ? "bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_30px_-8px_rgba(139,92,246,0.6)] hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.8)] hover:scale-105 active:scale-95"
                    : "bg-white/[0.03] text-white/10 cursor-not-allowed"
                }`}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
