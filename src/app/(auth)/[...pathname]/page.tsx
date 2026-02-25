"use client";

import { AuthView } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { use } from "react";

export default function AuthPage({
  params,
}: {
  params: Promise<{ pathname: string[] }>;
}) {
  const { pathname } = use(params);
  const path = pathname?.join("/") || "sign-in";
  const showVerificationHelp = path === "sign-in";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <AuthView
        pathname={path}
        cardFooter={
          showVerificationHelp ? (
            <div className="text-center text-sm text-muted-foreground">
              Need a new verification email?{" "}
              <Link
                href="/verify-email"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Send verification link
              </Link>
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
