export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/**
 * Preview mode: when Supabase isn't configured yet during local development,
 * the site renders with sample data and skips login so you can see the design.
 * It can never activate in a production build.
 */
export const PREVIEW_MODE =
  process.env.NODE_ENV !== "production" && (!SUPABASE_URL || !SUPABASE_KEY);
