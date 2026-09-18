# ilr.sh

A private link shortener with personal pages for collecting and sharing important destinations.

## Features

- Create short links with generated or custom slugs.
- Redirect safely to validated HTTP and HTTPS destinations only.
- Activate, deactivate, or delete links from a private dashboard.
- Publish a `/@username` page with short links or direct URLs.
- Password authentication with PostgreSQL-backed sessions.

## Stack

Next.js, React, TypeScript, Prisma, PostgreSQL, Tailwind CSS, and Bun.

## Development

### Requirements

- Bun 1.4.2+
- Docker and Docker Compose

### Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/igorroc/ilr.sh.git
cd ilr.sh
bun install --frozen-lockfile
```

2. Create `.env` from `.env.example` and configure the database:

```env
DATABASE_DB="ilr-sh"
DATABASE_USER="postgres"
DATABASE_PASSWORD="a_secure_password"
POSTGRES_PRISMA_URL="postgresql://postgres:a_secure_password@localhost:5432/ilr-sh"
```

3. Start PostgreSQL, apply migrations, and run the project:

```bash
bun run compose:up
bun run migrate
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `bun run dev`: starts the development server.
- `bun run build`: creates a production build.
- `bun run start`: starts the production server.
- `bun run lint`: checks code with ESLint.
- `bun run ts-check`: checks types without emitting files.
- `bun run test`: runs tests.
- `bun run migrate`: applies local migrations and generates Prisma Client.
- `bun run prisma:studio`: opens Prisma Studio.

## Deployment

The project can be deployed to Vercel. Set `POSTGRES_PRISMA_URL` to the production PostgreSQL URL. The `vercel-build` script generates Prisma Client, deploys pending migrations, and runs the Next.js build.

The project pins Bun `1.4.2` in `package.json`; use that version or newer in the build environment.

## Architecture

- `src/app`: pages, dashboard, redirect routes, and public profile.
- `src/modules/links`: short-link creation, validation, and resolution rules.
- `src/modules/bio`: personal page and link management.
- `src/modules/auth`: authentication and session management.
- `prisma/schema`: user, link, page, and session models.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the detailed structure.

## License

[MIT](LICENSE)
