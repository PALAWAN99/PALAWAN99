# QR Gate Access System

A comprehensive gate access control system built with Next.js 16 and Prisma 7. This system handles QR code generation, member management, and gate entry monitoring.

## Features

- **Gate Management**: Control and monitor gate status and heartbeats.
- **Member Access**: QR code-based entry with configurable policies (TTL, daily limits).
- **Admin Dashboard**: Branch and gate configuration, member tracking, and audit logs.
- **Device Registry**: Monitor hardware devices (QR Scanners, ID Card Readers) connected to gates.
- **SQLite Database**: Lightweight and portable data storage using Prisma.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Components**: [Mantine UI v9](https://mantine.dev)
- **Database ORM**: [Prisma 7](https://www.prisma.io)
- **Database**: SQLite (local)
- **Icons**: Tabler Icons
- **Authentication**: NextAuth.js (Beta)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Application**:
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `src/app/admin`: Administrative interface for managing branches, gates, and users.
- `src/app/api`: Backend API endpoints for device communication and admin actions.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets.

## License

Private / Proprietary
