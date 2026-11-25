"use client";

import { photos } from "@/lib/site";
import { Slideshow } from "@/components/Slideshow";

/** The profile picture on the home page — a swipe/click slideshow of photos */
export function PhotoSwitcher({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  return (
    <Slideshow
      images={photos}
      index={index}
      onChange={onChange}
      priority
      sizes="(min-width: 1024px) 38vw, 100vw"
      label="Choose photo"
    />
  );
}
