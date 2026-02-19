"use client";

import { Monitor, Plus } from "lucide-react";
import { useState } from "react";
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
import { useCreateMonitor } from "@/hooks/api/use-monitors";

const MONITOR_TYPES = ["http", "https", "tcp", "ping"] as const;
const HTTP_METHODS = ["GET", "POST", "HEAD"] as const;

interface CreateMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultFormData = {
  name: "",
  url: "",
  type: "https" as const,
  method: "GET" as const,
  checkInterval: 60,
  timeout: 30000,
  expectedStatusCodes: ["200"],
  headers: undefined as Record<string, string> | undefined,
  body: undefined as string | undefined,
  isActive: true,
  isPublic: false,
};

export function CreateMonitorModal({
  open,
  onOpenChange,
}: CreateMonitorModalProps) {
  const [formData, setFormData] = useState(defaultFormData);
  const createMonitor = useCreateMonitor();

  function handleInputChange(field: keyof typeof formData, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    await createMonitor.mutateAsync({
      name: formData.name,
      url: formData.url,
      type: formData.type,
      method: formData.method,
      checkInterval: formData.checkInterval,
      timeout: formData.timeout,
      expectedStatusCodes: formData.expectedStatusCodes,
      headers: formData.headers,
      body: formData.body,
      isActive: formData.isActive,
      isPublic: formData.isPublic,
    });
    setFormData(defaultFormData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-muted p-2">
              <Monitor className="size-5" />
            </div>
            <div>
              <DialogTitle>Create Monitor</DialogTitle>
              <DialogDescription>
                Add a new endpoint to monitor for uptime and performance.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-4">
            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Name *
              </FieldLabel>
              <Input
                placeholder="My API Endpoint"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                URL *
              </FieldLabel>
              <Input
                placeholder="https://api.example.com/health"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Type
              </FieldLabel>
              <Select
                value={formData.type}
                onValueChange={(val) =>
                  handleInputChange(
                    "type",
                    val as (typeof MONITOR_TYPES)[number],
                  )
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
                  handleInputChange(
                    "method",
                    val as (typeof HTTP_METHODS)[number],
                  )
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
                onChange={(e) =>
                  handleInputChange("checkInterval", Number(e.target.value))
                }
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Timeout (ms)
              </FieldLabel>
              <Input
                type="number"
                min={1000}
                max={60000}
                value={formData.timeout}
                onChange={(e) =>
                  handleInputChange("timeout", Number(e.target.value))
                }
              />
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
              Expected Status Codes
            </FieldLabel>
            <Input
              placeholder="200, 201, 204"
              value={formData.expectedStatusCodes.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "expectedStatusCodes",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
          </Field>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Active
              </FieldLabel>
              <p className="text-xs text-muted-foreground">
                Enable monitoring immediately
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleInputChange("isActive", checked)
              }
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Public
              </FieldLabel>
              <p className="text-xs text-muted-foreground">
                Make status page visible to public
              </p>
            </div>
            <Switch
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                handleInputChange("isPublic", checked)
              }
              size="sm"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={
              createMonitor.isPending || !formData.name || !formData.url
            }
          >
            {createMonitor.isPending ? (
              "Creating..."
            ) : (
              <>
                <Plus className="mr-2 size-4" />
                Create Monitor
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
