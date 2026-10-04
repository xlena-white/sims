"use client";

import { useState } from "react";
import { CHIP_COLORS } from "@/components/chip";
import { TRAIT_GROUPS, traitColor } from "@/lib/sims-data";

/**
 * Pick traits from every Sims 4 pack, grouped by category, or type in custom
 * ones (mods, CC, new packs). Submitted as JSON in a hidden field.
 */
export function TraitPicker({ name, defaultValue = [] }: { name: string; defaultValue?: string[] }) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [search, setSearch] = useState("");
  const [custom, setCustom] = useState("");

  const has = (t: string) => selected.some((s) => s.toLowerCase() === t.toLowerCase());
  const toggle = (t: string) =>
    setSelected(has(t) ? selected.filter((s) => s.toLowerCase() !== t.toLowerCase()) : [...selected, t]);
  const addCustom = () => {
    const t = custom.trim();
    if (t && !has(t)) setSelected([...selected, t]);
    setCustom("");
  };

  const q = search.trim().toLowerCase();
  const groups = TRAIT_GROUPS.map((g) => ({ ...g, traits: g.traits.filter((t) => !q || t.toLowerCase().includes(q)) })).filter(
    (g) => g.traits.length > 0,
  );

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(selected)} />

      <div className="min-h-11 rounded-xl border border-ink-line bg-ink p-2.5">
        {selected.length ? (
          <div className="flex flex-wrap gap-2">
            {selected.map((t) => (
              <span key={t} className={`pill ${CHIP_COLORS[traitColor(t)]}`}>
                {t}
                <button type="button" onClick={() => toggle(t)} aria-label={`Remove ${t}`} className="opacity-70 hover:opacity-100">
                  ✕
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="px-1 py-1 text-sm text-chalk-faint">No traits picked yet. Choose some below.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search traits…" className="field sm:flex-1" />
        <div className="flex gap-2 sm:flex-1">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="Custom or modded trait"
            className="field"
          />
          <button type="button" onClick={addCustom} className="btn btn-ghost shrink-0 px-4">
            Add
          </button>
        </div>
      </div>

      <div className="max-h-[26rem] space-y-5 overflow-y-auto rounded-xl border border-ink-line p-4">
        {groups.map((g) => (
          <div key={g.name}>
            <p className="label mb-2.5 text-chalk-faint">{g.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {g.traits.map((t) => {
                const on = has(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggle(t)}
                    aria-pressed={on}
                    className={`pill cursor-pointer border transition-colors ${
                      on ? `${CHIP_COLORS[g.color]} border-transparent` : "border-ink-line text-chalk-muted hover:border-chalk-faint hover:text-chalk"
                    }`}
                  >
                    {on && "✓ "}
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-chalk-faint">
            No match. Type it in the custom box to add &ldquo;{search}&rdquo; as a new trait.
          </p>
        )}
      </div>
    </div>
  );
}
