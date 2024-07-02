import { auth } from "@/lib/auth";

export const ServerSignedOut = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const session = auth();
    if (session.isAuthenticated) {
        return null;
    }
    return children;
};
