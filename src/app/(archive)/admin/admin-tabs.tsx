"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Site & generations", exact: true },
  { href: "/admin/characters", label: "Characters", exact: false },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav className="mt-6 flex gap-1 overflow-x-auto rounded-full border border-ink-line bg-ink-raised p-1 no-scrollbar sm:inline-flex">
      {TABS.map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "bg-mint text-ink" : "text-chalk-muted hover:text-chalk"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
