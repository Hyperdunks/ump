"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryProvider>
        <AuthUIProviderTanstack
          authClient={authClient}
          navigate={router.push}
          replace={router.replace}
          persistClient={false}
          onSessionChange={() => {
            router.refresh();
          }}
          Link={Link}
          basePath="/"
          social={{
            providers: ["google"],
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthUIProviderTanstack>
      </AuthQueryProvider>
    </QueryClientProvider>
  );
}
