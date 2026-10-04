import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { getAllCharactersLite } from "@/lib/data";
import { GEN_ACCENT, type GenerationNumber } from "@/lib/types";

export const metadata: Metadata = { title: "Characters · Admin" };

export default async function AdminCharactersPage() {
  const characters = await getAllCharactersLite();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-chalk-muted">
          {characters.length} {characters.length === 1 ? "character" : "characters"}
        </p>
        <Link href="/admin/characters/new" className="btn btn-primary">
          + Add character
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        {([1, 2, 3] as GenerationNumber[]).map((gen) => {
          const people = characters.filter((c) => c.generation === gen);
          return (
            <section key={gen}>
              <h2 className={`label mb-3 ${GEN_ACCENT[gen].text}`}>Generation {gen}</h2>
              {people.length ? (
                <ul className="card divide-y divide-ink-line overflow-hidden">
                  {people.map((c) => (
                    <li key={c.id} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-ink-hover">
                      <Avatar name={c.name} photoUrl={c.photo_url} generation={c.generation} />
                      <Link href={`/admin/characters/${c.id}`} className="flex-1 font-medium hover:underline">
                        {c.name}
                      </Link>
                      <Link href={`/characters/${c.slug}`} className="text-sm text-chalk-faint hover:text-chalk">
                        View
                      </Link>
                      <Link href={`/admin/characters/${c.id}`} className="text-sm text-mint hover:underline">
                        Edit
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-chalk-faint">No one yet.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
