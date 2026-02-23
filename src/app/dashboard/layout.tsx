"use client";

import {
  AuthLoading,
  RedirectToSignIn,
  SignedIn,
} from "@daveyplate/better-auth-ui";
import type { ReactNode } from "react";
import AppSidebar from "@/components/app-sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Skeleton className="size-8" />
        <Skeleton className="h-6 w-24" />
        <div className="w-8" />
      </div>
      <div className="hidden w-64 border-r bg-sidebar p-4 lg:block">
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
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
        <SidebarProvider className="flex-col lg:flex-row">
          <MobileHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <main className="relative flex-1 p-6 md:p-8">
                <div className="mx-auto w-full">{children}</div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
