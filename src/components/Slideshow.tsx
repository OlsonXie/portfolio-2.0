"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { PageDots } from "@/components/PageDots";

const SWIPE_DISTANCE = 60; // px
const SWIPE_VELOCITY = 400; // px/s

const slide = {
  enter: (dir: number) => ({ x: `${dir * 35}%`, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: `${dir * -35}%`, opacity: 0 }),
};

export type Slide = { src: string; alt: string };

/**
 * Fills its (positioned) parent. Swipe left/right (touch or mouse drag) to
 * change image, click / tap for the next one, arrow keys when focused, dots to
 * jump. Controlled via index/onChange, or keeps its own state.
 */
export function Slideshow({
  images,
  index,
  onChange,
  sizes,
  priority,
  label = "Choose image",
}: {
  images: Slide[];
  index?: number;
  onChange?: (i: number) => void;
  sizes: string;
  priority?: boolean;
  label?: string;
}) {
  const [own, setOwn] = useState(0);
  const [dir, setDir] = useState(1);
  const lastDrag = useRef(0);
  const count = images.length;
  const raw = index ?? own;
  const current = ((raw % count) + count) % count;
  const img = images[current];

  const set = (i: number, d: number) => {
    setDir(d);
    if (onChange) onChange(i);
    else setOwn(i);
  };
  const go = (step: 1 | -1) => count > 1 && set((current + step + count) % count, step);

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
        aria-label={`Image ${current + 1} of ${count}: ${img.alt}. Show next image`}
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
            key={img.src}
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
              src={img.src}
              alt=""
              fill
              priority={priority}
              sizes={sizes}
              className="pointer-events-none select-none object-cover"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </button>

      <PageDots count={count} current={current} label={label} onSelect={(i) => i !== current && set(i, i > current ? 1 : -1)} />
    </>
  );
}
