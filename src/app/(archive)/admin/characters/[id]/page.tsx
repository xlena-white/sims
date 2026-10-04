import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCharactersLite, getCharacterById, getRelationshipsFor } from "@/lib/data";
import { PREVIEW_MODE } from "@/lib/supabase/env";
import { isUuid } from "@/lib/utils";
import { deleteCharacter } from "../actions";
import { CharacterForm } from "../character-form";
import { DeleteButton } from "../delete-button";
import { RelationshipsEditor } from "../relationships-editor";

export const metadata: Metadata = { title: "Edit character · Admin" };

export default async function EditCharacterPage({ params, searchParams }: PageProps<"/admin/characters/[id]">) {
  const { id } = await params;
  const { created } = await searchParams;
  if (!isUuid(id) && !PREVIEW_MODE) notFound();

  const [character, everyone, relationships] = await Promise.all([
    getCharacterById(id),
    getAllCharactersLite(),
    getRelationshipsFor(id),
  ]);
  if (!character) notFound();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/characters" className="text-sm text-chalk-muted hover:text-chalk">
          ← All characters
        </Link>
        <Link href={`/characters/${character.slug}`} className="btn btn-ghost px-4 py-2 text-sm">
          View page →
        </Link>
      </div>
      <h2 className="mb-6 mt-4 font-display text-3xl font-semibold">{character.name}</h2>

      {created && (
        <p role="status" className="mb-5 rounded-xl bg-mint/10 px-4 py-3 text-sm text-mint">
          {character.name} has been created. You can add relationships below.
        </p>
      )}

      <CharacterForm character={character} everyone={everyone} />

      <div className="mt-5">
        <RelationshipsEditor characterId={character.id} relationships={relationships} everyone={everyone} />
      </div>

      <div className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-danger/30 p-5">
        <p className="text-sm text-chalk-muted">Delete {character.name} and all their relationships. Stories stay, minus this character.</p>
        <DeleteButton name={character.name} action={deleteCharacter.bind(null, character.id)} />
      </div>
    </div>
  );
}
