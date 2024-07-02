import "./globals.css";

import { ClientProvider } from "@/components/providers/client-provider";
import { Inter as FontSans } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Aetheris Chat",
    description: "Demo chat application using Aetheris and Next.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="absolute inset-0" suppressHydrationWarning>
            <body className={cn(fontSans.className, "min-h-full flex flex-col h-0")}>
                <Providers>
                    {children}
                    <Toaster position="bottom-center" />
                </Providers>
            </body>
        </html>
    );
}
