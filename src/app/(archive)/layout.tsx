import { Plumbob } from "@/components/plumbob";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/data";
import { PREVIEW_MODE } from "@/lib/supabase/env";

export default async function ArchiveLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      {PREVIEW_MODE && (
        <div className="relative z-50 bg-mint/10 px-4 py-2 text-center text-xs text-mint">
          Preview mode: showing sample data because Supabase isn&apos;t connected yet. See SETUP.md.
        </div>
      )}
      <div className="relative flex flex-1 flex-col">
        <SiteHeader title={settings.title} />
        <main className="flex-1">{children}</main>
        <footer className="flex items-center justify-center gap-2 border-t border-ink-line px-5 py-8 text-sm text-chalk-faint">
          <Plumbob className="h-4 w-auto opacity-60" />
          {settings.title}
        </footer>
      </div>
    </>
  );
}
