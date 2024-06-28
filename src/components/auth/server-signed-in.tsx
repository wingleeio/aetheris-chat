import { auth } from "@/lib/auth";

type ServerSignedInProps = {
    condition?: (user: NonNullable<ReturnType<typeof auth>["user"]>) => boolean;
} & (
    | {
          children: (user: NonNullable<ReturnType<typeof auth>["user"]>) => React.ReactNode;
      }
    | {
          children: React.ReactNode;
      }
);

export const ServerSignedIn = ({ children, condition }: ServerSignedInProps) => {
    const session = auth();

    if (!session.isAuthenticated) {
        return null;
    }

    if (condition && !condition(session.user)) {
        return null;
    }

    if (typeof children === "function") {
        return children(session.user);
    }
    return children;
};
