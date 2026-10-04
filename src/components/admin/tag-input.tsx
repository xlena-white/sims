"use client";

import { useId, useMemo, useState } from "react";

/**
 * A list of short text values (jobs, hobbies…). Pick from suggestions or type
 * anything and press Enter. The list is submitted as JSON in a hidden field.
 */
export function TagInput({
  name,
  suggestions,
  defaultValue = [],
  placeholder = "Type and press Enter",
  ordered = false,
}: {
  name: string;
  suggestions: string[];
  defaultValue?: string[];
  placeholder?: string;
  /** Show as a numbered list (for things where order matters, like past jobs). */
  ordered?: boolean;
}) {
  const [values, setValues] = useState<string[]>(defaultValue);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const listId = useId();

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const taken = new Set(values.map((v) => v.toLowerCase()));
    return suggestions.filter((s) => !taken.has(s.toLowerCase()) && (!q || s.toLowerCase().includes(q))).slice(0, 8);
  }, [query, suggestions, values]);

  const add = (raw: string) => {
    const value = raw.trim();
    if (value && !values.some((v) => v.toLowerCase() === value.toLowerCase())) setValues([...values, value]);
    setQuery("");
  };
  const remove = (i: number) => setValues(values.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...values];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    setValues(next);
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(values)} />

      {values.length > 0 &&
        (ordered ? (
          <ol className="mb-3 space-y-1.5">
            {values.map((v, i) => (
              <li key={v} className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-sm">
                <span className="w-5 text-chalk-faint">{i + 1}.</span>
                <span className="flex-1">{v}</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${v} up`} className="px-1 text-chalk-faint hover:text-chalk disabled:opacity-30">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === values.length - 1} aria-label={`Move ${v} down`} className="px-1 text-chalk-faint hover:text-chalk disabled:opacity-30">↓</button>
                <button type="button" onClick={() => remove(i)} aria-label={`Remove ${v}`} className="px-1 text-chalk-faint hover:text-danger">✕</button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mb-3 flex flex-wrap gap-2">
            {values.map((v, i) => (
              <span key={v} className="pill bg-ink text-chalk">
                {v}
                <button type="button" onClick={() => remove(i)} aria-label={`Remove ${v}`} className="text-chalk-faint hover:text-danger">
                  ✕
                </button>
              </span>
            ))}
          </div>
        ))}

      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(query);
            } else if (e.key === "Backspace" && !query && values.length) {
              remove(values.length - 1);
            }
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          className="field"
        />
        {open && matches.length > 0 && (
          <ul id={listId} role="listbox" className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-xl border border-ink-line bg-ink-raised p-1 shadow-xl">
            {matches.map((m) => (
              <li key={m}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(m)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-hover"
                >
                  {m}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
