"use client";

/**
 * Pagination dots laid over a photo — shared by the profile picture and the
 * Instagram carousel so they look and behave the same: 8px dots in 24px hit
 * areas, 12px from the bottom edge, with a soft shadow for light photos.
 */
export function PageDots({
  count,
  current,
  onSelect,
  label,
}: {
  count: number;
  current: number;
  onSelect: (i: number) => void;
  label: string;
}) {
  if (count < 2) return null;
  return (
    <div role="group" aria-label={label} className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show photo ${i + 1} of ${count}`}
          aria-pressed={i === current}
          className="group/dot grid size-6 place-items-center"
        >
          <span
            className={`size-2 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.45)] transition ${
              i === current ? "bg-white" : "bg-white/50 group-hover/dot:bg-white/80"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
