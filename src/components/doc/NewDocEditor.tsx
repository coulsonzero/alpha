import { useState, useMemo } from "react";
import { Eye, Save, X, ChevronDown } from "lucide-react";
import { renderMarkdown } from "@/components/doc/DocRenderer";

const TAGS = [
  ["Frontend", "#a78bfa"],
  ["Backend", "#22d3ee"],
  ["Database", "#60a5fa"],
  ["DevOps", "#f59e0b"],
  ["API", "#f472b6"],
  ["Resources", "#34d399"],
] as const;

interface NewDocEditorProps {
  onClose: () => void;
}

export const NewDocEditor = ({ onClose }: NewDocEditorProps) => {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const rendered = useMemo(() => {
    if (!content) return null;
    return renderMarkdown(content);
  }, [content]);

  const selectedColor = TAGS.find(([t]) => t === selectedTag)?.[1];

  const handleSave = () => {
    if (!content.trim()) return;
    const title = prompt("Document title:", "Untitled");
    if (title) {
      const key = `docs-md:new/${title.replace(/\s+/g, "-").toLowerCase()}.md`;
      localStorage.setItem(key, content);
      if (selectedTag) {
        localStorage.setItem(`${key}:tag`, selectedTag);
      }
    }
    setContent("");
    setPreview(false);
    onClose();
  };

  return (
    <div className="max-w-3xl">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-white/80">New Document</h2>
          {/* Tag selector */}
          <div className="relative">
            <button
              onClick={() => setTagOpen(!tagOpen)}
              className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all duration-200"
              style={{
                borderColor: selectedColor ? `${selectedColor}50` : "rgba(255,255,255,0.1)",
                background: selectedColor ? `${selectedColor}18` : "rgba(255,255,255,0.04)",
                color: selectedColor || "rgba(255,255,255,0.5)",
              }}
            >
              {selectedTag || "Tag"}
              <ChevronDown size={10} className={`transition-transform duration-200 ${tagOpen ? "rotate-180" : ""}`} />
            </button>
            {tagOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setTagOpen(false)} />
                <div
                  className="absolute top-full mt-1.5 left-0 z-20 p-1 rounded-xl min-w-[130px]"
                  style={{
                    background: "rgba(16,10,28,0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {TAGS.map(([label, color]) => (
                    <button
                      key={label}
                      onClick={() => { setSelectedTag(label); setTagOpen(false); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 flex items-center gap-2"
                      style={{ color }}
                      onMouseEnter={(e) => e.currentTarget.style.background = `${color}15`}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
              preview
                ? "text-white shadow-[0_0_15px_rgba(76,201,240,0.2)] border border-blue-400/20"
                : "text-white/40 hover:text-white/70 border border-white/[0.06]"
            }`}
            style={preview ? { background: "linear-gradient(135deg, rgba(76,201,240,0.2), rgba(123,47,247,0.12))" } : { background: "rgba(255,255,255,0.03)" }}
          >
            <Eye size={12} /> Preview
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-all flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, rgba(76,201,240,0.25), rgba(123,47,247,0.2))", border: "1px solid rgba(76,201,240,0.2)" }}
          >
            <Save size={12} /> Save
          </button>
        </div>
      </div>

      {/* Editor / Preview area */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.25)" }}>
        {preview ? (
          <div className="p-6 min-h-[400px]">{rendered}</div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your markdown here..."
            className="w-full min-h-[400px] p-5 text-[13px] leading-[1.7] outline-none resize-none scrollbar-none"
            style={{ background: "transparent", color: "rgba(255,255,255,0.8)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
          />
        )}
      </div>
    </div>
  );
};
