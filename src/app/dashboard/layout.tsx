"use client";

import type { ReactNode } from "react";
import {
  AuthLoading,
  RedirectToSignIn,
  SignedIn,
} from "@daveyplate/better-auth-ui";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r bg-sidebar p-4 md:block">
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6">
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
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* Mobile header with sidebar trigger */}
            <header className="flex h-14 shrink-0 items-center border-b px-4 md:hidden">
              <SidebarTrigger className="-ml-1" />
              <span className="ml-3 font-semibold">Sentinel</span>
            </header>
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="mx-auto w-full max-w-[1600px]">{children}</div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
