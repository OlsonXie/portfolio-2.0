"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { TileId } from "@/lib/bento";
import { photos, site } from "@/lib/site";
import { cases } from "@/lib/cases";

const featured = cases.find((c) => c.slug === "ssab-wear-iq")!;

export function TileContent({ id, photo }: { id: TileId; photo: number }) {
  switch (id) {
    case "picture": {
      const p = photos[photo % photos.length];
      return (
        <AnimatePresence initial={false}>
          <motion.div
            key={p.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={p.src} alt={p.alt} fill priority sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" draggable={false} />
          </motion.div>
        </AnimatePresence>
      );
    }
    case "works":
      return (
        <div className="flex h-full flex-col gap-6 p-6 lg:p-10">
          <div className="relative flex min-h-0 flex-1 items-end">
            <div className="relative aspect-[1620/1043] h-full max-h-full max-w-full overflow-hidden rounded-md shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]">
              <Image src={featured.cover.src} alt="" fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" draggable={false} />
            </div>
          </div>
          <div>
            <h2 className="text-[clamp(2.25rem,3.6vw,4rem)] leading-none tracking-tight">Selected work</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-snug text-[var(--tone-fg-muted)] lg:text-lg">{site.intro}</p>
          </div>
        </div>
      );
    case "links":
      return (
        <div className="flex h-full flex-col justify-end p-6 lg:p-10">
          <ul className="text-[clamp(2.25rem,3.6vw,4rem)] leading-[1.15] tracking-tight">
            <li><TileLink href={site.links.instagram}>Instagram</TileLink></li>
            <li><TileLink href={site.links.linkedin}>LinkedIn</TileLink></li>
            <li><TileLink href={site.links.email}>Email</TileLink></li>
          </ul>
        </div>
      );
    case "about":
      return (
        <TextTile
          eyebrow="About"
          title="Let me introduce myself…"
          body="Guitarist turned art director turned design systems designer. The story, a record player and a few photos."
        />
      );
    case "extras":
      return (
        <TextTile
          eyebrow="Extras"
          title="Motion, apps, and other stuff I enjoy creating"
          body="Motion for Bolon Studios, a card game and a ski app in the making."
        />
      );
  }
}

function TileLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group inline-flex items-baseline gap-3 decoration-2 underline-offset-[0.15em] hover:underline"
      draggable={false}
    >
      {children}
      <span aria-hidden className="text-[0.5em] opacity-0 transition group-hover:opacity-100">↗</span>
    </a>
  );
}

function TextTile({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="flex h-full flex-col justify-end p-6 lg:p-10">
      <p className="text-sm font-medium uppercase tracking-wide lg:text-lg">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(2rem,3.3vw,3.5rem)] leading-[1.08] tracking-tight">{title}</h2>
      <p className="mt-4 max-w-md text-[15px] leading-snug text-[var(--tone-fg-muted)] lg:text-base">{body}</p>
    </div>
  );
}
