"use client";

import type { ReactNode } from "react";
import {
  AuthLoading,
  RedirectToSignIn,
  SignedIn,
} from "@daveyplate/better-auth-ui";
import { Skeleton } from "@/components/ui/skeleton";
import TopNav from "@/components/top-nav";

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
          <Skeleton className="h-6 w-28" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthLoading>
        <DashboardSkeleton />
      </AuthLoading>

      <RedirectToSignIn />

      <SignedIn>
        <div className="flex min-h-screen flex-col">
          <TopNav />
          <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-8">
            {children}
          </main>
        </div>
      </SignedIn>
    </>
  );
}

