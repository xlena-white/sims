import type { Metadata } from "next";
import Link from "next/link";
import { getAllCharactersLite } from "@/lib/data";
import { CharacterForm } from "../character-form";

export const metadata: Metadata = { title: "New character · Admin" };

export default async function NewCharacterPage() {
  const everyone = await getAllCharactersLite();
  return (
    <div>
      <Link href="/admin/characters" className="text-sm text-chalk-muted hover:text-chalk">
        ← All characters
      </Link>
      <h2 className="mb-6 mt-4 font-display text-3xl font-semibold">New character</h2>
      <CharacterForm character={null} everyone={everyone} />
    </div>
  );
}
