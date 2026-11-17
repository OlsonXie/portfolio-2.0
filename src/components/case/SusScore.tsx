import Image from "next/image";
import { Frame } from "./Frame";

/**
 * SUS (System Usability Scale) before/after for Bris.
 * The scale bar shows where the scores land on 0–100, with the
 * commonly used adjective bands underneath.
 */
const BANDS = [
  { from: 0, to: 51, label: "Poor" },
  { from: 51, to: 68, label: "OK" },
  { from: 68, to: 80.3, label: "Good" },
  { from: 80.3, to: 100, label: "Excellent" },
];

export function SusScore() {
  return (
    <section aria-labelledby="sus-title" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="sus-title" className="text-sm font-semibold uppercase tracking-wide lg:text-base">
            Usability score (SUS)
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted lg:text-base">
            Usability testing with the core age group, before and after the redesign. Validated with follow-up
            expectation-measurement testing.
          </p>
        </div>
      </div>

      <div className="grid gap-[var(--gap)] sm:grid-cols-2">
        <ScoreCard
          tag="Before"
          score="50–74"
          grade="Poor"
          tone="#b4232f"
          images={[
            { src: "/work/bris-old1.webp", alt: "The old Bris start page on mobile", w: 640, h: 1118 },
            { src: "/work/bris-old2.webp", alt: "The old Bris donation page on mobile", w: 640, h: 1133 },
          ]}
        />
        <ScoreCard
          tag="After"
          score="81.6"
          grade="Excellent"
          tone="#1d6446"
          images={[
            { src: "/work/bris-m3.webp", alt: "The redesigned Bris start page", w: 640, h: 1387 },
            { src: "/work/bris-m7.webp", alt: "The redesigned topic page about sleep", w: 640, h: 1387 },
          ]}
        />
      </div>

      {/* Scale */}
      <div className="rounded-[var(--radius-tile)] bg-[var(--frame-grey)] px-5 py-6 lg:px-8" aria-hidden>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-[#e4b3b6] via-[#efe0a8] to-[#9fd1b5]">
          <div className="absolute inset-y-[-6px] rounded-full border-2 border-[#b4232f] bg-[#b4232f]/15" style={{ left: "50%", width: "24%" }} />
          <div className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#1d6446] shadow" style={{ left: "81.6%" }} />
        </div>
        <div className="mt-3 flex text-xs text-ink-muted lg:text-sm">
          {BANDS.map((b) => (
            <span key={b.label} style={{ width: `${b.to - b.from}%` }} className="border-l border-ink/15 pl-1.5">
              {b.label}
              <span className="block tabular-nums opacity-70">{b.from}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">SUS score rose from between 50 and 74, rated poor, to 81.6, rated excellent.</p>
    </section>
  );
}

function ScoreCard({
  tag,
  score,
  grade,
  tone,
  images,
}: {
  tag: string;
  score: string;
  grade: string;
  tone: string;
  images: { src: string; alt: string; w: number; h: number }[];
}) {
  return (
    <Frame bg="pink" className="flex flex-col">
      <div className="flex items-start justify-center gap-3 px-6 pb-2 pt-8">
        {images.map((img) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={img.w}
            height={img.h}
            sizes="160px"
            className="h-[220px] w-auto rounded-md shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 lg:h-[260px]"
          />
        ))}
      </div>
      <figcaption className="flex items-end justify-between gap-3 p-5 lg:p-6">
        <span className="text-sm font-medium uppercase tracking-wide text-ink-muted">{tag}</span>
        <span className="text-right">
          <span className="block text-4xl font-medium tabular-nums tracking-tight lg:text-5xl" style={{ color: tone }}>
            {score}
          </span>
          <span className="text-sm font-medium" style={{ color: tone }}>
            {grade}
          </span>
        </span>
      </figcaption>
    </Frame>
  );
}
