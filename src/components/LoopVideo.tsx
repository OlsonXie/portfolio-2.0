"use client";

import { useEffect, useRef } from "react";

/**
 * A silent looping clip that behaves like a GIF (much lighter, though).
 * Plays only while on screen; with reduced motion it shows the still frame.
 */
export function LoopVideo({
  src,
  poster,
  label,
  w,
  h,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  w: number;
  h: number;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={w}
      height={h}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      role="img"
      className={className}
    />
  );
}
