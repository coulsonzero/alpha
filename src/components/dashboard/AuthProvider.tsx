import { createContext, useContext, useState, type ReactNode } from "react";
import { AuthModal } from "./AuthModal";

interface AuthContextType {
  openAuth: (mode?: "login" | "signup") => void;
}

const AuthContext = createContext<AuthContextType>({ openAuth: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<"login" | "signup">("login");

  return (
    <AuthContext.Provider value={{ openAuth: (mode) => { setInitialMode(mode ?? "login"); setAuthOpen(true); } }}>
      {children}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} initialMode={initialMode} />}
    </AuthContext.Provider>
  );
};
