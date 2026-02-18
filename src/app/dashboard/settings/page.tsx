"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, ExternalLink } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession, authClient } from "@/lib/auth-client";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/settings" />}>
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>General</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">General</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings.
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {user?.image && <AvatarImage src={user.image} />}
              <AvatarFallback>
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium">{user?.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="pt-4">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/account/settings" />}
          >
            <Settings className="size-3.5" data-icon="inline-start" />
            Manage Account
            <ExternalLink className="size-3" data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={handleSignOut}>
            <LogOut className="size-3.5" data-icon="inline-start" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
