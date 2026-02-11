# Code Review (2026-02-11)

## Scope
- Reviewed Express API setup, auth/account lifecycle, and React global state management.
- Focused on production readiness, security hardening, and maintainability.

## Findings

### 1) Production CORS is hard-coded to a placeholder origin (High)
**Why it matters:** In production, requests from the real frontend will be rejected unless the URL is manually edited in code before each deployment.

- `Server/server.js` allows only `https://your-production-app.com` in production mode.
- Recommendation: load allowed origins from environment (e.g., `CORS_ORIGINS`) and support multiple domains.

### 2) Rate limiting is disabled even though dependency is present (High)
**Why it matters:** Authentication and API endpoints are exposed to brute-force and abuse without a global or route-level limiter.

- `express-rate-limit` is imported, but limiter setup/application is fully commented out in `Server/server.js`.
- Recommendation: enable a sane global limiter and optionally stricter limits on `/api/auth/login` and `/api/auth/register`.

### 3) Duplicate auth routing/controller paths increase drift risk (Medium)
**Why it matters:** There are two auth route/controller stacks (`users` and `authController`), but only one is wired. This can cause stale code and confusion during maintenance.

- Active path: `Server/server.js` uses `./routes/users` under `/api/auth`.
- Unused/parallel path exists in `Server/routes/authRoutes.js` and `Server/controllers/authController.js`.
- Recommendation: consolidate to one route/controller set and delete the unused one.

### 4) Account deletion does not remove all user-linked records (Medium)
**Why it matters:** Deleting only user + transactions can leave privacy-sensitive records behind (audit logs, budget records), causing orphaned data.

- `deleteAccount` removes `Transaction` rows and the `User`, but does not remove `AuditLog` or `Budget` records.
- Recommendation: delete all user-linked collections in a transaction/session where possible.

### 5) Backup source directory is committed under `Client/src` (Low)
**Why it matters:** Keeping `cleanup-backup-*` inside `src` increases repository noise and onboarding confusion.

- Found `Client/src/cleanup-backup-20260212T000000/*` committed.
- Recommendation: remove backup artifacts from source tree and rely on Git history for recovery.

## Suggested Next Steps
1. Externalize CORS config and enable rate limiting in production defaults.
2. Consolidate auth route/controller implementation.
3. Harden account deletion to clean all user-owned data.
4. Remove backup artifacts and add `.gitignore` safeguards for future local backups.
