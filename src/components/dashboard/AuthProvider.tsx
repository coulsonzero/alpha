import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthModal } from "./AuthModal";
import { getMe, logout as logoutApi } from "@/api/auth";
import { toast } from "sonner";

// undefined = still loading, null = logged out, User = logged in
type UserState = User | null | undefined;

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

interface AuthContextType {
  user: UserState;
  openAuth: (mode?: "login" | "signup") => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  openAuth: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<UserState>(undefined);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { setUser(null); return; }
    try {
      const res = await getMe();
      setUser(res.data.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        openAuth: (mode) => { setInitialMode(mode ?? "login"); setAuthOpen(true); },
        logout: () => {
          logoutApi().catch(() => {});
          localStorage.removeItem("token");
          setUser(null);
          toast.success("Signed out");
        },
        refreshUser,
      }}
    >
      {children}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          initialMode={initialMode}
          onAuthSuccess={refreshUser}
        />
      )}
    </AuthContext.Provider>
  );
};
