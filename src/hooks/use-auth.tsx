"use client";

import { api } from "@/lib/api";
import { createContext, useContext } from "react";

type UserFromSession = Awaited<ReturnType<typeof api.auth.getSession>>;

export type UseAuthReturn =
    | {
          user: NonNullable<UserFromSession>;
          isAuthenticated: true;
      }
    | {
          user: null;
          isAuthenticated: false;
      };

const AuthContext = createContext<UseAuthReturn>({
    isAuthenticated: false,
    user: null,
});

type AuthProviderProps = {
    session: UseAuthReturn;
    children: React.ReactNode;
};

export const AuthProvider = ({ session, children }: AuthProviderProps) => {
    return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
