import { MyCommunities } from "@/components/communities/my-communities";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-full bg-muted">
            <div className="w-[64px] flex flex-col pl-2 py-2 gap-2">
                <Link
                    href="/"
                    className="w-full h-14 rounded-sm text-muted-foreground text-2xl flex justify-center items-center"
                >
                    <FaHome />
                </Link>
                <MyCommunities />
            </div>
            <div className="flex-grow">{children}</div>
        </div>
    );
}
