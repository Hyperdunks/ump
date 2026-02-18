"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Activity,
    Files,
    Bell,
    Settings,
    Plus,
    HelpCircle,
} from "lucide-react";
import { UserButton } from "@daveyplate/better-auth-ui";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/dashboard/monitors", label: "Monitors", icon: Activity },
    { href: "/dashboard/status-pages", label: "Status Pages", icon: Files },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export default function AppSidebar(
    props: React.ComponentProps<typeof Sidebar>,
) {
    const pathname = usePathname();

    function isActive(href: string) {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            {/* Logo */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={<Link href="/dashboard" />}
                        >
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Activity className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Sentinel</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    Uptime Monitoring
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
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

                {/* Status Pages Section */}
                <SidebarGroup>
                    <div className="flex items-center justify-between px-2">
                        <SidebarGroupLabel className="p-0">Status Pages (0)</SidebarGroupLabel>
                        <Button variant="ghost" size="icon-sm" className="size-6">
                            <Plus className="size-3" />
                        </Button>
                    </div>
                    <SidebarGroupContent>
                        <p className="px-3 py-2 text-sm text-muted-foreground">
                            No status pages found
                        </p>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Monitors Section */}
                <SidebarGroup>
                    <div className="flex items-center justify-between px-2">
                        <SidebarGroupLabel className="p-0">Monitors (0)</SidebarGroupLabel>
                        <Button variant="ghost" size="icon-sm" className="size-6">
                            <Plus className="size-3" />
                        </Button>
                    </div>
                    <SidebarGroupContent>
                        <p className="px-3 py-2 text-sm text-muted-foreground">
                            No monitors found
                        </p>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <HelpCircle />
                            <span>Get Help</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <UserButton side="right" align="start" />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
