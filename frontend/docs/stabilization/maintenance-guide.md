# Known Risks & Maintenance Guide

## 1. Fragile Modules
- **NotificationBell**: High sensitivity to network latency. If notification load increases (>10,000/user), consider switching to WebSockets or SSE.
- **Export Utils (PDF)**: Thai font support requires specific `jspdf` font embedding. The current grid theme uses a fallback font.

## 2. Maintenance Risks
- **Prisma Stale Client**: The current environment has permissions that may block `prisma generate`. Maintainers must ensure the client is synced manually using Admin/Elevated permissions.
- **Environment Drift**: Ensure `DATABASE_URL` is consistent between `.env` and the production environment.

## 3. Scalability Bottlenecks
- **Dashboard Polling**: Currently set to 30s. At 1,000+ concurrent operators, this will put significant load on the DB. Recommend implementing Redis caching for dashboard stats.
- **Access Logs**: The `access_events` table will grow rapidly. Implement a monthly partitioning or archiving strategy.

## 4. Maintenance Checklist
- [ ] Run `npx prisma validate` before every migration.
- [ ] Run `npm run typecheck` to ensure DTO consistency.
- [ ] Monitor `audit_logs` for unauthorized access attempts.
- [ ] Verify `device_registry` for offline scanners every 24 hours.

---
*Last Review: 2026-05-14*
