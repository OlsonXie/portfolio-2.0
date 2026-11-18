"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TONES, TONE_LABEL, Tone } from "@/lib/bento";

type Props = {
  label: string;
  tone: Tone;
  onTone: (t: Tone) => void;
  onMove: (dir: -1 | 1) => void;
  onReset: () => void;
  extra?: React.ReactNode;
};

/** Small floating controls in a tile's corner: colour picker, move, reset */
export function TileControls({ label, tone, onTone, onMove, onReset, extra }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="tile-controls absolute right-3 top-3 z-20 flex items-start gap-2"
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {extra}
      <button
        type="button"
        aria-label={`Customize ${label} block`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center border border-[var(--stroke)] bg-white text-ink transition hover:bg-ink hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" />
          <path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.7 5.7 0 0 0 22 9.7C22 5.4 17.5 2 12 2Z" />
        </svg>
      </button>
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={`${label} block settings`}
          className="absolute right-0 top-11 w-[252px] border border-[var(--stroke)] bg-white p-3 text-ink"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Colour</p>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Block colour">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={tone === t}
                aria-label={TONE_LABEL[t]}
                title={TONE_LABEL[t]}
                data-tone={t}
                onClick={() => onTone(t)}
                className={`size-9 border border-[var(--stroke)] transition ${tone === t ? "outline-2 outline-offset-2 outline-ink" : "hover:scale-110"}`}
              />
            ))}
          </div>
          <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-ink-muted">Position</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => onMove(-1)} className="flex-1 border border-[var(--stroke)] px-2 py-2 text-sm hover:bg-ink hover:text-white">
              ← Earlier
            </button>
            <button type="button" onClick={() => onMove(1)} className="flex-1 border border-[var(--stroke)] px-2 py-2 text-sm hover:bg-ink hover:text-white">
              Later →
            </button>
          </div>
          <button type="button" onClick={onReset} className="mt-3 w-full px-2 py-1.5 text-sm text-ink-muted underline-offset-2 hover:underline">
            Reset layout
          </button>
        </div>
      )}
    </div>
  );
}
