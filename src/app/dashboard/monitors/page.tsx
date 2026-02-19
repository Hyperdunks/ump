"use client";

import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMonitors } from "@/hooks/api";
import { cn } from "@/lib/utils";

const statusCardConfig = [
  {
    label: "Normal",
    key: "normal" as const,
    color:
      "text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-400 ring-green-200 dark:ring-green-900",
  },
  {
    label: "Degraded",
    key: "degraded" as const,
    color:
      "text-yellow-700 bg-yellow-50 dark:bg-yellow-950/40 dark:text-yellow-400 ring-yellow-200 dark:ring-yellow-900",
  },
  {
    label: "Failing",
    key: "failing" as const,
    color:
      "text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400 ring-red-200 dark:ring-red-900",
  },
  {
    label: "Inactive",
    key: "inactive" as const,
    color:
      "text-gray-700 bg-gray-50 dark:bg-gray-950/40 dark:text-gray-400 ring-gray-200 dark:ring-gray-800",
  },
] as const;

export default function MonitorsListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMonitors({ page, limit: 20 });

  const statusCounts = {
    normal: 0,
    degraded: 0,
    failing: 0,
    inactive: 0,
  };

  if (data?.data) {
    for (const monitor of data.data) {
      if (!monitor.isActive) {
        statusCounts.inactive++;
      } else {
        // List endpoint doesn't include latestCheck; active monitors shown as "normal"
        statusCounts.normal++;
      }
    }
  }

  const monitors = data?.data ?? [];
  const pagination = data?.pagination;

  const filtered = monitors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Monitors</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your monitors.
            </p>
          </div>
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Create Monitor
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {["a", "b", "c", "d", "e"].map((id) => (
            <Card key={id} size="sm">
              <CardHeader>
                <Skeleton className="h-4 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-8" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Skeleton className="h-10 w-full max-w-sm" />

        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 pl-4">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Incident</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>P50</TableHead>
                <TableHead>P90</TableHead>
                <TableHead>P95</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {["a", "b", "c", "d", "e"].map((id) => (
                <TableRow key={id}>
                  <TableCell className="pl-4">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Monitors</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your monitors.
            </p>
          </div>
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Create Monitor
          </Button>
        </div>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load monitors. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Monitors</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your monitors.
          </p>
        </div>
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Create Monitor
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {statusCardConfig.map((card) => (
          <Card key={card.label} size="sm" className={cn("ring-1", card.color)}>
            <CardHeader>
              <CardTitle className="text-xs font-medium opacity-80">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-lg font-bold">
                {statusCounts[card.key]}
              </span>
            </CardContent>
          </Card>
        ))}

        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Slowest P95
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-bold">—</span>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Filter by name, url, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {monitors.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-sm space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No monitors yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first monitor to track uptime and
              performance.
            </p>
            <Button>
              <Plus className="size-4" data-icon="inline-start" />
              Create Monitor
            </Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            No monitors match your search.
          </p>
        </Card>
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 pl-4">
                  <Checkbox aria-label="Select all" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Incident</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>P50</TableHead>
                <TableHead>P90</TableHead>
                <TableHead>P95</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((monitor) => (
                <TableRow
                  key={monitor.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/monitors/${monitor.id}`)
                  }
                >
                  <TableCell
                    className="pl-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox aria-label={`Select ${monitor.name}`} />
                  </TableCell>
                  <TableCell className="font-medium">{monitor.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={monitor.isActive ? "default" : "secondary"}
                      className={
                        monitor.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : ""
                      }
                    >
                      {monitor.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" />}
                      >
                        <MoreHorizontal className="size-4 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit monitor</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && (
            <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
              <span>
                {filtered.length} of {pagination.total} row(s)
                {search && " filtered"}.
              </span>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text=""
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={
                        page <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter((p) => {
                      if (p === 1 || p === pagination.totalPages) return true;
                      if (Math.abs(p - page) <= 1) return true;
                      return false;
                    })
                    .map((p, i, arr) => (
                      <PaginationItem key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      text=""
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < pagination.totalPages) setPage(page + 1);
                      }}
                      className={
                        page >= pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
