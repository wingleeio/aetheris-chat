import { auth } from "@/lib/auth";

type ServerSignedInProps =
    | {
          children: (user: NonNullable<ReturnType<typeof auth>["user"]>) => React.ReactNode;
      }
    | {
          children: React.ReactNode;
      };

export const ServerSignedIn = ({ children }: ServerSignedInProps) => {
    const session = auth();
    if (!session.isAuthenticated) {
        return null;
    }
    if (typeof children === "function") {
        return children(session.user);
    }
    return children;
};
