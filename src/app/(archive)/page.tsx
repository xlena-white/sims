import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Plumbob } from "@/components/plumbob";
import { getAllCharactersLite, getGenerations, getSiteSettings } from "@/lib/data";
import { GEN_ACCENT } from "@/lib/types";

export default async function HomePage() {
  const [settings, generations, characters] = await Promise.all([
    getSiteSettings(),
    getGenerations(),
    getAllCharactersLite(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(142,228,161,0.10),transparent_55%)]"
        />
        <Plumbob className="relative h-16 w-auto animate-bob sm:h-20" />
        {settings.subtitle && (
          <p className="pill relative mt-8 animate-rise bg-ink-raised text-chalk-muted [animation-delay:100ms]">
            {settings.subtitle}
          </p>
        )}
        <h1 className="relative mt-6 max-w-4xl animate-rise font-display text-6xl font-semibold leading-[0.95] tracking-tight [animation-delay:200ms] sm:text-8xl">
          {settings.title}
        </h1>
        {settings.epigraph && (
          <p className="relative mt-7 max-w-lg animate-fade font-display text-xl italic text-chalk-muted [animation-delay:500ms] sm:text-2xl">
            {settings.epigraph}
          </p>
        )}
        <a href="#generations" className="btn btn-ghost relative mt-10 animate-fade [animation-delay:700ms]">
          Meet the family <span aria-hidden>↓</span>
        </a>
      </section>

      {/* Generations */}
      <section id="generations" className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 sm:px-10">
        <h2 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">The generations</h2>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {generations.map((gen) => {
            const accent = GEN_ACCENT[gen.number];
            const people = characters.filter((c) => c.generation === gen.number);
            return (
              <Link
                key={gen.number}
                href={`/generations/${gen.number}`}
                className="card group relative flex min-h-[26rem] flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-ink-hover"
              >
                {gen.cover_image_url && (
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gen.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-ink-raised to-transparent" />
                  </div>
                )}

                <div className="relative flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className={`pill bg-ink text-sm ${accent.text}`}>Generation {gen.number}</span>
                    <span
                      aria-hidden
                      className={`font-display text-6xl font-bold leading-none opacity-90 transition-transform duration-300 group-hover:-rotate-6 ${accent.text}`}
                      style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
                    >
                      {gen.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-3xl font-semibold leading-tight">{gen.name}</h3>
                  {gen.tagline && <p className={`mt-1 font-display text-lg italic ${accent.text}`}>{gen.tagline}</p>}
                  {gen.description && <p className="mt-4 leading-relaxed text-chalk-muted">{gen.description}</p>}

                  <div className="mt-auto flex items-center justify-between pt-8">
                    <div className="flex items-center">
                      <div className="flex -space-x-2.5">
                        {people.slice(0, 5).map((p) => (
                          <Avatar
                            key={p.id}
                            name={p.name}
                            photoUrl={p.photo_url}
                            generation={p.generation}
                            className="size-9 text-xs ring-2 ring-ink-raised"
                          />
                        ))}
                      </div>
                      <span className="ml-3 text-sm text-chalk-faint">
                        {people.length === 0 ? "No one yet" : `${people.length} ${people.length === 1 ? "person" : "people"}`}
                      </span>
                    </div>
                    <span aria-hidden className="text-xl text-chalk-faint transition-all group-hover:translate-x-1 group-hover:text-chalk">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
