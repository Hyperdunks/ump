"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type * as React from "react";
import { type ToasterProps } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// Separate component that can use useTheme because it's rendered INSIDE NextThemesProvider
function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme as ToasterProps["theme"]}
    />
  );
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <ThemedToaster />
    </NextThemesProvider>
  );
}
