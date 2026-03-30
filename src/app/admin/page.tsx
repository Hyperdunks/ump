"use client";

import { Shield, Siren, Users, Waypoints } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { userColumns } from "@/app/admin/users-columns";
import { UsersDataTable } from "@/app/admin/users-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats, useAdminUsers, useUserProfile } from "@/hooks/api";
import { useSession } from "@/lib/auth-client";

const PAGE_SIZE = 15;

export default function AdminPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: session, isPending } = useSession();
  const { data: profile, isLoading: profileLoading } = useUserProfile({
    enabled: !isPending && !!session?.user,
  });

  const isAdmin = profile?.isAdmin === true;
  const canLoadAdminData = !isPending && !!session?.user && isAdmin;

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }
    if (!profileLoading && !profile) {
      router.replace("/sign-in");
      return;
    }
    if (!profileLoading && profile && !profile.isAdmin) {
      router.replace("/dashboard");
    }
  }, [isPending, profile, profileLoading, router, session?.user]);

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useAdminStats({ enabled: canLoadAdminData });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useAdminUsers(
    {
      page,
      limit: PAGE_SIZE,
    },
    { enabled: canLoadAdminData },
  );

  const cards = useMemo(
    () => [
      {
        label: "Total Users",
        value: stats?.users ?? 0,
        icon: Users,
      },
      {
        label: "Total Monitors",
        value: stats?.monitors ?? 0,
        icon: Waypoints,
      },
      {
        label: "Active Monitors",
        value: stats?.activeMonitors ?? 0,
        icon: Shield,
      },
      {
        label: "Open Incidents",
        value: stats?.openIncidents ?? 0,
        icon: Siren,
      },
    ],
    [stats],
  );

  if (isPending || profileLoading || !session?.user || !isAdmin) {
    return (
      <div className="space-y-6 p-4 sm:p-6 md:p-8">
        <div>
          <Skeleton className="h-7 w-36" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} size="sm">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-14" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide overview and user management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} size="sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-7 w-14" />
              ) : (
                <p className="text-2xl font-semibold">{card.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        {usersError || statsError ? (
          <div className="p-6 text-sm text-destructive">
            Failed to load admin data.
          </div>
        ) : usersLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <UsersDataTable
            columns={userColumns}
            data={usersData?.data ?? []}
            pagination={
              usersData?.pagination ?? {
                page,
                limit: PAGE_SIZE,
                total: 0,
                totalPages: 1,
              }
            }
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
