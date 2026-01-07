"use client";

import { AuthView } from "@daveyplate/better-auth-ui";
import { use } from "react";

export default function AuthPage({
  params,
}: {
  params: Promise<{ pathname: string[] }>;
}) {
  const { pathname } = use(params);
  const path = pathname?.join("/") || "sign-in";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <AuthView pathname={path} />
    </div>
  );
}
