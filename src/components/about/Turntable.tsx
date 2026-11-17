"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/* Minimal typing for the parts of the YouTube IFrame API we use */
type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  nextVideo(): void;
  setVolume(v: number): void;
  getVideoData(): { title?: string; author?: string };
  destroy(): void;
};
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) return resolve();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

/**
 * Interactive record player. Plays the Vinyl hunt Hall of Fame playlist
 * through a hidden YouTube player: start/stop, next track and volume.
 */
export function Turntable() {
  const playlist = site.youtubePlaylistId;
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [track, setTrack] = useState<string>("");

  // Load the player once the turntable scrolls into view, so "play" can start instantly
  useEffect(() => {
    if (!playlist || !wrap.current) return;
    let cancelled = false;
    const io = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || player.current) return;
      io.disconnect();
      await loadYouTubeApi();
      if (cancelled || !host.current || !window.YT) return;
      player.current = new window.YT.Player(host.current, {
        host: "https://www.youtube-nocookie.com",
        height: "1",
        width: "1",
        playerVars: { listType: "playlist", list: playlist, controls: 0, playsinline: 1 },
        events: {
          onReady: () => {
            player.current?.setVolume(volume);
            setReady(true);
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === 1) {
              setPlaying(true);
              const d = player.current?.getVideoData();
              if (d?.title) setTrack(d.title);
            } else if (e.data === 2 || e.data === 0) {
              setPlaying(false);
            }
          },
        },
      });
    }, { rootMargin: "200px" });
    io.observe(wrap.current);
    return () => {
      cancelled = true;
      io.disconnect();
      player.current?.destroy();
      player.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  const toggle = useCallback(() => {
    if (!player.current || !ready) {
      // No playlist yet: still let the record spin
      setPlaying((p) => !p);
      return;
    }
    if (playing) player.current.pauseVideo();
    else player.current.playVideo();
  }, [playing, ready]);

  const onVolume = (v: number) => {
    setVolume(v);
    player.current?.setVolume(v);
  };

  const status = !playlist
    ? "Hall of Fame playlist is on its way."
    : !ready
      ? "Warming up the needle…"
      : playing
        ? track || "Playing"
        : "Press start to drop the needle";

  return (
    <div ref={wrap}>
      <div
        className="relative aspect-[432/310] w-full overflow-hidden rounded-[var(--radius-tile)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, rgba(0,0,0,0.03) 1px 3px), linear-gradient(160deg, #d9d9d9, #b7b7b7 55%, #cfcfcf)",
        }}
      >
        {/* Platter + record */}
        <div className="absolute left-[8%] top-1/2 aspect-square w-[54%] -translate-y-1/2 rounded-full bg-[#2b2b2b] p-[2.5%] shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
          <div
            className="relative size-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), transparent 40%), repeating-radial-gradient(circle, #111 0 2px, #1c1c1c 2px 4px)",
              animation: "spin 1.8s linear infinite",
              animationPlayState: playing ? "running" : "paused",
            }}
          >
            <div className="absolute left-1/2 top-1/2 grid size-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--block-cobalt-deep)] text-center text-white">
              <span className="text-[clamp(6px,0.8vw,11px)] font-semibold uppercase leading-tight tracking-wider">
                Hall of
                <br />
                Fame
              </span>
              <span className="absolute size-[10%] rounded-full bg-[#ddd]" />
            </div>
          </div>
        </div>

        {/* Tonearm */}
        <div
          className="absolute right-[24%] top-[10%] h-[70%] w-[4%] origin-[50%_8%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `rotate(${playing ? 24 : 4}deg)` }}
          aria-hidden
        >
          <div className="absolute left-1/2 top-0 aspect-square w-[260%] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#f2f2f2] to-[#8d8d8d] shadow-md" />
          <div className="absolute left-1/2 top-[6%] h-[88%] w-[38%] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#9a9a9a] via-[#f4f4f4] to-[#9a9a9a]" />
          <div className="absolute bottom-0 left-1/2 h-[12%] w-[140%] -translate-x-1/2 rounded-sm bg-[#3a3a3a]" />
        </div>

        {/* Start / stop */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Stop the record" : "Start the record"}
          className="absolute bottom-[7%] left-[3%] grid aspect-square w-[9%] place-items-center rounded-full bg-gradient-to-b from-[#f5f5f5] to-[#a9a9a9] shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition active:scale-95"
        >
          <span className={`size-[40%] rounded-full transition ${playing ? "bg-[#4cd964] shadow-[0_0_10px_#4cd964]" : "bg-[#6b8f6f]"}`} />
        </button>
        <span className="pointer-events-none absolute bottom-[2%] left-[3%] w-[9%] text-center text-[clamp(5px,0.55vw,8px)] font-semibold uppercase tracking-wide text-[#333]">
          Start/stop
        </span>

        {/* Next track */}
        <button
          type="button"
          onClick={() => player.current?.nextVideo()}
          disabled={!ready}
          aria-label="Next track"
          className="absolute left-[3%] top-[7%] grid aspect-square w-[9%] place-items-center rounded-full bg-gradient-to-b from-[#f5f5f5] to-[#a9a9a9] text-[#333] shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition active:scale-95 disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="size-[45%]" fill="currentColor" aria-hidden>
            <path d="M5 5l9 7-9 7V5zm10 0h3v14h-3z" />
          </svg>
        </button>

        {/* Volume fader */}
        <div className="absolute bottom-[8%] right-[5%] top-[44%] flex w-[9%] justify-center rounded-md bg-[#222] py-[3%] shadow-inner">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            aria-label="Volume"
            className="volume-fader h-full"
          />
        </div>
      </div>

      <p className="mt-3 min-h-5 truncate text-sm text-ink-muted" aria-live="polite">
        {playing ? "♪ " : ""}
        {status}
      </p>
      <div ref={host} className="pointer-events-none absolute size-px overflow-hidden opacity-0" aria-hidden />
    </div>
  );
}
