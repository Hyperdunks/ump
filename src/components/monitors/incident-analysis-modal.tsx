"use client";

import { AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface IncidentAnalysis {
    rootCause: string;
    impact: string;
    suggestedFix: string;
    estimatedResolutionTime: string;
}

interface IncidentAnalysisModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    analysis: IncidentAnalysis | null;
    loading: boolean;
}

export default function IncidentAnalysisModal({
    open,
    onOpenChange,
    analysis,
    loading,
}: IncidentAnalysisModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-muted p-2">
                            <Wrench className="size-5" />
                        </div>
                        <div>
                            <DialogTitle>AI Incident Analysis</DialogTitle>
                            <DialogDescription>Powered by Gemini 2.5 Flash</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="min-h-[200px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-12">
                            <Spinner className="size-8" />
                            <p className="animate-pulse text-sm text-muted-foreground">
                                Analyzing logs &amp; diagnostic data…
                            </p>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-4">
                            {/* Root Cause */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                                        <AlertTriangle className="size-4 text-orange-600" />
                                        Root Cause
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed">{analysis.rootCause}</p>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Estimated Resolution */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                                            <Clock className="size-4 text-blue-600" />
                                            Est. Resolution
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-medium">
                                            {analysis.estimatedResolutionTime}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Impact */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                                            <AlertTriangle className="size-4 text-red-500" />
                                            Impact
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{analysis.impact}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Suggested Fix */}
                            <Card className="border-green-200/50 dark:border-green-900/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                                        <CheckCircle className="size-4 text-green-600" />
                                        Suggested Remediation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed">{analysis.suggestedFix}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12 text-destructive">
                            Failed to load analysis.
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
