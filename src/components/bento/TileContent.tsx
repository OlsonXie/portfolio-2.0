"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { TileId } from "@/lib/bento";
import { photos, site } from "@/lib/site";
import { Clock } from "./Clock";

type Props = { id: TileId; photo: number; onPhoto: (i: number) => void };

export function TileContent({ id, photo, onPhoto }: Props) {
  switch (id) {
    case "picture": {
      const current = photo % photos.length;
      const p = photos[current];
      return (
        <>
          <AnimatePresence initial={false}>
            <motion.div
              key={p.src}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={p.src} alt={p.alt} fill priority sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" draggable={false} />
            </motion.div>
          </AnimatePresence>
          {photos.length > 1 && (
            <div
              role="group"
              aria-label="Photos of Oscar"
              className="absolute inset-x-0 bottom-3 z-10 flex justify-center"
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {photos.map((ph, i) => (
                <button
                  key={ph.src}
                  type="button"
                  onClick={() => onPhoto(i)}
                  aria-label={`Show photo ${i + 1} of ${photos.length}`}
                  aria-pressed={i === current}
                  className="grid size-6 place-items-center"
                >
                  <span
                    className={`size-2 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.45)] transition ${i === current ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
                  />
                </button>
              ))}
            </div>
          )}
        </>
      );
    }
    case "works":
      return (
        <div className="relative flex h-full flex-col justify-center p-[var(--pad)]">
          <Clock className="absolute left-[var(--pad)] top-[var(--pad)]" />
          <div className="max-w-[30rem] py-16 lg:py-0">
            <TextBlock eyebrow="Work" title="Selected work" />
            <p className="t-body mt-3">{site.intro}</p>
          </div>
        </div>
      );
    case "about":
      return (
        <div className="flex h-full flex-col justify-end p-[var(--pad)]">
          <div className="max-w-[30rem]">
            <TextBlock eyebrow="About me" title="Let me introduce myself…" />
          </div>
        </div>
      );
  }
}

function TextBlock({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="t-eyebrow">{eyebrow}</p>
      <h2 className="t-display mt-3">{title}</h2>
    </>
  );
}
