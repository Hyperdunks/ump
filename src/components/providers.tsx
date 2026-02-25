"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const googleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryProvider>
        <AuthUIProviderTanstack
          authClient={authClient}
          navigate={router.push}
          replace={router.replace}
          persistClient={false} // Disabled to avoid stale state - session re-validates via cookie cache on reload
          onSessionChange={() => {
            router.refresh();
          }}
          Link={Link}
          basePath="/"
          {...(googleEnabled
            ? {
                social: {
                  providers: ["google"] as const,
                },
              }
            : {})}
          avatar={{
            upload: async (file: File) => {
              const formData = new FormData();
              formData.append("file", file);
              const res = await fetch("/api/user/image", {
                method: "POST",
                body: formData,
              });
              const result = await res.json();
              return result.blob?.url || result.data?.image;
            },
            delete: async () => {
              await fetch("/api/user/image", {
                method: "DELETE",
              });
            },
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
