"use client";

import { useActionState, useState } from "react";
import { ComboInput, flat } from "@/components/admin/combo-input";
import { Field, FormCard, initialFormState, SaveRow } from "@/components/admin/form-bits";
import { PhotoUpload } from "@/components/admin/photo-upload";
import { TagInput } from "@/components/admin/tag-input";
import { TraitPicker } from "@/components/admin/trait-picker";
import { getFamily } from "@/lib/family";
import { ALIGNMENTS, CAREERS, DEATH_CAUSES, HOBBIES, positionsFor, RELATIONSHIP_STATUSES } from "@/lib/sims-data";
import type { Character, CharacterLite, GenerationNumber } from "@/lib/types";
import { saveCharacter } from "./actions";

type Relation = "parent" | "child" | "sibling" | "partner";

const RELATION_LABEL: Record<Relation, string> = {
  parent: "Parent",
  child: "Child",
  sibling: "Sibling",
  partner: "Partner / spouse",
};

function defaultGeneration(relation: Relation, own: number): GenerationNumber {
  const g = relation === "parent" ? own - 1 : relation === "child" ? own + 1 : own;
  return Math.min(3, Math.max(1, g)) as GenerationNumber;
}

export function CharacterForm({ character, everyone }: { character: Character | null; everyone: CharacterLite[] }) {
  const [state, action, pending] = useActionState(saveCharacter, initialFormState);
  const others = everyone.filter((c) => c.id !== character?.id);
  const nameOf = (id: string | null) => everyone.find((c) => c.id === id)?.name ?? "";

  const [generation, setGeneration] = useState<number>(character?.generation ?? 1);
  const [alive, setAlive] = useState(character?.life_status !== "dead");
  const [career, setCareer] = useState(character?.career_current ?? "");
  const [position, setPosition] = useState(character?.career_position ?? "");
  const positionGroups = positionsFor(career).map((g) => ({
    label: g.label,
    options: g.positions.map((p) => ({ value: p.title, hint: `Level ${p.level}` })),
  }));

  const [pastPartners, setPastPartners] = useState(
    (character?.past_partners ?? []).map((p) => ({ name: p.name, note: p.note ?? "" })),
  );
  const updatePartner = (i: number, key: "name" | "note", value: string) =>
    setPastPartners(pastPartners.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));

  const [newFamily, setNewFamily] = useState<{ relation: Relation; name: string; generation: GenerationNumber }[]>([]);
  const addFamilyRow = (relation: Relation) =>
    setNewFamily([...newFamily, { relation, name: "", generation: defaultGeneration(relation, generation) }]);
  const updateFamilyRow = (i: number, patch: Partial<(typeof newFamily)[number]>) =>
    setNewFamily(newFamily.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  // Clear the "add family" rows once a save succeeds (they now exist as real characters).
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.ok) setNewFamily([]);
  }

  const family = character ? getFamily(character, everyone) : null;

  return (
    <form action={action} className="space-y-5">
      {character && <input type="hidden" name="id" value={character.id} />}
      <datalist id="character-names">
        {others.map((c) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>

      <FormCard title="The basics">
        <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
          <Field label="Name">
            <input name="name" defaultValue={character?.name} required className="field text-lg" />
          </Field>
          <Field label="Generation">
            <select
              name="generation"
              value={generation}
              onChange={(e) => setGeneration(Number(e.target.value))}
              className="field"
            >
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
          <div>
            <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Moral alignment</span>
            <ComboInput name="moral_alignment" groups={flat(ALIGNMENTS)} defaultValue={character?.moral_alignment ?? ""} customLabel="custom alignment" />
          </div>
        </div>
      </FormCard>

      <FormCard title="Alive or not">
        <input type="hidden" name="life_status" value={alive ? "alive" : "dead"} />
        <div role="radiogroup" aria-label="Life status" className="inline-flex rounded-full border border-ink-line bg-ink p-1">
          {[
            { value: true, label: "Alive" },
            { value: false, label: "Passed away" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={alive === o.value}
              onClick={() => setAlive(o.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                alive === o.value ? (o.value ? "bg-mint text-ink" : "bg-stone text-ink") : "text-chalk-muted hover:text-chalk"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {!alive && (
          <div className="grid gap-5 sm:grid-cols-[16rem_1fr]">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-chalk-muted">How they died</span>
              <ComboInput name="cause_of_death" groups={flat(DEATH_CAUSES)} defaultValue={character?.cause_of_death ?? ""} customLabel="cause" placeholder="Pick or type…" />
            </div>
            <Field label="What happened (optional)">
              <textarea name="death_note" defaultValue={character?.death_note ?? ""} rows={2} maxLength={1000} className="field resize-y" />
            </Field>
          </div>
        )}
      </FormCard>

      <FormCard title="Traits" hint="Every trait from the base game and packs, sorted by type. Missing one? Add it as a custom trait.">
        <TraitPicker name="traits" defaultValue={character?.traits} />
      </FormCard>

      <FormCard title="Hobbies">
        <TagInput name="hobbies" suggestions={HOBBIES} defaultValue={character?.hobbies} placeholder="e.g. Gardening, Fishing… press Enter to add" />
      </FormCard>

      <FormCard title="Work" hint="Pick a career, then their position in it. Using a mod career? Just type its name.">
        <div className="grid gap-5 lg:grid-cols-3">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Career</span>
            <ComboInput
              name="career_current"
              groups={flat(CAREERS)}
              value={career}
              onChange={(v) => {
                if (v !== career) setPosition("");
                setCareer(v);
              }}
              placeholder="Pick or type a career"
              customLabel="custom career"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Position</span>
            <ComboInput
              name="career_position"
              groups={positionGroups}
              value={position}
              onChange={setPosition}
              placeholder={career ? "Pick or type their position" : "Choose a career first"}
              customLabel="custom position"
              emptyHint={career ? "No official positions for this career. Type one in." : "Choose a career first."}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Dream career</span>
            <ComboInput name="career_endgame" groups={flat(CAREERS)} defaultValue={character?.career_endgame ?? ""} customLabel="custom career" />
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Past jobs, oldest first</span>
          <TagInput name="past_jobs" suggestions={CAREERS} defaultValue={character?.past_jobs} placeholder="Add a job and press Enter" ordered />
        </div>
      </FormCard>

      <FormCard title="Love life" hint="Type a name. If it matches another character, it links to their page automatically.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Relationship status</span>
            <ComboInput name="relationship_status" groups={flat(RELATIONSHIP_STATUSES)} defaultValue={character?.relationship_status ?? ""} customLabel="custom status" />
          </div>
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

      <FormCard title="Family" hint="Siblings and children are worked out from parents automatically.">
        {family && (family.parents.length > 0 || family.siblings.length > 0 || family.children.length > 0) && (
          <dl className="grid gap-3 rounded-xl bg-ink p-4 text-sm sm:grid-cols-3">
            {(
              [
                ["Parents", family.parents],
                ["Siblings", family.siblings],
                ["Children", family.children],
              ] as const
            ).map(([label, people]) => (
              <div key={label}>
                <dt className="text-chalk-faint">{label}</dt>
                <dd className="mt-0.5">{people.length ? people.map((p) => p.name).join(", ") : "None"}</dd>
              </div>
            ))}
          </dl>
        )}

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

        <div>
          <p className="text-sm font-medium text-chalk-muted">Add family members</p>
          <p className="mt-0.5 text-xs text-chalk-faint">
            Type a name. If they&apos;re already in the story they get linked; if not, a new character is created for them, and you can fill in their details later.
          </p>
          <input type="hidden" name="new_family" value={JSON.stringify(newFamily)} />
          {newFamily.length > 0 && (
            <div className="mt-3 space-y-2.5">
              {newFamily.map((row, i) => (
                <div key={i} className="grid gap-2 rounded-xl bg-ink p-3 sm:grid-cols-[10rem_1fr_9rem_auto] sm:items-center">
                  <select
                    value={row.relation}
                    onChange={(e) => {
                      const relation = e.target.value as Relation;
                      updateFamilyRow(i, { relation, generation: defaultGeneration(relation, generation) });
                    }}
                    aria-label="Relation"
                    className="field"
                  >
                    {(Object.keys(RELATION_LABEL) as Relation[]).map((r) => (
                      <option key={r} value={r}>
                        {RELATION_LABEL[r]}
                      </option>
                    ))}
                  </select>
                  <input
                    value={row.name}
                    onChange={(e) => updateFamilyRow(i, { name: e.target.value })}
                    list="character-names"
                    placeholder="Their name"
                    aria-label="Family member name"
                    className="field"
                  />
                  <select
                    value={row.generation}
                    onChange={(e) => updateFamilyRow(i, { generation: Number(e.target.value) as GenerationNumber })}
                    aria-label="Their generation"
                    className="field"
                  >
                    <option value={1}>Gen 1</option>
                    <option value={2}>Gen 2</option>
                    <option value={3}>Gen 3</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setNewFamily(newFamily.filter((_, idx) => idx !== i))}
                    className="justify-self-end px-2 text-chalk-faint hover:text-danger"
                    aria-label="Remove row"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(RELATION_LABEL) as Relation[]).map((r) => (
              <button key={r} type="button" onClick={() => addFamilyRow(r)} className="btn btn-ghost px-4 py-2 text-sm">
                + {RELATION_LABEL[r]}
              </button>
            ))}
          </div>
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
