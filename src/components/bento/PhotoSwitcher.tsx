"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { photos } from "@/lib/site";
import { PageDots } from "@/components/PageDots";

const SWIPE_DISTANCE = 60; // px
const SWIPE_VELOCITY = 400; // px/s

const slide = {
  enter: (dir: number) => ({ x: `${dir * 35}%`, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: `${dir * -35}%`, opacity: 0 }),
};

/**
 * The profile picture. Swipe (touch or mouse drag) left/right to change photo,
 * or click / tap for the next one. Arrow keys work when it has focus.
 */
export function PhotoSwitcher({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const [dir, setDir] = useState(1);
  const lastDrag = useRef(0);
  const count = photos.length;
  const current = ((index % count) + count) % count;
  const p = photos[current];

  const go = (step: 1 | -1) => {
    if (count < 2) return;
    setDir(step);
    onChange((current + step + count) % count);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    lastDrag.current = Date.now();
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(-1);
  };

  return (
    <>
      <button
        type="button"
        aria-label={`Photo ${current + 1} of ${count}: ${p.alt}. Show next photo`}
        className="absolute inset-0 cursor-pointer overflow-hidden"
        onClick={() => {
          // A swipe also ends in a click — only real taps step forward
          if (Date.now() - lastDrag.current < 300) return;
          go(1);
        }}
        onKeyDown={(e) => {
          const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (step) {
            e.preventDefault();
            go(step);
          }
        }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={p.src}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.35}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={p.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="pointer-events-none select-none object-cover"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </button>

      <PageDots
        count={count}
        current={current}
        label="Choose photo"
        onSelect={(i) => {
          if (i === current) return;
          setDir(i > current ? 1 : -1);
          onChange(i);
        }}
      />
    </>
  );
}
