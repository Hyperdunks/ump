"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu } from "lucide-react";
import { UserButton } from "@daveyplate/better-auth-ui";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Monitors" },
  { href: "/dashboard/incidents", label: "Incidents" },
  { href: "/dashboard/alerts", label: "Alerts" },
] as const;

function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" || pathname.startsWith("/dashboard/monitors")
      );
    }
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg transition-colors hover:text-foreground"
        >
          <Activity className="size-5" />
          <span className="hidden sm:inline">Sentinel</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <UserButton side="bottom" align="end" size="icon" />

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Sentinel
            </SheetTitle>
          </SheetHeader>

          <Separator />

          <nav className="flex flex-col gap-1 px-2 py-4">
            {navLinks.map((link) => (
              <SheetClose key={link.href} render={<Link href={link.href} />}>
                <span
                  className={cn(
                    "flex w-full rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </span>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default TopNav;
