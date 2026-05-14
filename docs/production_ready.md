# Production Readiness Checklist & Deployment Guide

## 1. Pre-Deployment Verification
Before deploying to production, execute the following steps to ensure baseline stability:
- [ ] **Prisma Sync**: Run `npx prisma generate` using Admin/Root permissions.
- [ ] **Integrity Check**: Run `.\scripts\lockdown-verify.ps1`.
- [ ] **Environment**: Verify `.env` contains correct `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXT_PUBLIC_BASE_URL`.

## 2. Infrastructure Configuration
### Docker Deployment
- Use the provided `Dockerfile` and `docker-compose.yml`.
- Ensure volumes for PostgreSQL data are correctly mapped for persistence.

### PM2 (Process Manager)
- Use `ecosystem.config.js` for process management on Linux servers.
- Configure `max_memory_restart` to 1G to prevent memory leaks in high-load scenarios.

### Nginx (Reverse Proxy)
- Use `nginx.conf.example` as a template.
- Enable Gzip compression and set proper header security (HSTS, CSP).

## 3. Operations & Monitoring
### Logging
- Logs are stored in the `/logs` directory (configured via `services/loggingService.ts`).
- Monitor `error.log` for runtime failures.

### Health Checks
- Verify `/api/health` (if implemented) or check system heartbeat via the `GateDashboard`.

## 4. Rollback Plan
1. **Application**: Revert to the previous stable Git tag/commit.
2. **Database**: Use `scripts/db-backup.ps1` to restore from the latest snapshot if migration fails.

---
*Verified Production Ready Status: 2026-05-14*
