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
  const { playlistId, videoId } = site.youtube;
  const source = playlistId || videoId;
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [track, setTrack] = useState<string>("");

  // Load the player once the turntable scrolls into view, so "play" can start instantly
  useEffect(() => {
    if (!source || !wrap.current) return;
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
        ...(playlistId
          ? { playerVars: { listType: "playlist", list: playlistId, controls: 0, playsinline: 1 } }
          : { videoId, playerVars: { loop: 1, playlist: videoId, controls: 0, playsinline: 1 } }),
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
  }, [source]);

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

  const status = !source
    ? "Hall of Fame playlist is on its way."
    : !ready
      ? "Warming up the needle…"
      : playing
        ? track || "Playing"
        : "Press start to drop the needle";

  return (
    <div ref={wrap}>
      <div className="relative">
        <TurntableArt playing={playing} volume={volume} />

        {/* Accessible controls laid over the drawing */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Stop the record" : "Start the record"}
          className="absolute rounded-full"
          style={hit(START.x, START.y, 22)}
        />
        <button
          type="button"
          onClick={() => player.current?.nextVideo()}
          disabled={!ready || !playlistId}
          aria-label="Next track"
          className="absolute rounded-full disabled:cursor-not-allowed"
          style={hit(NEXT.x, NEXT.y, 22)}
        />
        <label
          className="absolute rounded-md focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--block-cobalt-deep)]"
          style={box(FADER.x - 20, FADER.top - 10, 40, FADER.bottom - FADER.top + 20)}
        >
          <span className="sr-only">Volume</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            className="volume-hit size-full cursor-ns-resize opacity-0"
          />
        </label>
      </div>

      <p className="mt-3 min-h-5 truncate text-sm text-ink-muted" aria-live="polite">
        {playing ? "♪ " : ""}
        {status}
      </p>
      <div ref={host} className="pointer-events-none absolute size-px overflow-hidden opacity-0" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drawing — top-down view. Everything round is an SVG circle, so the  */
/* record stays perfectly circular at any size.                        */
/* ------------------------------------------------------------------ */

const VB = { w: 432, h: 310 };
const REC = { x: 152, y: 155, r: 117 };
const PIVOT = { x: 332, y: 52 };
const START = { x: 34, y: 268 };
const NEXT = { x: 34, y: 42 };
const FADER = { x: 392, top: 140, bottom: 282 };
const ARM_REST = 0;
const ARM_PLAY = 30;
const RPM_DEG_PER_S = 360 / 1.8;

function box(x: number, y: number, w: number, h: number): React.CSSProperties {
  return {
    left: `${(x / VB.w) * 100}%`,
    top: `${(y / VB.h) * 100}%`,
    width: `${(w / VB.w) * 100}%`,
    height: `${(h / VB.h) * 100}%`,
  };
}
function hit(cx: number, cy: number, r: number) {
  return box(cx - r, cy - r, r * 2, r * 2);
}

function arc(r: number, a0: number, a1: number) {
  const rad = (a: number) => (a * Math.PI) / 180;
  const p = (a: number) => `${(r * Math.cos(rad(a))).toFixed(1)} ${(r * Math.sin(rad(a))).toFixed(1)}`;
  return `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
}

function TurntableArt({ playing, volume }: { playing: boolean; volume: number }) {
  const record = useRef<SVGGElement>(null);
  const arm = useRef<SVGGElement>(null);
  const anim = useRef({ angle: 0, speed: 0, arm: ARM_REST });

  // One loop drives the platter (spins up / slows down) and the tonearm
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const m = anim.current;
      const target = playing ? RPM_DEG_PER_S : 0;
      m.speed += (target - m.speed) * Math.min(1, dt * (playing ? 2.2 : 1.4));
      m.angle = (m.angle + m.speed * dt) % 360;
      const armTarget = playing ? ARM_PLAY : ARM_REST;
      m.arm += (armTarget - m.arm) * Math.min(1, dt * 3);
      record.current?.setAttribute("transform", `translate(${REC.x} ${REC.y}) rotate(${m.angle.toFixed(2)})`);
      arm.current?.setAttribute("transform", `rotate(${m.arm.toFixed(2)} ${PIVOT.x} ${PIVOT.y})`);
      const settled = !playing && m.speed < 0.5 && Math.abs(m.arm - armTarget) < 0.05;
      if (!settled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const knobY = FADER.bottom - 8 - (volume / 100) * (FADER.bottom - FADER.top - 16);

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="block h-auto w-full" role="img" aria-label="Record player seen from above">
      <defs>
        <linearGradient id="tt-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2e2e2" />
          <stop offset="0.55" stopColor="#b9b9b9" />
          <stop offset="1" stopColor="#d3d3d3" />
        </linearGradient>
        <pattern id="tt-brush" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="1" height="3" fill="#fff" opacity="0.12" />
        </pattern>
        <radialGradient id="tt-knob" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="1" stopColor="#9a9a9a" />
        </radialGradient>
        <radialGradient id="tt-sheen" cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tt-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f8f8f" />
          <stop offset="0.5" stopColor="#f5f5f5" />
          <stop offset="1" stopColor="#8f8f8f" />
        </linearGradient>
      </defs>

      {/* plinth */}
      <rect width={VB.w} height={VB.h} rx="12" fill="url(#tt-metal)" />
      <rect width={VB.w} height={VB.h} rx="12" fill="url(#tt-brush)" />
      <rect x="0.5" y="0.5" width={VB.w - 1} height={VB.h - 1} rx="11.5" fill="none" stroke="#fff" strokeOpacity="0.6" />

      {/* platter */}
      <circle cx={REC.x} cy={REC.y + 4} r={REC.r} fill="#000" opacity="0.25" />
      <circle cx={REC.x} cy={REC.y} r={REC.r} fill="#2b2b2b" />
      <circle cx={REC.x} cy={REC.y} r={REC.r - 2} fill="none" stroke="#555" strokeDasharray="1.5 3" />

      {/* record */}
      <g ref={record} transform={`translate(${REC.x} ${REC.y})`}>
        <circle r={REC.r - 7} fill="#111" />
        {Array.from({ length: 22 }, (_, k) => (
          <circle key={k} r={44 + k * 3} fill="none" stroke={k % 2 ? "#1d1d1d" : "#151515"} strokeWidth="1.6" />
        ))}
        <path d={arc(95, 200, 232)} stroke="#fff" strokeOpacity="0.28" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={arc(75, 20, 48)} stroke="#fff" strokeOpacity="0.22" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={arc(102, 95, 110)} stroke="#fff" strokeOpacity="0.15" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle r="38" fill="var(--block-cobalt-deep)" />
        <circle r="33" fill="none" stroke="#fff" strokeOpacity="0.35" />
        <text y="-6" textAnchor="middle" fontSize="6" letterSpacing="0.8" fontWeight="700" fill="#fff">
          HALL OF FAME
        </text>
        <text y="14" textAnchor="middle" fontSize="5" letterSpacing="1" fill="#fff" opacity="0.8">
          VINYLJAKTEN
        </text>
        <circle r="3.5" fill="#ddd" />
      </g>
      {/* fixed light reflection on top of the spinning record */}
      <circle cx={REC.x} cy={REC.y} r={REC.r - 7} fill="url(#tt-sheen)" pointerEvents="none" />

      {/* next track */}
      <circle cx={NEXT.x} cy={NEXT.y + 2} r="19" fill="#000" opacity="0.25" />
      <circle cx={NEXT.x} cy={NEXT.y} r="19" fill="url(#tt-knob)" />
      <path d={`M${NEXT.x - 6} ${NEXT.y - 6} l8 6 -8 6z M${NEXT.x + 4} ${NEXT.y - 6} v12`} fill="#333" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />

      {/* start / stop */}
      <circle cx={START.x} cy={START.y + 2} r="19" fill="#000" opacity="0.25" />
      <circle cx={START.x} cy={START.y} r="19" fill="url(#tt-knob)" />
      <circle cx={START.x} cy={START.y} r="7" fill={playing ? "#4cd964" : "#6b8f6f"} style={playing ? { filter: "drop-shadow(0 0 4px #4cd964)" } : undefined} />
      <text x={START.x} y={START.y + 33} textAnchor="middle" fontSize="6" letterSpacing="0.8" fontWeight="600" fill="#333">
        START/STOP
      </text>

      {/* volume fader */}
      <rect x={FADER.x - 17} y={FADER.top} width="34" height={FADER.bottom - FADER.top} rx="5" fill="#222" />
      {Array.from({ length: 9 }, (_, k) => (
        <path key={k} d={`M${FADER.x - 13} ${FADER.top + 12 + k * 15} h5`} stroke="#aaa" strokeWidth="1" />
      ))}
      <rect x={FADER.x - 2} y={FADER.top + 8} width="4" height={FADER.bottom - FADER.top - 16} rx="2" fill="#000" />
      <g transform={`translate(${FADER.x} ${knobY})`}>
        <rect x="-13" y="-8" width="26" height="16" rx="2.5" fill="url(#tt-knob)" stroke="#555" strokeWidth="0.5" />
        <path d="M-8 -3 h16 M-8 0 h16 M-8 3 h16" stroke="#777" strokeWidth="0.8" />
      </g>

      {/* arm rest */}
      <rect x={PIVOT.x + 10} y={PIVOT.y + 150} width="10" height="18" rx="3" fill="#3a3a3a" />

      {/* tonearm */}
      <circle cx={PIVOT.x} cy={PIVOT.y + 3} r="25" fill="#000" opacity="0.2" />
      <circle cx={PIVOT.x} cy={PIVOT.y} r="25" fill="url(#tt-knob)" />
      <circle cx={PIVOT.x} cy={PIVOT.y} r="15" fill="none" stroke="#888" strokeOpacity="0.6" />
      <g ref={arm} transform={`rotate(${ARM_REST} ${PIVOT.x} ${PIVOT.y})`}>
        <rect x={PIVOT.x - 9} y={PIVOT.y - 44} width="18" height="24" rx="4" fill="url(#tt-knob)" stroke="#777" strokeWidth="0.5" />
        <rect x={PIVOT.x - 3} y={PIVOT.y - 22} width="6" height="186" rx="3" fill="url(#tt-arm)" />
        <rect x={PIVOT.x - 9} y={PIVOT.y + 160} width="18" height="20" rx="2" fill="#3a3a3a" />
        <path d={`M${PIVOT.x + 9} ${PIVOT.y + 166} h7`} stroke="#3a3a3a" strokeWidth="3" strokeLinecap="round" />
        <circle cx={PIVOT.x} cy={PIVOT.y} r="7" fill="#e9e9e9" stroke="#888" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
