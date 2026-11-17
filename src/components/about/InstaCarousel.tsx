"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { instagram, site } from "@/lib/site";

const COUNT = 6;

/** A random handful of Instagram photos, shuffled on every visit */
export function InstaCarousel() {
  const [pics, setPics] = useState(instagram.slice(0, COUNT));
  const [i, setI] = useState(0);

  useEffect(() => {
    const shuffled = [...instagram].sort(() => Math.random() - 0.5).slice(0, COUNT);
    // Shuffle after hydration so server and client markup match
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPics(shuffled);
  }, []);

  const go = (d: number) => setI((x) => (x + d + pics.length) % pics.length);

  return (
    <figure>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-tile)] bg-line">
        <AnimatePresence initial={false}>
          <motion.div
            key={pics[i].src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Image src={pics[i].src} alt={pics[i].alt} fill sizes="(min-width: 1024px) 18vw, 50vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>

        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize" />
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize" />

        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
          {pics.map((p, k) => (
            <span key={p.src} className={`size-1.5 rounded-full transition ${k === i ? "bg-white" : "bg-white/45"}`} />
          ))}
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-between text-sm">
        <span>Selection of Insta</span>
        <a href={site.links.instagram} target="_blank" rel="noreferrer" className="font-medium hover:underline">
          {site.links.instagramHandle}
        </a>
      </figcaption>
    </figure>
  );
}
