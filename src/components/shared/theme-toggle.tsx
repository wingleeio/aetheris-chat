"use client";

import * as React from "react";

import { FaMoon, FaSun } from "react-icons/fa";

import { useTheme } from "next-themes";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            className="w-12 h-12 rounded-sm text-muted-foreground text-2xl flex justify-center items-center hover:text-indigo-500"
            onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
            }}
        >
            <FaSun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <FaMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
