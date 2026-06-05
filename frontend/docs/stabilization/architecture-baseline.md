# Architecture & Engineering Baseline

## 1. System Overview
QR Gate Access System is built on **Next.js 16 (App Router)**, **Prisma 7 (PostgreSQL)**, and **Mantine UI**. The system is designed for high-concurrency QR validation and real-time dashboard monitoring.

## 2. Core Architecture Baseline
The project follows a **Layered Architecture**:
- **UI Layer**: React Server & Client Components (Next.js App Router).
- **Service Layer**: Business logic encapsulation (e.g., `MemberService`).
- **Repository Layer**: Data access abstraction (e.g., `MemberRepository`).
- **Data Layer**: Prisma Client (PostgreSQL).

## 3. Data Integrity & Type Safety
- **Shared DTOs**: Centralized in `src/types/shared.ts`.
- **API Contracts**: Standardized via `ApiResponse<T>` in `src/types/api.ts`.
- **Validation**: Strict Zod schemas in `src/validators/`.

## 4. Stability Measures
- **React Hooks**: All data-fetching hooks are stabilized with `AbortController` and mounted guards.
- **Error Handling**: Centralized `handleApiError` with type narrowing for `unknown` errors.
- **Performance**: Polling intervals optimized to 30s for non-critical monitoring to reduce server load.

## 5. Deployment Baseline
- **Database**: PostgreSQL 16+.
- **Node Runtime**: Node.js 20+ (LTS).
- **Generated Client**: MUST be regenerated via `npx prisma generate` after any schema change.

---
*Snapshot Date: 2026-05-14*
*Status: FROZEN BASELINE*
