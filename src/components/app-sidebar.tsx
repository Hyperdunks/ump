"use client";

import { UserButton, UserAvatar } from "@daveyplate/better-auth-ui";
import { useSession } from "@/lib/auth-client";
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
import { CreateMonitorModal } from "@/components/monitors/create-monitor-modal";
import { CreateStatusPageModal } from "@/components/status-pages/create-status-page-modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useMonitors } from "@/hooks/api";
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
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Activity className="size-4 bg-primary-background" />
                </div>
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
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-6"
                  onClick={() => setCreateMonitorOpen(true)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
              <SidebarGroupContent>
                <ScrollArea className="max-h-32">
                  {monitors.slice(0, 4).map((monitor) => (
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
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Status Pages Section */}
            <SidebarGroup>
              <div className="flex items-center justify-between px-2">
                <SidebarGroupLabel className="p-0">
                  Status Pages ({publicMonitors.length})
                </SidebarGroupLabel>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-6"
                  onClick={() => setCreateStatusPageOpen(true)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
              <SidebarGroupContent>
                <ScrollArea className="max-h-32">
                  {publicMonitors.slice(0, 4).map((monitor) => (
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
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {state === "expanded" ? (
          <UserButton side="right" size="default" className="bg-primary-foreground text-foreground hover:bg-muted-foreground/20" />
        ) : (
          <UserButton size="icon" side="right" className="bg-primary-foreground text-foreground hover:bg-muted-foreground/20" />
        )}
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
