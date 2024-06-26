import { useAuth } from "@/hooks/use-auth";

export const ClientSignedOut = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const session = useAuth();
    if (session.isAuthenticated) {
        return null;
    }
    return children;
};
