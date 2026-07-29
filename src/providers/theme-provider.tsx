"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { DEFAULT_THEME } from "@/config/theme";

/**
 * Wraps next-themes. Uses class strategy: adds `.light` class to <html> for
 * light mode, absence of it means dark (dark tokens are the :root default —
 * see styles/globals.css). Dark mode is the default experience.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem
      value={{ light: "light", dark: "dark", system: "system" }}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
