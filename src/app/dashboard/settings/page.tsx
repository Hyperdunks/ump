"use client";

import Link from "next/link";
import { Settings, MoreHorizontal, Lock } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";

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
  const user = session?.user;
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "user@example.com";

  return (
    <div className="max-w-4xl space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
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
          Manage your workspace settings.
        </p>
      </div>

      {/* Workspace Section */}
      <Card className="overflow-hidden">
        <CardContent className="border-b p-6">
          <CardTitle className="text-sm">Workspace</CardTitle>
          <CardDescription className="mt-1">
            Manage your workspace name.
          </CardDescription>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium">Name</label>
            <Input defaultValue="My Workspace" />
          </div>
        </CardContent>
        <CardFooter className="justify-end bg-muted/30 px-6 py-3">
          <Button>Submit</Button>
        </CardFooter>
      </Card>

      {/* Slug Section */}
      <Card>
        <CardContent className="p-6">
          <CardTitle className="text-sm">Slug</CardTitle>
          <CardDescription className="mt-1">
            The unique slug for your workspace.
          </CardDescription>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-muted/20 px-3.5 py-2.5 text-sm font-medium">
              my-workspace
              <button className="ml-2 text-muted-foreground hover:text-foreground">
                ❐
              </button>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Used when interacting with the API or for help on Discord.{" "}
            <span className="font-medium text-foreground">Let us know</span> if
            you&apos;d like to change it.
          </p>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <CardTitle className="text-sm">Team</CardTitle>
          <CardDescription className="mb-4 mt-1">
            Manage your team members.
          </CardDescription>

          {/* Tabs */}
          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="mt-4">
              {/* Table Header */}
              <div className="mb-4 grid grid-cols-4 px-2 text-xs font-medium text-muted-foreground">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Created</div>
              </div>

              {/* Team Member Row */}
              <div className="grid grid-cols-4 items-center rounded-md px-2 py-2 text-sm hover:bg-muted/30">
                <div className="font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground">
                  {displayEmail}
                </div>
                <div className="text-muted-foreground">owner</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    February 15, 2026
                  </span>
                  <MoreHorizontal className="size-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>

              {/* Add Member Input */}
              <div className="mt-6 border-t border-dashed pt-4">
                <label className="mb-1.5 block text-xs font-medium">
                  Add member
                </label>
                <Input type="email" placeholder="Email" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Send an invitation to join the team.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <p className="py-8 text-center text-sm text-muted-foreground">
                No pending invitations.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="items-center justify-between border-t bg-muted/30 px-6 py-3">
          <span className="text-xs font-medium">
            This feature is available on the Pro plan.
          </span>
          <Button size="sm">
            <Lock className="size-3" data-icon="inline-start" />
            Upgrade
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
