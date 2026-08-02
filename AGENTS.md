<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project guide for AI coding agents

## Stack and architecture

- App is a Next.js App Router project using React 19 and TypeScript.
- Shared UI primitives live under [components/ui](components/ui), following a shadcn-style pattern.
- Route groups under [app](app) separate public and protected areas; the protected screens are under [app/(protected)](app/(protected)).
- Authentication and role checks are handled with Clerk via [app/layout.tsx](app/layout.tsx) and [proxy.ts](proxy.ts).
- Database access uses Prisma with PostgreSQL and the generated client under [lib/generated/prisma](lib/generated/prisma). The schema is in [prisma/schema.prisma](prisma/schema.prisma).

## Important patterns

- Use the App Router conventions in [app](app). Keep route files colocated with their layouts and feature pages.
- Keep Prisma model changes in [prisma/schema.prisma](prisma/schema.prisma), then regenerate the client when needed.
- Global auth/route rules are centralized in [proxy.ts](proxy.ts) and [lib/routes.ts](lib/routes.ts). If you change route permissions, update both files together.
- Keep the UI consistent with the Tailwind-based styling already used in the app; do not introduce an alternate styling system without a clear reason.

## Commands

- Start development: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint`
- Prisma generate: `npx prisma generate`
- Prisma migrate: `npx prisma migrate dev`

## Common pitfalls

- Clerk auth state can appear stale on the first render after sign-in when a page is rendered as a server component. If the UI depends on `signed-in` / `signed-out`, prefer a client component and use Clerk’s client auth components instead of relying on a server-rendered page state.
- The project uses `@prisma/adapter-pg`; do not switch the Prisma client setup without updating the database connection path and environment variables.
- Status/role metadata is read from Clerk session claims in [proxy.ts](proxy.ts). If a user is missing a role in `sessionClaims.metadata.role`, route protection will redirect them to `/`.

## Files worth checking first

- [app/layout.tsx](app/layout.tsx) for app-wide providers and metadata.
- [app/page.tsx](app/page.tsx) for landing-page auth UI.
- [proxy.ts](proxy.ts) for middleware-based protection.
- [lib/routes.ts](lib/routes.ts) for the allowed route matchers.
- [prisma/schema.prisma](prisma/schema.prisma) for data model definitions.

For broader product requirements and setup notes, see [README.md](README.md).
