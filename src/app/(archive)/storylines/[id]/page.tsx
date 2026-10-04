import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { StoryContent } from "@/components/story-content";
import { getStorylineById } from "@/lib/data";
import { PREVIEW_MODE } from "@/lib/supabase/env";
import { GEN_ACCENT } from "@/lib/types";

const UUID = /^[0-9a-f-]{36}$/i;

async function load(params: PageProps<"/storylines/[id]">["params"]) {
  const { id } = await params;
  // Preview data uses short ids; real ones are UUIDs (anything else would be a database error).
  if (!UUID.test(id) && !PREVIEW_MODE) notFound();
  return getStorylineById(id);
}

export async function generateMetadata({ params }: PageProps<"/storylines/[id]">): Promise<Metadata> {
  return { title: (await load(params))?.title ?? "Story" };
}

export default async function StorylinePage({ params }: PageProps<"/storylines/[id]">) {
  const story = await load(params);
  if (!story) notFound();
  const accent = GEN_ACCENT[story.generation];

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-10">
      <Link href={`/generations/${story.generation}`} className="text-sm text-chalk-muted hover:text-chalk">
        ← Generation {story.generation}
      </Link>
      <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
        {story.era_label && <span className={`pill bg-ink-raised ${accent.text}`}>{story.era_label}</span>}
        {story.category && <span className="pill bg-ink-raised capitalize text-chalk-muted">{story.category}</span>}
      </div>
      <h1 className="mt-5 font-display text-5xl font-semibold leading-tight sm:text-6xl">{story.title}</h1>
      {story.characters.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {story.characters.map((c) => (
            <li key={c.id}>
              <Link href={`/characters/${c.slug}`} className="pill bg-ink-raised py-1 pl-1 text-chalk transition-colors hover:bg-ink-hover">
                <Avatar name={c.name} photoUrl={c.photo_url} generation={c.generation} className="size-6 text-[0.6rem]" />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <StoryContent html={story.content} className="mt-12" />
    </article>
  );
}
