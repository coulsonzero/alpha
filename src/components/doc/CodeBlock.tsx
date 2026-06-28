import { useState, useMemo } from "react";
import hljs from "highlight.js";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps { code: string; lang: string; }

/** Normalize language aliases so highlight.js can detect them */
export function normalizeLang(lang: string): string {
  const map: Record<string, string> = {
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    bash: "bash",
    bat: "dos",
    cmd: "dos",
    dos: "dos",
    py: "python",
    js: "javascript",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
    rb: "ruby",
    rs: "rust",
    go: "go",
    sql: "sql",
    json: "json",
    yml: "yaml",
    yaml: "yaml",
    md: "markdown",
    mdx: "markdown",
    html: "xml",
    hbs: "handlebars",
    txt: "plaintext",
    text: "plaintext",
    plain: "plaintext",
    redis: "redis",
  };
  return map[lang.toLowerCase()] || lang;
}

export const CodeBlock = ({ code, lang }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  const html = useMemo(() => {
    if (!code) return "";
    const l = normalizeLang(lang || "");
    try {
      if (l && hljs.getLanguage(l)) {
        return hljs.highlight(code, { language: l }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch {
      return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }, [code, lang]);

  const displayLang = lang || (() => {
    try {
      return hljs.highlightAuto(code).language || "";
    } catch { return ""; }
  })();
  return (
    <div className="my-5 rounded-2xl overflow-hidden border backdrop-blur-sm" style={{ borderColor: "rgba(255,255,255,0.07)", background: "linear-gradient(135deg, rgba(13,17,23,0.95), rgba(22,27,34,0.9))", boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="flex items-center justify-between px-5 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)" }}>
        <span className="text-[11px] font-mono font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1.5 text-[11px] transition-all" style={{ color: copied ? "#7ee787" : "rgba(255,255,255,0.35)" }}>
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <div className="flex overflow-x-auto scrollbar-none">
        <div className="select-none text-right px-4 py-4 text-[13px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", minWidth: `${String(lines.length).length + 2.5}ch`, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="flex-1 p-4 text-[13px] leading-[1.8] overflow-x-auto scrollbar-none" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
          dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};
