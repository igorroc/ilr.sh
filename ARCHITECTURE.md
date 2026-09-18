# ilr.sh Architecture

ilr.sh is a private link-shortening application built with the Next.js App Router. Authenticated users manage short links and a public personal page; visitors use the redirect and public-profile routes without access to the dashboard.

## Routes

- `/`: product landing page.
- `/auth/login` and `/auth/register`: authentication flows.
- `/admin`: private link dashboard.
- `/admin/links/[id]`: short-link editing.
- `/admin/page`: personal-page management.
- `/r/[slug]`: short-link page that mirrors the destination metatags and auto-redirects.
- `/@username`: public personal page.

`src/proxy.ts` redirects authenticated users to the dashboard and protects private routes.

## Source Structure

```
src/
├── app/                    # Pages, server actions, and route handlers
│   ├── admin/              # Private dashboard, links, and personal page
│   ├── auth/               # Login, registration, and logout
│   ├── r/[slug]/           # Short-link resolution and redirect
│   └── [username]/         # Public /@username page
├── components/             # Reusable interface components
├── modules/
│   ├── auth/               # User authentication and opaque sessions
│   ├── bio/                # Personal pages and their links
│   └── links/              # Slug generation, URL validation, and link service
├── lib/                    # Shared infrastructure, including Prisma access
└── proxy.ts                # Route access control

prisma/
└── schema/                 # User, session, Link, BioPage, and BioLink models
```

## Domains

### Links

`LinkService` owns short-link operations. It validates destination URLs, generates Base62 slugs when no custom slug is supplied, restricts mutations to the owner, and resolves active links for `/r/[slug]`. `fetchDestinationPreview` extracts the destination title, description, and image (with timeout, size cap, and private-host guards) so short-link and profile metadata can mirror user content.

### Personal Pages

Each user can own one `BioPage`. A `BioLink` can point to an active short link owned by that user or to a validated direct URL. Public pages expose only published pages and visible, available links.

### Authentication

Passwords are hashed with Argon2id. Sessions are opaque tokens persisted in PostgreSQL and stored in cookies. Business rules remain in `src/modules/auth`, outside route and component layers.

## Design Rules

- Keep domain rules in `src/modules`, not page components.
- Validate external destination URLs before persistence.
- Scope every private data mutation and query to the authenticated user.
- Prefer server components and server actions; use client components only for interactive UI.
- Keep the public redirect route free of user-session requirements.
