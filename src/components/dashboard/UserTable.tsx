import { useState, useEffect, useCallback } from "react";
import { Mail, Shield, MoreHorizontal, Globe } from "lucide-react";
import { getUsers } from "@/api/user";
import { resolveAvatar } from "@/lib/avatar";
import { useAuth } from "@/components/dashboard/AuthProvider";

interface User {
  ID?: number;
  username?: string;
  email?: string;
  website?: string;
  status?: string;
  avatar?: string;
}

const statusStyles: Record<string, string> = {
  active: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  pending: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  inactive: "text-white/30 bg-white/5 border-white/10",
};

interface UserTableProps {
  className?: string;
}

export const UserTable = ({ className = "" }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  const fetchUsers = useCallback(() => {
    setLoading(true);
    getUsers()
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // refresh user list when login state changes
  useEffect(() => {
    fetchUsers();
  }, [user, fetchUsers]);

  const userList = users.map((u) => ({
    name: u.username || "Unknown",
    email: u.email || "",
    website: u.website || "",
    avatar: u.avatar || "",
    role: u.status === "active" ? "Active" : u.status === "pending" ? "Pending" : "Inactive",
    status: u.status || "inactive",
  }));

  return (
    <div
      className={`glass glass-hover noise rounded-3xl p-6 overflow-hidden animate-fade-in ${className}`}
      style={{ animationDelay: "0.6s" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Users
          </p>
          <h4 className="text-lg font-semibold">User List</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded-full">
            {users.length} total
          </span>
          <button className="glass rounded-xl w-8 h-8 grid place-items-center hover:bg-white/10 transition-colors">
            <MoreHorizontal size={14} className="text-white/50" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-none">
        {loading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-white/5" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-1/3 rounded-lg bg-white/5" />
                  <div className="h-3 w-1/4 rounded-lg bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-10 text-white/30">
            <Globe size={24} />
            <p className="text-xs">Failed to load users</p>
          </div>
        ) : (
          <div>
            {/* Column headers */}
            <div className="flex items-center gap-4 px-3 pb-3 text-[10px] font-semibold tracking-wider uppercase text-white/30">
              <div className="flex-1 min-w-0">Name</div>
              <div className="min-w-0 flex-[1.5]">Email</div>
              <div className="min-w-0 flex-1">Website</div>
              <div className="shrink-0 w-[80px]">Status</div>
              <div className="shrink-0 w-7" />
            </div>
            <div className="space-y-2">
              {userList.map((u, i) => (
                <div
                  key={u.email || i}
                  className="flex items-center gap-4 px-3 py-[10px] rounded-xl border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                >
                  {/* User */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-[50%] shrink-0
bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue grid place-items-center text-[10px] font-bold overflow-hidden">
                      {resolveAvatar(u.avatar) ? (
                        <img src={resolveAvatar(u.avatar)!} alt="" className="w-full h-full object-cover" />
                      ) : (
                        u.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <p className="text-xs font-semibold truncate">{u.name}</p>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 text-xs text-white/50 min-w-0 flex-[1.5]">
                    <Mail size={10} className="shrink-0" />
                    <span className="truncate">{u.email || "—"}</span>
                  </div>

                  {/* Website */}
                  <div className="flex items-center gap-1.5 text-xs text-white/50 min-w-0 flex-1">
                    <Globe size={10} className="shrink-0" />
                    <span className="truncate">{u.website || "—"}</span>
                  </div>

                  {/* Status */}
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border ${
                        statusStyles[u.status] || statusStyles.inactive
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
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <button className="w-7 h-7 rounded-lg glass grid place-items-center hover:bg-white/10 transition-colors">
                      <MoreHorizontal size={12} className="text-white/30" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </div>
        )}
      </div>
    </div>
  );
};
