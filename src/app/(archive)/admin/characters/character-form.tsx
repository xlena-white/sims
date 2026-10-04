"use client";

import { useActionState, useState } from "react";
import { Field, FormCard, initialFormState, SaveRow } from "@/components/admin/form-bits";
import { PhotoUpload } from "@/components/admin/photo-upload";
import { TagInput } from "@/components/admin/tag-input";
import { TraitPicker } from "@/components/admin/trait-picker";
import { ALIGNMENTS, CAREERS, HOBBIES, RELATIONSHIP_STATUSES } from "@/lib/sims-data";
import type { Character, CharacterLite } from "@/lib/types";
import { saveCharacter } from "./actions";

export function CharacterForm({ character, everyone }: { character: Character | null; everyone: CharacterLite[] }) {
  const [state, action, pending] = useActionState(saveCharacter, initialFormState);
  const others = everyone.filter((c) => c.id !== character?.id);
  const nameOf = (id: string | null) => everyone.find((c) => c.id === id)?.name ?? "";

  const [pastPartners, setPastPartners] = useState(
    (character?.past_partners ?? []).map((p) => ({ name: p.name, note: p.note ?? "" })),
  );
  const updatePartner = (i: number, key: "name" | "note", value: string) =>
    setPastPartners(pastPartners.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));

  return (
    <form action={action} className="space-y-5">
      {character && <input type="hidden" name="id" value={character.id} />}
      <datalist id="character-names">
        {others.map((c) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>
      <datalist id="careers">
        {CAREERS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <FormCard title="The basics">
        <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
          <Field label="Name">
            <input name="name" defaultValue={character?.name} required className="field text-lg" />
          </Field>
          <Field label="Generation">
            <select name="generation" defaultValue={character?.generation ?? 1} className="field">
              <option value={1}>Generation 1</option>
              <option value={2}>Generation 2</option>
              <option value={3}>Generation 3</option>
            </select>
          </Field>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Photo</span>
          <PhotoUpload name="photo_url" folder="characters" defaultValue={character?.photo_url} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="One-liner (optional)" hint="Shows under their name on character cards.">
            <input name="tagline" defaultValue={character?.tagline ?? ""} maxLength={200} className="field" />
          </Field>
          <Field label="Moral alignment">
            <input name="moral_alignment" list="alignments" defaultValue={character?.moral_alignment ?? ""} className="field" />
            <datalist id="alignments">
              {ALIGNMENTS.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </Field>
        </div>
      </FormCard>

      <FormCard title="Traits" hint="Every trait from the base game and packs, sorted by type. Missing one? Add it as a custom trait.">
        <TraitPicker name="traits" defaultValue={character?.traits} />
      </FormCard>

      <FormCard title="Hobbies">
        <TagInput name="hobbies" suggestions={HOBBIES} defaultValue={character?.hobbies} placeholder="e.g. Gardening, Fishing… press Enter to add" />
      </FormCard>

      <FormCard title="Work">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Current job">
            <input name="career_current" list="careers" defaultValue={character?.career_current ?? ""} placeholder="e.g. Culinary (Sous Chef)" className="field" />
          </Field>
          <Field label="Dream job">
            <input name="career_endgame" list="careers" defaultValue={character?.career_endgame ?? ""} className="field" />
          </Field>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Past jobs, oldest first</span>
          <TagInput name="past_jobs" suggestions={CAREERS} defaultValue={character?.past_jobs} placeholder="Add a job and press Enter" ordered />
        </div>
      </FormCard>

      <FormCard title="Love life" hint="Type a name. If it matches another character, it links to their page automatically.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Relationship status">
            <input name="relationship_status" list="statuses" defaultValue={character?.relationship_status ?? ""} className="field" />
            <datalist id="statuses">
              {RELATIONSHIP_STATUSES.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field label="Current partner or spouse">
            <input
              name="current_partner"
              list="character-names"
              defaultValue={character ? nameOf(character.current_partner_id) || (character.current_partner_name ?? "") : ""}
              className="field"
            />
          </Field>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Key past partners</span>
          <input type="hidden" name="past_partners" value={JSON.stringify(pastPartners)} />
          <div className="space-y-2.5">
            {pastPartners.map((p, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-xl bg-ink p-3 sm:flex-row sm:items-center">
                <input
                  value={p.name}
                  onChange={(e) => updatePartner(i, "name", e.target.value)}
                  list="character-names"
                  placeholder="Name"
                  aria-label="Past partner name"
                  className="field sm:w-56"
                />
                <input
                  value={p.note}
                  onChange={(e) => updatePartner(i, "note", e.target.value)}
                  placeholder="What happened? (optional)"
                  aria-label="Note"
                  className="field flex-1"
                />
                <button
                  type="button"
                  onClick={() => setPastPartners(pastPartners.filter((_, idx) => idx !== i))}
                  className="self-end px-2 text-chalk-faint hover:text-danger sm:self-auto"
                  aria-label="Remove past partner"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setPastPartners([...pastPartners, { name: "", note: "" }])} className="btn btn-ghost mt-3 px-4 py-2 text-sm">
            + Add past partner
          </button>
        </div>
      </FormCard>

      <FormCard title="Family" hint="Just pick the parents. Siblings and children are worked out automatically.">
        <div className="grid gap-5 sm:grid-cols-2">
          {(["parent_one_id", "parent_two_id"] as const).map((key, i) => (
            <Field key={key} label={`Parent ${i + 1}`}>
              <select name={key} defaultValue={character?.[key] ?? ""} className="field">
                <option value="">Not in the story</option>
                {others.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Gen {c.generation})
                  </option>
                ))}
              </select>
            </Field>
          ))}
        </div>
        <Field label="Order in their generation" hint="Lower numbers show first in the character grid.">
          <input name="sort_order" type="number" defaultValue={character?.sort_order ?? 0} className="field w-32" />
        </Field>
      </FormCard>

      <div className="sticky bottom-4 z-10 rounded-2xl border border-ink-line bg-ink-raised/95 p-4 shadow-2xl backdrop-blur">
        <SaveRow pending={pending} state={state} label={character ? "Save changes" : "Create character"} />
      </div>
    </form>
  );
}
