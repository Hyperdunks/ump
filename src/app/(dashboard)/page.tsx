"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { UserButton } from "@daveyplate/better-auth-ui";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className="flex min-h-screen flex-col">
            {/* Dashboard Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">Sentinel</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="container mx-auto flex-1 p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Here&apos;s an overview of your monitored services.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Monitors</CardDescription>
                            <CardTitle className="text-4xl">0</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                No monitors configured yet
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Uptime (30 days)</CardDescription>
                            <CardTitle className="text-4xl">--</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Start monitoring to see stats
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Active Incidents</CardDescription>
                            <CardTitle className="text-4xl">0</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">All systems normal</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Get Started Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Get Started</CardTitle>
                        <CardDescription>
                            You&apos;re all set up! Here are some things you can do next.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h3 className="font-medium">Add Your First Monitor</h3>
                                <p className="text-sm text-muted-foreground">
                                    Start tracking the uptime of your websites and APIs.
                                </p>
                            </div>
                            <Button disabled>Coming Soon</Button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h3 className="font-medium">Configure Notifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    Set up email or webhook notifications for downtime alerts.
                                </p>
                            </div>
                            <Button disabled variant="outline">
                                Coming Soon
                            </Button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h3 className="font-medium">Invite Team Members</h3>
                                <p className="text-sm text-muted-foreground">
                                    Collaborate with your team on monitoring.
                                </p>
                            </div>
                            <Button disabled variant="outline">
                                Coming Soon
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}