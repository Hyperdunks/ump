"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">Sentinel</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <SignedOut>
                            <Link href="/sign-in">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button>Get Started</Button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button>Dashboard</Button>
                            </Link>
                        </SignedIn>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex flex-1 flex-col items-center justify-center px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                        Monitor Your Services
                        <span className="block text-primary">With Confidence</span>
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                        Sentinel is your comprehensive uptime monitoring platform. Get
                        instant alerts when your services go down and keep your users happy.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <SignedOut>
                            <Link href="/sign-up">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Start Monitoring
                                </Button>
                            </Link>
                            <Link href="/sign-in">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Sign In
                                </Button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </SignedIn>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-24 grid max-w-5xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                        <div className="mb-4 text-3xl">🔔</div>
                        <h3 className="mb-2 text-lg font-semibold">Instant Alerts</h3>
                        <p className="text-sm text-muted-foreground">
                            Get notified immediately when your services experience downtime.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                        <div className="mb-4 text-3xl">📊</div>
                        <h3 className="mb-2 text-lg font-semibold">Uptime Reports</h3>
                        <p className="text-sm text-muted-foreground">
                            Track your service reliability with detailed uptime statistics.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                        <div className="mb-4 text-3xl">🌍</div>
                        <h3 className="mb-2 text-lg font-semibold">Global Monitoring</h3>
                        <p className="text-sm text-muted-foreground">
                            Monitor your services from multiple locations around the world.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-6">
                <div className="container mx-auto flex justify-center px-4">
                    <p className="text-sm text-muted-foreground">
                        © 2024 Sentinel. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
