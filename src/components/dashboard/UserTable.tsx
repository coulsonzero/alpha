import { Mail, Shield, MoreHorizontal } from "lucide-react";

const users = [
  {
    name: "Alex Morgan",
    email: "alex@nebula.io",
    role: "Admin",
    plan: "Pro",
    status: "active",
    joined: "Jan 12, 2026",
  },
  {
    name: "Sarah Chen",
    email: "sarah@nebula.io",
    role: "Editor",
    plan: "Team",
    status: "active",
    joined: "Feb 3, 2026",
  },
  {
    name: "Marcus Webb",
    email: "marcus@acme.co",
    role: "Viewer",
    plan: "Basic",
    status: "active",
    joined: "Mar 18, 2026",
  },
  {
    name: "Priya Kapoor",
    email: "priya@startup.io",
    role: "Editor",
    plan: "Team",
    status: "pending",
    joined: "Apr 2, 2026",
  },
  {
    name: "James Liu",
    email: "james@agency.com",
    role: "Viewer",
    plan: "Free",
    status: "inactive",
    joined: "May 10, 2026",
  },
];

const statusStyles: Record<string, string> = {
  active: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  pending: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  inactive: "text-white/30 bg-white/5 border-white/10",
};

const roleIcon: Record<string, React.ReactNode> = {
  Admin: <Shield size={10} />,
  Editor: <Shield size={10} />,
  Viewer: <Shield size={10} />,
};

interface UserTableProps {
  className?: string;
}

export const UserTable = ({ className = "" }: UserTableProps) => (
  <div
    className={`glass glass-hover noise rounded-3xl p-6 overflow-hidden animate-fade-in ${className}`}
    style={{ animationDelay: "0.6s" }}
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="text-xs text-white/40 font-medium tracking-widest uppercase">
          Team
        </p>
        <h4 className="text-lg font-semibold">Members</h4>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded-full">
          {users.length} total
        </span>
        <button className="glass rounded-xl
w-8 h-8 grid place-items-center hover:bg-white/10 transition-colors">
          <MoreHorizontal size={14} className="text-white/50" />
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto scrollbar-none">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {["User", "Role", "Plan", "Status", "Joined", ""].map(
              (h, i) => (
                <th
                  key={h}
                  className={`text-[10px] font-semibold tracking-wider uppercase text-white/30 pb-3 text-left ${
                    i === 0 ? "pr-4" : "px-3"
                  }`}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.email}
              className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${
                i === users.length - 1 ? "border-b-0" : ""
              }`}
            >
              {/* User */}
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[50%]
bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue grid place-items-center text-[10px] font-bold shrink-0">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{u.name}</p>
                    <p className="text-[10px] text-white/30 truncate flex items-center gap-1">
                      <Mail size={8} />
                      {u.email}
                    </p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="py-3 px-3">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  {roleIcon[u.role]}
                  {u.role}
                </div>
              </td>

              {/* Plan */}
              <td className="py-3 px-3">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                    u.plan === "Pro"
                      ? "text-neon-purple/80 bg-neon-purple/10 border-neon-purple/20"
                      : u.plan === "Team"
                        ? "text-neon-cyan/80 bg-neon-cyan/10 border-neon-cyan/20"
                        : u.plan === "Basic"
                          ? "text-neon-blue/70 bg-neon-blue/10 border-neon-blue/20"
                          : "text-white/40 bg-white/5 border-white/10"
                  }`}
                >
                  {u.plan}
                </span>
              </td>

              {/* Status */}
              <td className="py-3 px-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border ${
                    statusStyles[u.status]
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      u.status === "active"
                        ? "bg-emerald-400 animate-pulse"
                        : u.status === "pending"
                          ? "bg-amber-400"
                          : "bg-white/20"
                    }`}
                  />
                  {u.status}
                </span>
              </td>

              {/* Joined */}
              <td className="py-3 px-3">
                <span className="text-[10px] text-white/30">{u.joined}</span>
              </td>

              {/* Actions */}
              <td className="py-3 pl-3 text-right">
                <button className="w-7 h-7 rounded-lg glass grid place-items-center hover:bg-white/10 transition-colors">
                  <MoreHorizontal size={12} className="text-white/30" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
