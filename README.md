<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
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
>>>>>>> origin/upload/gate-system
