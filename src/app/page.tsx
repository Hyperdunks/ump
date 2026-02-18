"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import { useSession } from "@/lib/auth-client";
import Section67 from "@/components/landing-section-3";
import Section76 from "@/components/landing-section-2";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect signed-in users to dashboard
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24">
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
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
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
      </section>

      {/* Section 76 - Features Timeline */}
      <Section76 />

      {/* Section 67 - Integration Tree */}
      <Section67 />

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto flex justify-center px-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Sentinel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
