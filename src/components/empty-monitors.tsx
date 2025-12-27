import { ArrowUpRightIcon, EqualApproximatelyIcon, Icon, Monitor, MonitorCog, MonitorDotIcon, MonitorDownIcon } from "lucide-react"
import { IconHeartRateMonitor } from '@tabler/icons-react';

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

export function EmptyMonitors() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <IconHeartRateMonitor />
                </EmptyMedia>
                <EmptyTitle>No Monitors Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any monitors yet. Get started by creating
                    your first monitor.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button>Create Monitor</Button>
                    <Button variant="outline">Learn More</Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
