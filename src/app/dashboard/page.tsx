import {
  Activity,
  FileText,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

// TODO: Replace with TanStack Query hook
const summaryCards = [
  { label: "Monitors", value: "1", icon: Activity },
  { label: "Status Pages", value: "0", icon: FileText },
  { label: "Recent Incidents", value: "None", icon: AlertTriangle },
  { label: "Last Report", value: "None", icon: FileText },
  { label: "Last Maintenance", value: "None", icon: Wrench },
] as const;

const sections = [
  {
    title: "Incidents",
    subtitle: "Incidents over the last 7 days.",
    emptyText: "No incidents found",
    emptyDescription: "You have no incidents recorded in the last 7 days.",
    icon: AlertTriangle,
  },
  {
    title: "Reports",
    subtitle: "Reports over the last 7 days.",
    emptyText: "No reports found",
    emptyDescription: "You have no reports recorded in the last 7 days.",
    icon: FileText,
  },
  {
    title: "Maintenance",
    subtitle: "Maintenance over the last 7 days.",
    emptyText: "No maintenances found",
    emptyDescription: "You have no maintenance windows in the last 7 days.",
    icon: Wrench,
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your Sentinel dashboard.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <Card key={card.label} size="sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="size-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <span className="text-lg font-semibold">{card.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold">{section.title}</h2>
            <p className="text-xs text-muted-foreground">
              {section.subtitle}
            </p>
          </div>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <section.icon />
              </EmptyMedia>
              <EmptyTitle>{section.emptyText}</EmptyTitle>
              <EmptyDescription>{section.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ))}
    </div>
  );
}
