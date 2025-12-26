## dashboard structure

**top nav approach** (vercel-style):

```
┌──────────────────────────────────────────────────────────────────────┐
│ [sentinel logo(left)]       (right)Monitors Incidents Alerts [avatar]│
└──────────────────────────────────────────────────────────────────────┘
```

keeps it horizontal, max width for content below.

## page layouts

### monitors (default view)
```
┌──────────────────────────────────────────────────┐
│ Overview Cards Row                                │
│ [total monitors] [up] [down] [avg response time] │
├──────────────────────────────────────────────────┤
│ Quick Stats Chart (last 24h)                     │
│ [area chart: uptime % over time]                 │
├──────────────────────────────────────────────────┤
│ Monitor List                    [+ Add Monitor]  │
│ ┌────────────────────────────────────────────┐  │
│ │ [status dot] monitor.name                  │  │
│ │ monitor.url                                │  │
│ │ [uptime %] [response time] [last checked]  │  │
│ └────────────────────────────────────────────┘  │
│ [repeat for each monitor]                        │
└──────────────────────────────────────────────────┘
```

### incidents
```
┌──────────────────────────────────────────────────┐
│ Active Incidents (0)          Resolved (12)      │
├──────────────────────────────────────────────────┤
│ Timeline View                                     │
│ ┌────────────────────────────────────────────┐  │
│ │ [!] monitor.name DOWN                       │  │
│ │ detected 2h ago • investigating             │  │
│ │ [view details] [resolve]                    │  │
│ └────────────────────────────────────────────┘  │
│ [chronological list]                             │
└──────────────────────────────────────────────────┘
```

### alerts
```
┌──────────────────────────────────────────────────┐
│ Alert Configurations             [+ Add Alert]   │
├──────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐  │
│ │ config.name                     [toggle]    │  │
│ │ type: email • threshold: 3 failures         │  │
│ │ monitors: 5                                 │  │
│ │ [edit] [delete]                             │  │
│ └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## component hierarchy

```typescript
app/
├── (dashboard)/
│   ├── layout.tsx              // top nav + content wrapper
│   ├── page.tsx                // → monitors
│   ├── incidents/page.tsx
│   └── alerts/page.tsx
└── components/
    ├── TopNav.tsx
    ├── monitors/
    │   ├── OverviewCards.tsx   // 4 stat cards
    │   ├── UptimeChart.tsx     // shadcn area chart
    │   └── MonitorList.tsx     // table/cards
    ├── incidents/
    │   └── IncidentTimeline.tsx
    └── alerts/
        └── AlertConfigList.tsx
```

## key ui patterns

**status indicators**: colored dots (green/red/yellow) + text. don't overuse color alone.

**cards vs table**: use cards for monitors (easier to scan status), table for incidents (chronological data).

**real-time updates**: tanstack query w/ 30s refetch on monitors page. websockets overkill for your scale.

**responsive**: top nav collapses to hamburger <768px. charts stack vertically on mobile.

want me to build the actual dashboard layout artifact w/ shadcn components? or drill into specific page first?
