import Link from "next/link";
import { GEN_ACCENT, type Character } from "@/lib/types";
import { initials } from "./avatar";

export function CharacterCard({ character }: { character: Character }) {
  const accent = GEN_ACCENT[character.generation];
  const dead = character.life_status === "dead";
  return (
    <Link
      href={`/characters/${character.slug}`}
      className="card group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-ink-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink">
        {character.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.photo_url}
            alt={character.name}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${dead ? "grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span
              className={`font-display text-6xl font-bold opacity-80 transition-transform duration-300 group-hover:scale-110 ${dead ? "text-stone" : accent.text}`}
            >
              {initials(character.name)}
            </span>
          </div>
        )}
        {dead && (
          <span className="pill absolute right-3 top-3 bg-ink/80 text-xs text-stone backdrop-blur">Passed away</span>
        )}
        {character.moral_alignment && (
          <span className="pill absolute left-3 top-3 bg-ink/80 text-xs text-chalk backdrop-blur">
            {character.moral_alignment}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl">{character.name}</h3>
        {character.tagline && <p className="mt-1.5 text-sm leading-snug text-chalk-muted">{character.tagline}</p>}
      </div>
    </Link>
  );
}
