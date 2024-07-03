import { HomeContainer } from "@/components/home/home-container";
import { HomeSidebar } from "@/components/home/home-sidebar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full p-2">
            <div className="flex h-full overflow-hidden bg-muted rounded-sm">
                <HomeSidebar />
                <HomeContainer>{children}</HomeContainer>
            </div>
        </div>
    );
}
