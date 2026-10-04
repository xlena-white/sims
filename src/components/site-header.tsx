import Link from "next/link";
import { PREVIEW_MODE } from "@/lib/supabase/env";
import { Plumbob } from "./plumbob";

const navLink = "rounded-full px-3 py-1.5 text-sm font-medium text-chalk-muted transition-colors hover:bg-ink-raised hover:text-chalk";

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-10">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <Plumbob className="h-6 w-auto shrink-0 transition-transform group-hover:-translate-y-0.5" />
          <span className="truncate font-display text-lg font-semibold sm:text-xl">{title}</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1">
          <Link href="/" className={`${navLink} hidden sm:block`}>
            Home
          </Link>
          <Link href="/admin" className={navLink}>
            Admin
          </Link>
          {!PREVIEW_MODE && (
            <form action="/auth/signout" method="post">
              <button type="submit" className={`${navLink} cursor-pointer`}>
                Sign out
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
