"use client";

import { useEffect, useState } from "react";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

/** Live date and clock in the visitor's local time — "NOV 18 | 11:30" */
export function Clock({ className = "" }: { className?: string }) {
  // Unknown on the server; filled in on mount so SSR and hydration match
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(new Date());
      // Re-render right after the next minute turns over
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    timer = setTimeout(tick, 0);
    // Catch up after the tab was in the background
    const onVisible = () => document.visibilityState === "visible" && setNow(new Date());
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <time
      dateTime={now?.toISOString()}
      className={`t-body flex items-center gap-4 whitespace-nowrap transition-opacity duration-300 ${now ? "opacity-100" : "opacity-0"} ${className}`}
    >
      <span className="font-semibold uppercase">{now ? dateFmt.format(now) : "Jan 1"}</span>
      <span aria-hidden>|</span>
      <span className="tabular-nums">{now ? timeFmt.format(now) : "00:00"}</span>
    </time>
  );
}
