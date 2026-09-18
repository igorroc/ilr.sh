# Agent Instructions

- When moving or renaming tracked files, always use `git mv` instead of deleting and recreating files. This preserves Git rename tracking and keeps history easier to review.
- Never create, edit, delete, or apply Prisma migration files. Never run `bun run migrate`, `prisma migrate`, `prisma db push`, `prisma db seed`, or any equivalent command that creates, changes, resets, or seeds the database. The only permitted Prisma generation command is `bun run generate`, which may be used only to regenerate types from the current schema.
