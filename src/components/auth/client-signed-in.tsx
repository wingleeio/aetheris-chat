"use client";

import { useAuth } from "@/hooks/use-auth";

type ClientSignedInProps =
    | {
          children: (user: NonNullable<ReturnType<typeof useAuth>["user"]>) => React.ReactNode;
      }
    | {
          children: React.ReactNode;
      };

export const ClientSignedIn = ({ children }: ClientSignedInProps) => {
    const session = useAuth();
    if (!session.isAuthenticated) {
        return null;
    }
    if (typeof children === "function") {
        return children(session.user);
    }
    return children;
};
