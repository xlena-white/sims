"use client";

import { useActionState } from "react";
import { Field, FormCard, initialFormState, SaveRow } from "@/components/admin/form-bits";
import { RELATIONSHIP_STATES, RELATIONSHIP_TYPES } from "@/lib/sims-data";
import type { CharacterLite, Relationship } from "@/lib/types";
import { addRelationship, deleteRelationship } from "./actions";

export function RelationshipsEditor({
  characterId,
  relationships,
  everyone,
}: {
  characterId: string;
  relationships: Relationship[];
  everyone: CharacterLite[];
}) {
  const [state, action, pending] = useActionState(addRelationship, initialFormState);
  const byId = new Map(everyone.map((c) => [c.id, c]));
  const others = everyone.filter((c) => c.id !== characterId);

  return (
    <FormCard
      title="Relationships"
      hint="Friends, rivals, exes, siblings whose parents aren't in the story. These show up in the connections web."
    >
      {relationships.length > 0 && (
        <ul className="divide-y divide-ink-line rounded-xl border border-ink-line">
          {relationships.map((r) => {
            const other = byId.get(r.character_one_id === characterId ? r.character_two_id : r.character_one_id);
            return (
              <li key={r.id} className="flex items-start justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <p className="font-medium">
                    {other?.name ?? "Unknown"} <span className="font-normal text-chalk-faint">· {r.relationship_type} · {r.status}</span>
                  </p>
                  {r.notes && <p className="mt-0.5 text-sm text-chalk-muted">{r.notes}</p>}
                </div>
                <form action={deleteRelationship.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="text-sm text-chalk-faint hover:text-danger"
                    onClick={(e) => {
                      if (!confirm(`Remove this relationship with ${other?.name ?? "this character"}?`)) e.preventDefault();
                    }}
                  >
                    Remove
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      {/* Re-keyed when the list changes, so the fields clear after adding one. */}
      <form key={relationships.length} action={action} className="space-y-4 rounded-xl bg-ink p-4">
        <input type="hidden" name="character_one_id" value={characterId} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="With">
            <select name="character_two_id" required defaultValue="" className="field">
              <option value="" disabled>
                Choose…
              </option>
              {others.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type">
            <input name="relationship_type" list="relationship-types" required placeholder="e.g. Best friends" className="field" />
            <datalist id="relationship-types">
              {RELATIONSHIP_TYPES.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Status">
            <select name="status" defaultValue="active" className="field capitalize">
              {RELATIONSHIP_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Notes (optional)">
          <input name="notes" className="field" />
        </Field>
        <SaveRow pending={pending} state={state} label="Add relationship" />
      </form>
    </FormCard>
  );
}
