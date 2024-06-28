"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface NavigationItem {
    icon: React.ReactNode;
    name: string;
    href: string;
}

export const Navigation = ({
    items,
    activeClassName,
    baseClassName,
}: Readonly<{ items: NavigationItem[]; activeClassName: string; baseClassName: string }>) => {
    const pathname = usePathname();
    return (
        <Fragment>
            {items.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(baseClassName, item.href === pathname ? activeClassName : "")}
                >
                    {item.icon} {item.name}
                </Link>
            ))}
        </Fragment>
    );
};
