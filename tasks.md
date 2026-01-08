# Tasks - Sentinel Development

## 1. Build (API, UI)

### Completed
- **API Routes**: All 5 route modules with full CRUD operations
  - `src/routes/monitors/route.ts` - List, get, create, update, delete, checks, stats, uptime
  - `src/routes/alerts/route.ts` - List, create, update, delete
  - `src/routes/incidents/route.ts` - List, get, update
  - `src/routes/admin/route.ts` - Monitors list, users list, role updates, stats
  - `src/routes/user/route.ts` - Profile get, image upload/delete, profile update
- **Database Schema**: 9 tables with proper indexes, relations, and enums
- **Auth**: better-auth integration (email/password, verification, password reset, roles)
- **UI Components**: 57 shadcn components, landing page, dashboard layout, account settings
- **Infrastructure**: TanStack Query installed, Eden treaty client configured, QueryClient configured

### Remaining
- **DFL Layer with TanStack Query**
  - Create custom hooks: `useMonitors`, `useIncidents`, `useAlerts`, `useHealthChecks`, `useStats`
  - Implement caching strategies and optimistic updates
  - Connect Eden treaty client to TanStack Query
- **UI - Replace Mock Data**
  - Dashboard monitors with real API data
  - Uptime charts (24h/7d/30d)
  - Response time graphs
  - Health check history
- **UI - Missing Pages**
  - Incidents page (currently placeholder)
  - Alerts page (currently placeholder)
  - Monitor details page
  - Create monitor form/modal
  - Edit monitor form
  - Alert configuration UI
  - Incident details page
- **Real-time Updates**
  - Implement polling for live dashboard data
- **Visualizations**
  - Uptime charts using Recharts
  - Response time trends
  - Health check history view
- **Public Status Pages**
  - Utilize existing `isPublic` field in monitor schema
  - Create public status page UI
- **Loading/Error States**
  - Comprehensive loading skeletons
  - Error boundaries and error handling
  - Empty states with CTAs
- **Monitor Management**
  - Create/edit/delete workflows with proper UX
  - Bulk operations support

## 2. Testing

### Setup Required
- **Test Framework Setup**
  - Install and configure Vitest
  - Install and configure @testing-library/react
  - Configure test scripts in package.json
  - Add test utilities and mocks

### API Route Tests
- **Monitors Route**
  - GET /monitors - List all monitors with pagination
  - GET /monitors/:id - Get single monitor with health checks and incidents
  - POST /monitors - Create monitor with validation
  - PUT /monitors/:id - Update monitor
  - DELETE /monitors/:id - Delete monitor
  - GET /monitors/:id/checks - Health checks with pagination
  - GET /monitors/:id/stats - 24h statistics
  - GET /monitors/:id/uptime - Uptime stats (24h/7d/30d)
- **Alerts Route**
  - GET /alerts/monitor/:monitorId - List alerts
  - POST /alerts/monitor/:monitorId - Create alert
  - PUT /alerts/:id - Update alert
  - DELETE /alerts/:id - Delete alert
- **Incidents Route**
  - GET /incidents - List incidents with pagination
  - GET /incidents/:id - Get single incident
  - PUT /incidents/:id - Update incident (state, cause, postmortem)
- **Admin Route**
  - GET /admin/monitors - List all monitors (admin access)
  - GET /admin/users - List all users (admin access)
  - PUT /admin/users/:id/role - Update user role (admin access)
  - GET /admin/stats - System-wide statistics (admin access)
- **User Route**
  - GET /user/me - Get current user profile
  - POST /user/image - Upload profile image
  - DELETE /user/image - Delete profile image
  - PUT /user/me - Update profile name

### Database Tests
- CRUD operations for all tables
- Relation queries (joins, filters)
- Index performance testing
- Migration tests

### Auth Flow Tests
- Sign-up flow
- Email verification
- Sign-in flow
- Password reset
- Session management
- Role-based access control

### UI Component Tests
- Dashboard components
- Monitor cards and lists
- Forms (create/edit monitor, configure alerts)
- Incidents view
- Alerts configuration

### Integration Tests
- End-to-end user journeys
  - Create monitor → check health → trigger alert → resolve incident
  - Configure alert → verify notification delivery
  - View incidents → acknowledge → resolve
  - Public status page viewing

### Worker Tests
- Health check worker logic
- Incident detection algorithms
- Alert triggering logic
- Error handling and retry logic

## 3. Emails

### Completed
- Resend integration configured

- **Redesign All Email Templates**
  - **monitor-down.tsx** - Alert notification when monitor goes down
    - Use Tailwind CSS for styling
    - Remove all emojis
    - Professional, clean design
  - **monitor-recovered.tsx** - Recovery notification when monitor is back up
    - Use Tailwind CSS for styling
    - Remove all emojis
    - Professional, clean design
  - **verify-email.tsx** - Email verification for new sign-ups
    - Use Tailwind CSS for styling
    - Remove all emojis
    - Professional, clean design
  - **reset-password.tsx** - Password reset email
    - Use Tailwind CSS for styling
    - Remove all emojis
    - Professional, clean design

### Remaining
- **Additional Templates (Future)**
  - Welcome email for new users
  - Account activity/security alerts
  - Monthly/weekly digest reports
  - Alert summary notifications (aggregated)

### Testing
- End-to-end email delivery tests
- Preview and verify email templates across clients
- Test all notification channels (email, webhook, Slack, Discord)
