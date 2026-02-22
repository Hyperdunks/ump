"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
      <SidebarTrigger />
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="size-4" />
        </div>
        <span className="font-semibold">Sentinel</span>
      </Link>
      <div className="w-8" />
    </header>
  );
}
