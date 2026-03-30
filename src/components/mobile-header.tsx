"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
      <SidebarTrigger />
      <Link href="/dashboard" className="flex items-center gap-2">
        <BrandLogo size={28} />
        <span className="font-semibold">Sentinel</span>
      </Link>
      <div className="w-8" />
    </header>
  );
}
