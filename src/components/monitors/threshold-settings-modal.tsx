"use client";

import { useState } from "react";
import { Plus, Trash2, BellRing } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const METRICS = ["Latency", "Uptime", "Error Rate", "TTFB"] as const;
const OPERATORS = [
    "Greater than",
    "Less than",
    "Equal to",
    "Not equal to",
] as const;

interface Threshold {
    id: string;
    metric: string;
    operator: string;
    value: number;
    durationMinutes: number;
    enabled: boolean;
}

interface ThresholdSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (thresholds: Threshold[]) => void;
}

export default function ThresholdSettingsModal({
    open,
    onOpenChange,
    onSave,
}: ThresholdSettingsModalProps) {
    const [thresholds, setThresholds] = useState<Threshold[]>([]);
    const [error, setError] = useState<string | null>(null);

    function handleAdd() {
        setThresholds((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).slice(2, 11),
                metric: "Latency",
                operator: "Greater than",
                value: 500,
                durationMinutes: 5,
                enabled: true,
            },
        ]);
    }

    function handleRemove(id: string) {
        setThresholds((prev) => prev.filter((t) => t.id !== id));
    }

    function handleUpdate(id: string, field: keyof Threshold, value: unknown) {
        setThresholds((prev) =>
            prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
        );
    }

    function handleSave() {
        const invalid = thresholds.find(
            (t) => t.value <= 0 || t.durationMinutes <= 0,
        );
        if (invalid) {
            setError("Value and Duration must be positive numbers.");
            return;
        }
        setError(null);
        onSave(thresholds);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-muted p-2">
                            <BellRing className="size-5" />
                        </div>
                        <div>
                            <DialogTitle>Alert Thresholds</DialogTitle>
                            <DialogDescription>
                                Configure when you get notified about performance issues.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 space-y-4 overflow-y-auto">
                    {error && <FieldError>{error}</FieldError>}

                    {thresholds.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed py-8 text-center text-sm text-muted-foreground">
                            <p>No thresholds configured.</p>
                            <p className="text-xs">
                                Add a rule to get notified when performance degrades.
                            </p>
                        </div>
                    ) : (
                        thresholds.map((threshold) => (
                            <div
                                key={threshold.id}
                                className="flex flex-col items-center gap-4 rounded-xl border p-4 md:flex-row"
                            >
                                <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
                                    <Field>
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                                            Metric
                                        </FieldLabel>
                                        <Select
                                            value={threshold.metric}
                                            onValueChange={(val) =>
                                                handleUpdate(threshold.id, "metric", val)
                                            }
                                        >
                                            <SelectTrigger size="sm" className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {METRICS.map((m) => (
                                                    <SelectItem key={m} value={m}>
                                                        {m}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    <Field>
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                                            Condition
                                        </FieldLabel>
                                        <Select
                                            value={threshold.operator}
                                            onValueChange={(val) =>
                                                handleUpdate(threshold.id, "operator", val)
                                            }
                                        >
                                            <SelectTrigger size="sm" className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {OPERATORS.map((op) => (
                                                    <SelectItem key={op} value={op}>
                                                        {op}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    <Field>
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                                            Value{" "}
                                            {threshold.metric === "Latency" ? "(ms)" : "(%)"}
                                        </FieldLabel>
                                        <Input
                                            type="number"
                                            value={threshold.value}
                                            onChange={(e) =>
                                                handleUpdate(
                                                    threshold.id,
                                                    "value",
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                                            Duration (min)
                                        </FieldLabel>
                                        <Input
                                            type="number"
                                            value={threshold.durationMinutes}
                                            onChange={(e) =>
                                                handleUpdate(
                                                    threshold.id,
                                                    "durationMinutes",
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </Field>
                                </div>

                                <div className="flex items-center gap-2 border-l pl-4">
                                    <Switch
                                        checked={threshold.enabled}
                                        onCheckedChange={(checked) =>
                                            handleUpdate(threshold.id, "enabled", checked)
                                        }
                                        size="sm"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => handleRemove(threshold.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                        <Plus className="size-4" />
                        Add Threshold Rule
                    </button>
                </div>

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                        Cancel
                    </DialogClose>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
