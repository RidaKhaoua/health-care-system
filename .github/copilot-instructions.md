# Copilot instructions for the Health Care System

## Project overview

This repository is a Next.js App Router project built with React 19 and TypeScript. The app is centered around a hospital management workflow with role-based dashboards and Clerk-based authentication.

The biggest architectural pieces span multiple files and should be treated as a unit:

- `app/` holds the route structure and role-specific screens. Public auth routes live under `app/(auth)`, while protected app routes sit under `app/(protected)`.
- `proxy.ts` is the global Clerk middleware that enforces route access. Route access rules are defined in `lib/routes.ts`, and they must stay in sync.
- `prisma/schema.prisma` defines the PostgreSQL schema and enums (`Role`, `AppointmentStatus`, etc.). The generated Prisma client is under `lib/generated/prisma`.
- Shared UI pieces live in `components/ui`, following the existing Tailwind/shadcn-style patterns used across the app.
- Server actions in `app/actions/` are the main place for form-driven business logic and database writes.

## Build, lint, and validation commands

Use the package scripts defined in `package.json`:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Database/client commands:

```bash
npx prisma generate
npx prisma migrate dev
```

There is no `test` script configured in this repository, so there is no repo-native single-test command to run today. For focused validation while working on a changed file, prefer direct checks such as:

```bash
npx eslint path/to/file.ts
npx eslint path/to/file.tsx
npx tsc --noEmit
```

If a schema change affects Prisma models, regenerate the client and verify the app still builds.

## Architecture and workflow notes

- Route protection is centralized: if you update a route or add a role-specific page, update both `proxy.ts` and `lib/routes.ts` together.
- Clerk auth is the source of the user's role metadata. The middleware reads `sessionClaims.metadata.role` and redirects unauthorized users to their default route.
- This app is role-driven: `ADMIN`, `DOCTOR`, `NURSE`, `LAB_TECHNICIAN`, `CASHIER`, and `PATIENT` are the main access groups.
- `app/page.tsx` sends signed-in users to their dashboard based on `getRoles()`, and protected layouts render the correct sidebar for the current role.
- Database access is Prisma-based and uses the PostgreSQL adapter setup from the app configuration; do not switch Prisma client setup without updating the database connection path and environment variables.

## Key conventions

- Keep Prisma schema changes in `prisma/schema.prisma` and regenerate the generated client when schema or enum changes are needed.
- Keep UI styling consistent with the existing Tailwind-based components already in `components/ui`; do not introduce a second design system.
- Follow the App Router conventions in `app/` and keep route files colocated with their layouts and feature pages.
- Prefer server actions or server components for data access and Clerk auth, and avoid relying on stale client-side auth state after sign in.
- When changing patient, doctor, or staff flows, validate both the Prisma model and the matching Clerk user metadata behavior; these paths are tightly coupled in this app.
- The repository uses role-aware protections and dashboards rather than generic user pages. Keep that distinction in mind when adding any new screens or routes.

## Relevant repo guidance to preserve

This repository already includes guidance in `AGENTS.md` and the local AI instructions. The important points to keep in mind are:

- Treat the app as a Next.js App Router app with Prisma + Clerk, not a generic React app.
- Keep route permissions and role checks aligned across the middleware and route map.
- The generated Prisma client lives under `lib/generated/prisma` and should not be hand-edited.
- UI work should stay consistent with the app’s existing component patterns and styles.
