import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterCard } from "@/components/character-card";
import { HorizontalTimeline } from "@/components/horizontal-timeline";
import { getCharactersByGeneration, getGeneration, getTimelineEvents } from "@/lib/data";
import { GEN_ACCENT, isGenerationNumber } from "@/lib/types";

async function parseNumber(params: PageProps<"/generations/[number]">["params"]) {
  const n = Number((await params).number);
  if (!isGenerationNumber(n)) notFound();
  return n;
}

export async function generateMetadata({ params }: PageProps<"/generations/[number]">): Promise<Metadata> {
  const n = await parseNumber(params);
  const gen = await getGeneration(n);
  return { title: gen?.name ?? `Generation ${n}` };
}

export default async function GenerationPage({ params }: PageProps<"/generations/[number]">) {
  const n = await parseNumber(params);
  const [gen, characters, events] = await Promise.all([
    getGeneration(n),
    getCharactersByGeneration(n),
    getTimelineEvents(n),
  ]);
  if (!gen) notFound();

  const accent = GEN_ACCENT[n];
  const keyEvents = events.filter((e) => e.is_key_event);
  const prev = n > 1 ? n - 1 : null;
  const next = n < 3 ? n + 1 : null;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-10 sm:pt-40">
        {gen.cover_image_url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gen.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-linear-to-b from-ink/50 via-ink/80 to-ink" />
          </>
        )}
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className={`pill animate-rise bg-ink-raised ${accent.text}`}>Generation {n}</span>
            <h1 className="mt-5 animate-rise font-display text-5xl font-semibold leading-none [animation-delay:100ms] sm:text-7xl">
              {gen.name}
            </h1>
            {gen.tagline && (
              <p className={`mt-4 animate-rise font-display text-2xl italic [animation-delay:200ms] ${accent.text}`}>
                {gen.tagline}
              </p>
            )}
            {gen.description && (
              <p className="mt-6 animate-fade text-lg leading-relaxed text-chalk-muted [animation-delay:350ms]">
                {gen.description}
              </p>
            )}
          </div>
          <span
            aria-hidden
            className={`hidden font-display text-[11rem] font-bold leading-[0.8] opacity-20 md:block ${accent.text}`}
          >
            {n}
          </span>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-20">
        <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-5 sm:px-10">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Key moments</h2>
          <p className="hidden text-sm text-chalk-faint sm:block">Drag or swipe to scroll through time</p>
        </div>
        <HorizontalTimeline events={keyEvents} accent={accent.hex} />
      </section>

      {/* Characters */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-10">
        <h2 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">The people</h2>

        {characters.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {characters.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        ) : (
          <div className="card border-dashed px-6 py-14 text-center">
            <p className="font-display text-2xl italic text-chalk-muted">Nobody here yet.</p>
            <Link href="/admin/characters/new" className="btn btn-primary mt-6">
              Add a character
            </Link>
          </div>
        )}
      </section>

      {/* Prev / next generation */}
      <nav className="mx-auto flex max-w-7xl justify-between gap-4 px-5 pb-16 sm:px-10">
        {prev ? (
          <Link href={`/generations/${prev}`} className="btn btn-ghost">
            ← Generation {prev}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/generations/${next}`} className="btn btn-ghost">
            Generation {next} →
          </Link>
        )}
      </nav>
    </>
  );
}
