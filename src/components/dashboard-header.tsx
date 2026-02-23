import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function DashboardHeader({ children, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      {children}
    </div>
  );
}

interface ActionDashboardHeaderProps {
  title: string;
  subtitle: string;
  actions: ReactNode;
  className?: string;
}

export function ActionDashboardHeader({
  title,
  subtitle,
  actions,
  className,
}: ActionDashboardHeaderProps) {
  return (
    <DashboardHeader className={className}>
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {actions}
    </DashboardHeader>
  );
}

interface SimpleDashboardHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function SimpleDashboardHeader({
  title,
  subtitle,
  className,
}: SimpleDashboardHeaderProps) {
  return (
    <DashboardHeader className={className}>
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </DashboardHeader>
  );
}
