# Setup

You can run the site locally right away: without Supabase configured it opens in
**preview mode**, with sample data and no login, so you can judge the design.

```bash
npm run dev
```

Then open http://localhost:3000.

## 1. Create the Supabase project

1. Create a project at https://supabase.com/dashboard.
2. Go to **SQL Editor → New query**, paste the whole of `supabase/schema.sql`, and run it.
3. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up".
4. **Authentication → Users → Add user → Create new user**: enter your email and a
   strong password, and tick "Auto Confirm User".
5. Back in the **SQL Editor**, give that account admin rights (use your email):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

   Only accounts in `admins` can read or change anything, even if they can log in.

## 2. Connect the app

Copy `.env.example` to `.env.local` and fill in the two values from
**Project Settings → API**. Restart `npm run dev`. The preview banner disappears
and you'll be asked to log in.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import it at https://vercel.com/new.
3. Add the same two environment variables under **Settings → Environment Variables**.
4. Deploy. In Supabase, go to **Authentication → URL Configuration** and set the
   Site URL to your Vercel URL.

Preview mode is disabled in production builds, so a deploy with missing
variables shows an error instead of the sample data.
