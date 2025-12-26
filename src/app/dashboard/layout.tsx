"use client";

import type { ReactNode } from "react";
import {
    AuthLoading,
    RedirectToSignIn,
    SignedIn,
} from "@daveyplate/better-auth-ui";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>
            <div className="container mx-auto flex-1 p-4">
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

            <SignedIn>{children}</SignedIn>
        </>
    );
}
