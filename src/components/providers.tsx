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
