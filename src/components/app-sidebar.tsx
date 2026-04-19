"use client";

import { UserAvatar, UserButton } from "@daveyplate/better-auth-ui";
import {
  Activity,
  AlertTriangle,
  Bell,
  Files,
  LayoutGrid,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { CreateMonitorModal } from "@/components/monitors/create-monitor-modal";
import { CreateStatusPageModal } from "@/components/status-pages/create-status-page-modal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMonitors } from "@/hooks/api";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/monitors", label: "Monitors", icon: Activity },
  { href: "/dashboard/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/status", label: "Status Pages", icon: Files },
] as const;

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { data: session } = useSession();
  const { data: monitorsData } = useMonitors();
  const monitors = monitorsData?.data ?? [];
  const publicMonitors = monitors.filter((m) => m.isPublic);
  const [createMonitorOpen, setCreateMonitorOpen] = useState(false);
  const [createStatusPageOpen, setCreateStatusPageOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {state === "expanded" && (
              <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
                <BrandLogo size={32} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Sentinel</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Uptime Monitoring
                  </span>
                </div>
              </SidebarMenuButton>
            )}
            <SidebarTrigger className="hidden lg:flex ml-auto" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="flex-1 overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {state === "expanded" && (
          <>
            {/* Monitors Section */}
            <SidebarGroup>
              <div className="flex items-center justify-between px-2">
                <SidebarGroupLabel className="p-0">
                  Monitors ({monitors.length})
                </SidebarGroupLabel>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-6"
                        onClick={() => setCreateMonitorOpen(true)}
                      />
                    }
                  >
                    <Plus className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    Add Monitor
                  </TooltipContent>
                </Tooltip>
              </div>
              <SidebarGroupContent>
                <div className="max-h-52 overflow-y-auto">
                  {monitors.map((monitor) => (
                    <SidebarMenuButton
                      key={monitor.id}
                      render={
                        <Link href={`/dashboard/monitors/${monitor.id}`} />
                      }
                      className="flex w-full items-center justify-between pr-4"
                    >
                      <span className="truncate">{monitor.name}</span>
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          monitor.latestCheck?.status === "up" &&
                            "bg-green-500",
                          monitor.latestCheck?.status === "degraded" &&
                            "bg-yellow-500",
                          monitor.latestCheck?.status === "down" &&
                            "bg-red-500 animate-pulse",
                        )}
                      />
                    </SidebarMenuButton>
                  ))}
                  {monitors.length === 0 && (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      No monitors found
                    </p>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Status Pages Section */}
            <SidebarGroup>
              <div className="flex items-center justify-between px-2">
                <SidebarGroupLabel className="p-0">
                  Status Pages ({publicMonitors.length})
                </SidebarGroupLabel>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-6"
                        onClick={() => setCreateStatusPageOpen(true)}
                      />
                    }
                  >
                    <Plus className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    Add Status Page
                  </TooltipContent>
                </Tooltip>
              </div>
              <SidebarGroupContent>
                <div className="max-h-52 overflow-y-auto">
                  {publicMonitors.map((monitor) => (
                    <SidebarMenuButton
                      key={monitor.id}
                      render={<Link href={`/status/${monitor.id}`} />}
                      className="flex w-full items-center justify-between pr-4"
                    >
                      <span className="truncate">{monitor.name}</span>
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          monitor.latestCheck?.status === "up" &&
                            "bg-green-500",
                          monitor.latestCheck?.status === "degraded" &&
                            "bg-yellow-500",
                          monitor.latestCheck?.status === "down" &&
                            "bg-red-500 animate-pulse",
                        )}
                      />
                    </SidebarMenuButton>
                  ))}
                  {publicMonitors.length === 0 && (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      No public status pages
                    </p>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex flex-col gap-2 w-full">
          <ModeToggle />
          {state === "expanded" ? (
            <UserButton
              size="default"
              side="right"
              className="bg-primary-foreground text-foreground hover:bg-muted-foreground/20 w-full"
            />
          ) : (
            <UserButton
              size="icon"
              side="right"
              className="bg-primary-foreground text-foreground hover:bg-muted-foreground/20"
            />
          )}
        </div>
      </SidebarFooter>

      <CreateMonitorModal
        open={createMonitorOpen}
        onOpenChange={setCreateMonitorOpen}
      />
      <CreateStatusPageModal
        open={createStatusPageOpen}
        onOpenChange={setCreateStatusPageOpen}
        monitors={monitors}
      />
    </Sidebar>
  );
}
