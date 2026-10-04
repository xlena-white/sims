"use client";

import Link from "next/link";
import { useEffect } from "react";
import { GEN_ACCENT, type TimelineEventWithCharacters } from "@/lib/types";

/** Slide-in side panel with the full details of a timeline event. */
export function EventPanel({
  event,
  onClose,
}: {
  event: TimelineEventWithCharacters | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  const open = Boolean(event);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={event?.title}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-ink-line bg-ink-raised shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:inset-y-3 sm:right-3 sm:rounded-3xl sm:border ${open ? "translate-x-0" : "translate-x-[110%]"}`}
      >
        {event && (
          <div className="flex flex-1 flex-col overflow-y-auto p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <span className={`pill bg-ink ${GEN_ACCENT[event.generation].text}`}>Generation {event.generation}</span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full text-chalk-muted hover:bg-ink-hover hover:text-chalk"
                autoFocus
              >
                ✕
              </button>
            </div>

            <p className={`label mt-10 ${GEN_ACCENT[event.generation].text}`}>{event.era_label ?? "Undated"}</p>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-tight">{event.title}</h2>

            {event.description ? (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-chalk-muted">{event.description}</p>
            ) : (
              <p className="mt-6 italic text-chalk-faint">No description yet.</p>
            )}

            {event.characters.length > 0 && (
              <div className="mt-10">
                <p className="label text-chalk-faint">Who was there</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {event.characters.map((c) => (
                    <li key={c.id}>
                      <Link href={`/characters/${c.slug}`} className="pill bg-ink text-sm text-chalk transition-colors hover:bg-ink-hover">
                        {c.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.storyline_id && (
              <Link href={`/storylines/${event.storyline_id}`} className="btn btn-primary mt-10 self-start">
                Read the story
              </Link>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
