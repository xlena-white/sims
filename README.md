# The Storybook

A private archive for a multi-generational Sims storyline.
Next.js 16 · Supabase (database, auth, storage) · Tailwind CSS 4 · Vercel.

See [SETUP.md](SETUP.md) to connect Supabase and deploy.

- `supabase/schema.sql` creates all tables, admin-only security rules, and the photo bucket
- `src/proxy.ts` sends everyone who isn't logged in to `/login`
- `src/lib/data.ts` holds all database reads
- `src/app/(archive)/` holds the logged-in pages; `admin/` is the editor
