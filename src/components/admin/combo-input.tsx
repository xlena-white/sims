"use client";

import { useId, useMemo, useState } from "react";

export interface ComboGroup {
  label?: string;
  options: { value: string; hint?: string }[];
}

/**
 * A single-value dropdown you can also type into. Pick a suggestion, or type
 * something new (a mod career, a custom position) and it's used as-is.
 * Works controlled (value + onChange) or uncontrolled (defaultValue).
 */
export function ComboInput({
  name,
  groups,
  value: controlled,
  defaultValue = "",
  onChange,
  placeholder,
  customLabel = "custom",
  emptyHint,
  id,
}: {
  name: string;
  groups: ComboGroup[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Word used in the "Use “…” as a custom ___" option. */
  customLabel?: string;
  /** Shown in the dropdown when there are no suggestions at all. */
  emptyHint?: string;
  id?: string;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;
  const set = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onChange?.(v);
  };
  const [open, setOpen] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const listId = useId();

  const q = filtering ? value.trim().toLowerCase() : "";
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, options: g.options.filter((o) => !q || o.value.toLowerCase().includes(q)) }))
        .filter((g) => g.options.length > 0),
    [groups, q],
  );
  const exact = groups.some((g) => g.options.some((o) => o.value.toLowerCase() === value.trim().toLowerCase()));
  const showCustom = value.trim() !== "" && !exact;
  const hasAny = groups.some((g) => g.options.length > 0);

  const pick = (v: string) => {
    set(v);
    setFiltering(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value.trim()} />
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(e) => {
            set(e.target.value);
            setFiltering(true);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setOpen(false);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          autoComplete="off"
          className="field pr-9"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Show options"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setFiltering(false);
            setOpen(!open);
          }}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-chalk-faint hover:text-chalk"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {open && (filtered.length > 0 || showCustom || (!hasAny && emptyHint)) && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-xl border border-ink-line bg-ink-raised p-1 shadow-2xl"
        >
          {showCustom && (
            <li>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(value.trim())}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-mint hover:bg-ink-hover"
              >
                + Use &ldquo;{value.trim()}&rdquo; as a {customLabel}
              </button>
            </li>
          )}
          {!hasAny && emptyHint && <li className="px-3 py-2 text-sm text-chalk-faint">{emptyHint}</li>}
          {filtered.map((g, gi) => (
            <li key={g.label ?? gi}>
              {g.label && <p className="label px-3 pb-1 pt-2.5 text-[0.65rem] text-chalk-faint">{g.label}</p>}
              <ul>
                {g.options.map((o) => (
                  <li key={o.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={o.value === value}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(o.value)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-hover ${
                        o.value === value ? "text-mint" : ""
                      }`}
                    >
                      <span>{o.value}</span>
                      {o.hint && <span className="shrink-0 text-xs text-chalk-faint">{o.hint}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Turns a flat list of strings into a single ComboInput group. */
export const flat = (values: string[]): ComboGroup[] => [{ options: values.map((value) => ({ value })) }];
