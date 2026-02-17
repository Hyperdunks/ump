"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// TODO: Replace with TanStack Query hook
const statusCards = [
    { label: "Normal", value: "1", color: "text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-400 ring-green-200 dark:ring-green-900" },
    { label: "Degraded", value: "0", color: "text-yellow-700 bg-yellow-50 dark:bg-yellow-950/40 dark:text-yellow-400 ring-yellow-200 dark:ring-yellow-900" },
    { label: "Failing", value: "0", color: "text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400 ring-red-200 dark:ring-red-900" },
    { label: "Inactive", value: "0", color: "text-gray-700 bg-gray-50 dark:bg-gray-950/40 dark:text-gray-400 ring-gray-200 dark:ring-gray-800" },
] as const;

// TODO: Replace with TanStack Query hook
const monitors = [
    {
        id: "clx1abc",
        name: "Harsh Website",
        url: "https://harsh.dev",
        status: "active" as const,
        tags: [] as string[],
        lastIncident: null,
        lastChecked: "2 min ago",
        p50: "120ms",
        p90: "240ms",
        p95: "310ms",
    },
];

export default function MonitorsListPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filtered = monitors.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.url.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {statusCards.map((card) => (
                    <Card
                        key={card.label}
                        size="sm"
                        className={cn("ring-1", card.color)}
                    >
                        <CardHeader>
                            <CardTitle className="text-xs font-medium opacity-80">
                                {card.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-lg font-bold">{card.value}</span>
                        </CardContent>
                    </Card>
                ))}

                {/* Slowest P95 card */}
                <Card size="sm">
                    <CardHeader>
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Slowest P95
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="text-lg font-bold">
                            {monitors[0]?.p95 ?? "—"}
                        </span>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2">
                <div className="relative max-w-sm flex-1">
                    <Input
                        placeholder="Filter by name, url, type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="sm">
                    <Plus className="size-3" data-icon="inline-start" />
                    Tags
                </Button>
            </div>

            {/* Data Table */}
            <Card className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 pl-4">
                                <Checkbox aria-label="Select all" />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tags</TableHead>
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
                                        variant={
                                            monitor.status === "active" ? "default" : "secondary"
                                        }
                                        className={
                                            monitor.status === "active"
                                                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                : ""
                                        }
                                    >
                                        {monitor.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {monitor.tags.length > 0 ? monitor.tags.join(", ") : "—"}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {monitor.lastIncident ?? "—"}
                                </TableCell>
                                <TableCell>{monitor.lastChecked}</TableCell>
                                <TableCell>{monitor.p50}</TableCell>
                                <TableCell>{monitor.p90}</TableCell>
                                <TableCell>{monitor.p95}</TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className="flex size-8 items-center justify-center rounded-md hover:bg-muted"
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

                {/* Pagination footer */}
                <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
                    <span>
                        {filtered.length} of {monitors.length} row(s) filtered.
                    </span>
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" text="" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" text="" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </Card>
        </div>
    );
}
