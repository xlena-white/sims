"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TimelineEventWithCharacters } from "@/lib/types";
import { EventPanel } from "./event-panel";

/**
 * Horizontally scrolling timeline. Events alternate above and below the axis
 * on larger screens. Drag, swipe, or use the arrows to move through time;
 * click an event to open its details.
 */
export function HorizontalTimeline({
  events,
  accent = "#8ee4a1",
}: {
  events: TimelineEventWithCharacters[];
  accent?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [edges, setEdges] = useState({ start: true, end: false });
  const [selected, setSelected] = useState<TimelineEventWithCharacters | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  // Mouse drag-to-scroll (touch devices scroll natively).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || !scroller.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) d.moved = true;
    scroller.current.scrollLeft = d.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
  };
  const open = (event: TimelineEventWithCharacters) => {
    if (!drag.current.moved) setSelected(event);
    drag.current.moved = false;
  };

  if (events.length === 0) {
    return (
      <div className="mx-5 sm:mx-10">
        <div className="card mx-auto max-w-7xl border-dashed px-6 py-14 text-center">
          <p className="font-display text-2xl italic text-chalk-muted">Nothing has happened yet. Give it time.</p>
          <p className="mt-2 text-sm text-chalk-faint">Add timeline events from the admin panel.</p>
        </div>
      </div>
    );
  }

  const arrow =
    "flex size-11 cursor-pointer items-center justify-center rounded-full border border-ink-line text-chalk-muted transition-colors hover:bg-ink-raised hover:text-chalk disabled:cursor-default disabled:opacity-30";

  return (
    <div className="relative" style={{ "--accent": accent } as React.CSSProperties}>
      {/* Edge fades */}
      <div aria-hidden className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-ink to-transparent transition-opacity sm:w-24 ${edges.start ? "opacity-0" : "opacity-100"}`} />
      <div aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-ink to-transparent transition-opacity sm:w-24 ${edges.end ? "opacity-0" : "opacity-100"}`} />

      <div
        ref={scroller}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar relative cursor-grab snap-x snap-mandatory overflow-x-auto select-none active:cursor-grabbing"
      >
        <ol className="relative flex w-max px-[8vw] md:px-[12vw]">
          {/* The axis */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-[1.5rem] h-0.5 rounded-full md:top-1/2"
            style={{ background: "linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 55%, transparent) 8%, color-mix(in srgb, var(--accent) 55%, transparent) 92%, transparent)" }}
          />

          {events.map((event, i) => {
            const above = i % 2 === 1;
            return (
              <li key={event.id} className="relative flex w-64 shrink-0 snap-center flex-col sm:w-72 md:h-[30rem]">
                {/* Node on the axis */}
                <div className="relative z-[1] flex h-12 items-center justify-center md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2">
                  <span className="block size-4 rounded-full border-[3px] border-ink" style={{ background: "var(--accent)" }} />
                </div>

                {/* Connector + card */}
                <div
                  className={`flex flex-1 flex-col items-center px-2.5 md:absolute md:inset-x-0 md:h-1/2 ${
                    above ? "md:top-0 md:flex-col-reverse md:pb-6" : "md:bottom-0 md:pt-6"
                  }`}
                >
                  <span aria-hidden className="block h-5 w-0.5 opacity-40 md:h-9" style={{ background: "var(--accent)" }} />
                  <button
                    type="button"
                    onClick={() => open(event)}
                    className="card group w-full cursor-pointer p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-ink-hover"
                  >
                    <span className="label" style={{ color: "var(--accent)" }}>
                      {event.era_label ?? "Undated"}
                    </span>
                    <span className="mt-2 block font-display text-xl font-semibold leading-snug sm:text-2xl">{event.title}</span>
                    {event.description && (
                      <span className="mt-2.5 line-clamp-3 block text-sm leading-relaxed text-chalk-muted">
                        {event.description}
                      </span>
                    )}
                    <span className="mt-4 block text-sm font-medium text-chalk-faint transition-colors group-hover:text-chalk">
                      Read more →
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Arrows */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Earlier" className={arrow}>
          ←
        </button>
        <span className="text-sm text-chalk-faint">{events.length} moments</span>
        <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Later" className={arrow}>
          →
        </button>
      </div>

      <EventPanel event={selected} onClose={close} />
    </div>
  );
}
