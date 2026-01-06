import { createContext, type ReactNode } from "react";
import { useProvideAuth } from "@/hooks/index.js";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  register: (formData: any) => Promise<any>;
  login: (formData: any) => Promise<any>;
  googleLogin: (credential: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

export const UserContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth() as AuthContextType;

  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
