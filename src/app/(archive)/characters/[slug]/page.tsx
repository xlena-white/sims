import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, initials } from "@/components/avatar";
import { Chip, TraitChip } from "@/components/chip";
import { RelationshipWeb } from "@/components/relationship-web";
import { StoryContent } from "@/components/story-content";
import {
  getAllCharactersLite,
  getCharacterBySlug,
  getRelationshipsFor,
  getStorylinesFor,
} from "@/lib/data";
import { getFamily, getWebLinks } from "@/lib/family";
import { describePosition } from "@/lib/sims-data";
import { GEN_ACCENT, type CharacterLite } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/characters/[slug]">): Promise<Metadata> {
  const character = await getCharacterBySlug((await params).slug);
  return { title: character?.name ?? "Character" };
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-6 sm:p-7 ${className}`}>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink-line py-3 first:pt-0 last:border-0 last:pb-0 sm:flex-row sm:gap-4">
      <dt className="w-32 shrink-0 text-sm text-chalk-faint">{label}</dt>
      <dd className="min-w-0 flex-1">{children}</dd>
    </div>
  );
}

function PersonLink({ person, note }: { person: CharacterLite; note?: string }) {
  return (
    <Link href={`/characters/${person.slug}`} className="group flex items-center gap-3 rounded-xl p-1.5 -m-1.5 transition-colors hover:bg-ink-hover">
      <Avatar name={person.name} photoUrl={person.photo_url} generation={person.generation} className="size-10 text-sm" />
      <span className="min-w-0">
        <span className="block font-medium group-hover:underline">{person.name}</span>
        {note && <span className="block text-sm text-chalk-faint">{note}</span>}
      </span>
    </Link>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => <span className="text-chalk-faint">{children}</span>;

export default async function CharacterPage({ params }: PageProps<"/characters/[slug]">) {
  const character = await getCharacterBySlug((await params).slug);
  if (!character) notFound();

  const [everyone, relationships, storylines] = await Promise.all([
    getAllCharactersLite(),
    getRelationshipsFor(character.id),
    getStorylinesFor(character.id),
  ]);
  const byId = new Map(everyone.map((c) => [c.id, c]));
  const family = getFamily(character, everyone);
  const web = getWebLinks(character, family, relationships, everyone);
  const accent = GEN_ACCENT[character.generation];
  const position = describePosition(character.career_current, character.career_position);
  const dead = character.life_status === "dead";

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <Link href={`/generations/${character.generation}`} className="text-sm text-chalk-muted hover:text-chalk">
          ← Generation {character.generation}
        </Link>
        <Link href={`/admin/characters/${character.id}`} className="btn btn-ghost px-4 py-2 text-sm">
          Edit
        </Link>
      </div>

      {/* Header */}
      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
        <div className="card aspect-[4/5] overflow-hidden">
          {character.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={character.photo_url} alt={character.name} className={`h-full w-full object-cover ${dead ? "grayscale" : ""}`} />
          ) : (
            <div className="flex h-full items-center justify-center bg-ink">
              <span className={`font-display text-8xl font-bold ${dead ? "text-stone" : accent.text}`}>
                {initials(character.name)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            <span className={`pill bg-ink-raised ${accent.text}`}>Generation {character.generation}</span>
            {character.moral_alignment && <span className="pill bg-ink-raised text-chalk-muted">{character.moral_alignment}</span>}
            {character.relationship_status && <span className="pill bg-ink-raised text-chalk-muted">{character.relationship_status}</span>}
            {dead && <span className="pill bg-stone/15 text-stone">Passed away</span>}
          </div>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-none sm:text-6xl">{character.name}</h1>
          {character.tagline && <p className="mt-4 font-display text-xl italic text-chalk-muted">{character.tagline}</p>}

          {dead && (
            <div className="mt-6 rounded-2xl border border-ink-line bg-ink-raised p-4">
              <p className="label text-chalk-faint">In memory</p>
              <p className="mt-1.5 font-medium">{character.cause_of_death ?? "Cause unknown"}</p>
              {character.death_note && <p className="mt-1 text-sm leading-relaxed text-chalk-muted">{character.death_note}</p>}
            </div>
          )}

          <div className="mt-8">
            <h2 className="label text-chalk-faint">Traits</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {character.traits.length ? character.traits.map((t) => <TraitChip key={t} trait={t} />) : <Empty>No traits yet</Empty>}
            </div>
          </div>

          <div className="mt-7">
            <h2 className="label text-chalk-faint">Hobbies</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {character.hobbies.length ? (
                character.hobbies.map((h) => <Chip key={h}>{h}</Chip>)
              ) : (
                <Empty>No hobbies yet</Empty>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Section title="Work">
          <dl>
            <Row label="Career">{character.career_current ?? <Empty>Not set</Empty>}</Row>
            <Row label="Position">
              {character.career_position ? (
                <>
                  <span className="block">{character.career_position}</span>
                  {position && (
                    <span className="block text-sm text-chalk-faint">
                      Level {position.level}
                      {position.branch && ` · ${position.branch} branch`}
                    </span>
                  )}
                </>
              ) : (
                <Empty>Not set</Empty>
              )}
            </Row>
            <Row label="Dream career">{character.career_endgame ?? <Empty>Not set</Empty>}</Row>
            <Row label="Past jobs">
              {character.past_jobs.length ? (
                <ul className="space-y-1">
                  {character.past_jobs.map((j, i) => (
                    <li key={`${j}-${i}`}>{j}</li>
                  ))}
                </ul>
              ) : (
                <Empty>None yet</Empty>
              )}
            </Row>
          </dl>
        </Section>

        <Section title="Love life">
          <dl>
            <Row label="Status">{character.relationship_status ?? <Empty>Not set</Empty>}</Row>
            <Row label={character.relationship_status === "Married" ? "Spouse" : "Partner"}>
              {family.partner ? (
                <PersonLink person={family.partner} />
              ) : (
                (character.current_partner_name ?? <Empty>Nobody right now</Empty>)
              )}
            </Row>
            <Row label="Past partners">
              {character.past_partners.length ? (
                <ul className="space-y-3">
                  {character.past_partners.map((p, i) => {
                    const linked = p.character_id ? byId.get(p.character_id) : undefined;
                    return (
                      <li key={`${p.name}-${i}`}>
                        {linked ? (
                          <PersonLink person={linked} note={p.note ?? undefined} />
                        ) : (
                          <>
                            <span className="block font-medium">{p.name}</span>
                            {p.note && <span className="block text-sm text-chalk-faint">{p.note}</span>}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <Empty>None on record</Empty>
              )}
            </Row>
          </dl>
        </Section>

        <Section title="Family">
          <dl>
            {(
              [
                ["Parents", family.parents],
                ["Siblings", family.siblings],
                ["Children", family.children],
              ] as const
            ).map(([label, people]) => (
              <Row key={label} label={label}>
                {people.length ? (
                  <ul className="space-y-3">
                    {people.map((p) => (
                      <li key={p.id}>
                        <PersonLink person={p} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty>None</Empty>
                )}
              </Row>
            ))}
          </dl>
        </Section>
      </div>

      {/* Connections */}
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[3fr_2fr]">
        <Section title="Connections">
          <RelationshipWeb character={character} links={web} />
        </Section>
        <Section title="Relationship history">
          {relationships.length ? (
            <ul className="space-y-4">
              {relationships.map((r) => {
                const other = byId.get(r.character_one_id === character.id ? r.character_two_id : r.character_one_id);
                if (!other) return null;
                return (
                  <li key={r.id} className="border-b border-ink-line pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <PersonLink person={other} note={r.relationship_type} />
                      <Chip color={r.status === "active" ? "mint" : r.status === "ended" ? "stone" : "butter"}>{r.status}</Chip>
                    </div>
                    {r.notes && <p className="mt-2 text-sm leading-relaxed text-chalk-muted">{r.notes}</p>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty>No relationships logged yet.</Empty>
          )}
        </Section>
      </div>

      {/* Storybook */}
      <section className="mt-16">
        <h2 className="font-display text-4xl font-semibold">{character.name.split(" ")[0]}&apos;s story</h2>
        <p className="mt-2 text-chalk-muted">Every chapter they appear in, in order.</p>

        {storylines.length ? (
          <div className="mt-10 space-y-6">
            {storylines.map((s, i) => (
              <article key={s.id} id={`story-${s.id}`} className="card mx-auto max-w-3xl scroll-mt-24 p-7 sm:p-12">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className={`pill bg-ink ${GEN_ACCENT[s.generation].text}`}>Chapter {i + 1}</span>
                  {s.era_label && <span className="text-chalk-faint">{s.era_label}</span>}
                  {s.category && <span className="pill bg-ink capitalize text-chalk-muted">{s.category}</span>}
                </div>
                <h3 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{s.title}</h3>
                <StoryContent html={s.content} className="mt-6" />
              </article>
            ))}
          </div>
        ) : (
          <div className="card mt-8 border-dashed px-6 py-12 text-center">
            <p className="font-display text-xl italic text-chalk-muted">No chapters yet. Their story is waiting to be written.</p>
          </div>
        )}
      </section>
    </div>
  );
}
