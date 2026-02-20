"use client";

import { Button } from "@/components/ui/button";
import { useUpdateIncident } from "@/hooks/api/use-incidents";

interface IncidentStateButtonsProps {
  incidentId: string;
  currentState: "detected" | "investigating" | "resolved";
  onStateChange?: () => void;
}

export function IncidentStateButtons({
  incidentId,
  currentState,
  onStateChange,
}: IncidentStateButtonsProps) {
  const updateIncident = useUpdateIncident();

  const handleAcknowledge = async () => {
    await updateIncident.mutateAsync({
      id: incidentId,
      data: { state: "investigating" },
    });
    onStateChange?.();
  };

  const handleResolve = async () => {
    await updateIncident.mutateAsync({
      id: incidentId,
      data: { state: "resolved" },
    });
    onStateChange?.();
  };

  if (currentState === "resolved") {
    return null;
  }

  if (currentState === "detected") {
    return (
      <Button
        variant="outline"
        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-950"
        disabled={updateIncident.isPending}
        onClick={handleAcknowledge}
      >
        {updateIncident.isPending ? "Acknowledging..." : "Acknowledge"}
      </Button>
    );
  }

  if (currentState === "investigating") {
    return (
      <Button
        variant="outline"
        className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950"
        disabled={updateIncident.isPending}
        onClick={handleResolve}
      >
        {updateIncident.isPending ? "Resolving..." : "Resolve"}
      </Button>
    );
  }

  return null;
}
