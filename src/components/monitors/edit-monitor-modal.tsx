"use client";

import { MonitorCog } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpdateMonitor } from "@/hooks/api/use-monitors";
import { normalizeMonitorUrl } from "@/lib/normalize-monitor-url";

const MONITOR_TYPES = ["http", "https", "tcp", "ping"] as const;
const HTTP_METHODS = ["GET", "POST", "HEAD"] as const;

interface EditMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitor: {
    id: string;
    name: string;
    url: string;
    type: string;
    method: string;
    checkInterval: number;
    timeout: number;
    expectedStatusCodes: string[];
    headers?: Record<string, string> | null;
    body?: string | null;
    isActive: boolean;
    isPublic: boolean;
  };
}

export function EditMonitorModal({
  open,
  onOpenChange,
  monitor,
}: EditMonitorModalProps) {
  const updateMonitor = useUpdateMonitor();

  const [formData, setFormData] = useState({
    name: monitor.name,
    url: monitor.url,
    type: monitor.type as (typeof MONITOR_TYPES)[number],
    method: monitor.method as (typeof HTTP_METHODS)[number],
    checkInterval: monitor.checkInterval as number | "",
    timeout: monitor.timeout as number | "",
    expectedStatusCodes: monitor.expectedStatusCodes.join(","),
    isActive: monitor.isActive,
    isPublic: monitor.isPublic,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: monitor.name,
        url: monitor.url,
        type: monitor.type as (typeof MONITOR_TYPES)[number],
        method: monitor.method as (typeof HTTP_METHODS)[number],
        checkInterval: monitor.checkInterval as number | "",
        timeout: monitor.timeout as number | "",
        expectedStatusCodes: monitor.expectedStatusCodes.join(","),
        isActive: monitor.isActive,
        isPublic: monitor.isPublic,
      });
    }
  }, [open, monitor]);

  function handleChange(field: keyof typeof formData, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      name: formData.name,
      url: normalizeMonitorUrl(formData.url),
      type: formData.type,
      method: formData.method,
      checkInterval: Number(formData.checkInterval),
      timeout: Number(formData.timeout),
      expectedStatusCodes: formData.expectedStatusCodes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isActive: formData.isActive,
      isPublic: formData.isPublic,
    };

    await updateMonitor.mutateAsync({
      id: monitor.id,
      data,
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-muted p-2">
                <MonitorCog className="size-5" />
              </div>
              <div>
                <DialogTitle>Edit Monitor</DialogTitle>
                <DialogDescription>
                  Update the configuration for this monitor.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Name
              </FieldLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="My API Endpoint"
                required
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                URL
              </FieldLabel>
              <Input
                value={formData.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://api.example.com/health"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Type
                </FieldLabel>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    handleChange("type", val as (typeof MONITOR_TYPES)[number])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONITOR_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Method
                </FieldLabel>
                <Select
                  value={formData.method}
                  onValueChange={(val) =>
                    handleChange("method", val as (typeof HTTP_METHODS)[number])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HTTP_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Check Interval (seconds)
                </FieldLabel>
                <Input
                  type="number"
                  min={300}
                  max={3600}
                  value={formData.checkInterval}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("checkInterval", val === "" ? "" : Number(val));
                  }}
                  required
                />
              </Field>

              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Timeout (ms)
                </FieldLabel>
                <Input
                  type="number"
                  min={3000}
                  max={60000}
                  value={formData.timeout}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("timeout", val === "" ? "" : Number(val));
                  }}
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Expected Status Codes (comma-separated)
              </FieldLabel>
              <Input
                value={formData.expectedStatusCodes}
                onChange={(e) =>
                  handleChange("expectedStatusCodes", e.target.value)
                }
                placeholder="200, 201, 204"
              />
            </Field>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">
                  Monitor is actively checking
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Public</p>
                <p className="text-xs text-muted-foreground">
                  Status page visibility
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleChange("isPublic", checked)}
                size="sm"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={updateMonitor.isPending}>
              {updateMonitor.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
