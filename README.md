# [Sentinel](https://sentinel.harzh.xyz)

A modern uptime monitoring platform for tracking the health of your websites, APIs, and services. Get real-time alerts when your services go down and detailed analytics on response times and availability.

## Features

### Monitoring
- **Multiple Monitor Types** - HTTP/HTTPS, TCP, and Ping checks
- **Configurable Check Intervals** - Set custom intervals (minimum 5 minutes)
- **Custom Headers & Body** - Support for POST requests with custom payloads
- **Expected Status Codes** - Define what constitutes a successful check
- **Public/Private Monitors** - Share monitors publicly or keep them private

### Incident Management
- **Automatic Incident Detection** - Track downtime events automatically
- **Incident States** - Detected, Investigating, and Resolved states
- **Postmortem Notes** - Document root causes and resolutions
- **Incident Timeline** - Full history of all incidents per monitor

### Alerting
- **Multiple Channels** - Email, Webhook, Slack, and Discord notifications
- **Failure Thresholds** - Configure how many failures before alerting
- **Alert History** - Track all sent notifications and their status

### Dashboard & Analytics
- **Real-time Status** - See the current state of all monitors
- **Uptime Statistics** - Track uptime percentages over 24h, 7d, and 30d periods
- **Response Time Metrics** - Average response times and trends
- **Health Check History** - Detailed logs of every check

### Email Notifications
- Monitor Down Alerts
- Monitor Recovery Notifications
- Weekly Digest Reports
- Alert Summaries
- Account Security Alerts

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Runtime** | Bun |
| **Frontend** | React 19, Tailwind CSS v4 |
| **API** | Elysia.js |
| **Database** | PostgreSQL with Drizzle ORM |
| **Authentication** | better-auth |
| **State Management** | TanStack Query |
| **Email** | React Email + Resend |
| **UI Components** | Radix UI, Lucide Icons |
| **Charts** | Recharts |
| **Linting** | Biome |


## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   │   ├── [[...slug]]/   # Elysia API catch-all
│   │   └── cron/          # Health check cron job
├── components/
│   ├── ui/                # UI primitives (shadcn-style)
│   └── *.tsx              # Feature components
├── db/                    # Drizzle schema & connection
├── emails/                # React Email templates
├── lib/                   # Utilities, workers, auth client
└── routes/                # Elysia route modules
    ├── admin/
    ├── alerts/
    ├── incidents/
    ├── monitors/
    └── user/
```

## Contributing

1. Clone the repository:
```sh
git clone https://github.com/Hyperdunks/ump
cd ump
```

2. Install dependencies:
```sh
bun install
```

3. Set up environment variables:
```sh
cp .env.example .env
```

4. Configure your `.env` file with the required credentials:
```env
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
BETTER_AUTH_SECRET=...
```

5. Run database migrations:
```sh
bun run db:migrate
```

6. Start the development server:
```sh
bun run dev


## Support

[buymeacoffee](buymeacoffee.com/hyperdevstuff)

## License

Apache 2.0
