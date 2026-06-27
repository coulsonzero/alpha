import { useState } from "react";
import { Plus, Check, Trash2, Circle } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
}

const initialTodos: Todo[] = [
  { id: 1, text: "Review Q3 financial report", done: false, priority: "high" },
  { id: 2, text: "Approve new onboarding flow", done: false, priority: "high" },
  { id: 3, text: "Update pricing page copy", done: true, priority: "medium" },
  { id: 4, text: "Schedule team retro", done: false, priority: "medium" },
  { id: 5, text: "Check server logs", done: true, priority: "low" },
];

const priorityColors: Record<string, string> = {
  high: "bg-neon-pink/60 shadow-[0_0_6px_hsl(var(--neon-pink)/0.5)]",
  medium: "bg-neon-cyan/60 shadow-[0_0_6px_hsl(var(--neon-cyan)/0.5)]",
  low: "bg-white/20",
};

const priorityBadge: Record<string, string> = {
  high: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  medium: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
  low: "text-white/30 bg-white/5 border-white/10",
};

export const TodoCard = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [input, setInput] = useState("");

  const toggle = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const remove = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const add = () => {
    const text = input.trim();
    if (!text) return;
    const maxId = todos.reduce((m, t) => Math.max(m, t.id), 0);
    setTodos((prev) => [
      ...prev,
      { id: maxId + 1, text, done: false, priority: "medium" as const },
    ]);
    setInput("");
  };

  const remaining = todos.filter((t) => !t.done).length;
  const total = todos.length;

  return (
    <div className="glass glass-hover noise rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[50%]
bg-gradient-to-br from-neon-pink to-neon-purple grid place-items-center shadow-lg">
            <Circle size={12} fill="currentColor" className="text-white/80" />
          </div>
          <div>
            <p className="text-xs text-white/40 font-medium tracking-widest uppercase">
              Tasks
            </p>
            <h4 className="text-sm font-semibold">To Do</h4>
          </div>
        </div>
        <span className="text-[10px] text-white/30 tabular-nums">
          {remaining}/{total} left
        </span>
      </div>

      {/* Add input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task..."
          className="flex-1 bg-white/5 rounded-xl
px-3 py-2 text-xs outline-none placeholder:text-white/20 focus:bg-white/8 focus:ring-1 focus:ring-neon-purple/20 transition-all"
        />
        <button
          onClick={add}
          className="w-8 h-8 rounded-[50%]
bg-gradient-to-br from-neon-purple to-neon-cyan grid place-items-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Todo list */}
      <div className="space-y-1">
        {todos.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-2.5 rounded-xl
transition-all duration-200 group ${
              t.done ? "opacity-40" : "hover:bg-white/5"
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggle(t.id)}
              className={`w-5 h-5 rounded-md grid place-items-center shrink-0 transition-all duration-200 border ${
                t.done
                  ? "bg-neon-cyan/30 border-neon-cyan/50"
                  : "border-white/15 hover:border-white/30"
              }`}
            >
              {t.done && <Check size={10} className="text-neon-cyan" />}
            </button>

            {/* Text */}
            <span
              className={`text-xs flex-1 transition-all ${
                t.done
                  ? "line-through text-white/25"
                  : "text-white/80"
              }`}
            >
              {t.text}
            </span>

            {/* Priority dot */}
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityColors[t.priority]}`}
            />

            {/* Priority badge */}
            <span
              className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${
                priorityBadge[t.priority]
              }`}
            >
              {t.priority}
            </span>

            {/* Delete */}
            <button
              onClick={() => remove(t.id)}
              className="w-6 h-6 rounded-lg grid place-items-center opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all shrink-0"
            >
              <Trash2 size={10} className="text-white/30" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
