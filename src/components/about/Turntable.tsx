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
      <div className="relative rounded-[var(--radius-tile)] bg-[var(--frame-grey)] px-[4%] pb-[2%] pt-[5%]">
        <div className="relative">
        <TurntableArt playing={playing} volume={volume} />

        {/* Accessible controls laid over the drawing */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Stop the record" : "Start the record"}
          className="absolute rounded-full"
          style={hit(100, 278, 30)}
        />
        <button
          type="button"
          onClick={() => player.current?.nextVideo()}
          disabled={!ready || !playlistId}
          aria-label="Next track"
          className="absolute rounded-md disabled:cursor-not-allowed"
          style={hit(490, 292, 22)}
        />
        <label
          className="absolute rounded-md focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--block-cobalt-deep)]"
          style={box(562, 196, 38, 112)}
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
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const VB = { w: 640, h: 380 };
// Position an overlay on top of the drawing using drawing coordinates
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

const INK = "#151515";
const PIVOT = { x: 520, y: 97 };
const ARM_REST = -12;
const ARM_PLAY = 33;
const RPM_DEG_PER_S = 360 / 1.8;

function arc(r: number, a0: number, a1: number) {
  const rad = (a: number) => (a * Math.PI) / 180;
  const p = (a: number) => `${(r * Math.cos(rad(a))).toFixed(1)} ${(r * Math.sin(rad(a))).toFixed(1)}`;
  return `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
}

function TurntableArt({ playing, volume }: { playing: boolean; volume: number }) {
  const record = useRef<SVGGElement>(null);
  const arm = useRef<SVGGElement>(null);
  const motion = useRef({ angle: 0, speed: 0, arm: ARM_REST });

  // One animation loop drives both the platter (spins up / slows down) and the tonearm
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const m = motion.current;
      const target = playing ? RPM_DEG_PER_S : 0;
      m.speed += (target - m.speed) * Math.min(1, dt * (playing ? 2.2 : 1.4));
      m.angle = (m.angle + m.speed * dt) % 360;
      const armTarget = playing ? ARM_PLAY : ARM_REST;
      m.arm += (armTarget - m.arm) * Math.min(1, dt * 3);
      record.current?.setAttribute("transform", `rotate(${m.angle.toFixed(2)})`);
      arm.current?.setAttribute("transform", `rotate(${m.arm.toFixed(2)} ${PIVOT.x} ${PIVOT.y})`);
      const settled = !playing && m.speed < 0.5 && Math.abs(m.arm - armTarget) < 0.05;
      if (!settled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Rest post sits under the headshell when the arm is parked
  const restRad = (ARM_REST * Math.PI) / 180;
  const head = { x: -8, y: 166 };
  const rest = {
    x: PIVOT.x + head.x * Math.cos(restRad) - head.y * Math.sin(restRad),
    y: PIVOT.y + head.x * Math.sin(restRad) + head.y * Math.cos(restRad),
  };
  const knobY = 296 - (volume / 100) * 92;
  const s = { vectorEffect: "non-scaling-stroke" } as const;

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="block h-auto w-full" role="img" aria-label="Line drawing of a record player">
      {/* floor shadow */}
      <ellipse cx="320" cy="362" rx="300" ry="10" fill={INK} opacity="0.08" />

      {/* front face of the plinth */}
      <path d="M40 300 L40 338 Q40 350 52 350 L588 350 Q600 350 600 338 L600 300" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M48 344 L592 344" stroke={INK} strokeWidth="1" opacity="0.35" />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <path key={k} d={`M${470 + k * 16} 342 l10 -32`} stroke={INK} strokeWidth="1" opacity="0.18" />
      ))}
      <text x="320" y="330" textAnchor="middle" fontSize="11" letterSpacing="4" fill={INK} fontWeight="600">
        VINYLJAKTEN · HALL OF FAME
      </text>
      <text x="100" y="330" textAnchor="middle" fontSize="8" letterSpacing="1.5" fill={INK}>
        START/STOP
      </text>
      <rect x="66" y="350" width="34" height="9" rx="2" fill={INK} />
      <rect x="540" y="350" width="34" height="9" rx="2" fill={INK} />

      {/* top plane, tilted toward the viewer */}
      <g transform="translate(0 20) scale(1 0.55)">
        <rect x="40" y="40" width="560" height="510" rx="26" fill="#fff" stroke={INK} strokeWidth="2" {...s} />
        <rect x="54" y="54" width="532" height="482" rx="18" fill="none" stroke={INK} strokeWidth="1" opacity="0.35" {...s} />

        {/* platter */}
        <circle cx="270" cy="310" r="210" fill="#fff" stroke={INK} strokeWidth="2" {...s} />
        <circle cx="270" cy="310" r="202" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="2 6" opacity="0.6" {...s} />

        {/* record */}
        <g transform="translate(270 310)">
          <g ref={record}>
            <circle r="192" fill={INK} />
            {[178, 166, 154, 142, 130, 118, 106, 94, 82].map((r) => (
              <circle key={r} r={r} fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.2" {...s} />
            ))}
            {/* highlights that turn with the record, so the spin reads */}
            <path d={arc(160, 200, 238)} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" {...s} />
            <path d={arc(124, 205, 250)} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" {...s} />
            <path d={arc(172, 18, 52)} stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" {...s} />
            <path d={arc(110, 25, 60)} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" {...s} />
            <path d={arc(142, 110, 130)} stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" {...s} />
            {/* label */}
            <circle r="64" fill="#fff" stroke={INK} strokeWidth="2" {...s} />
            <circle r="54" fill="none" stroke={INK} strokeWidth="1" opacity="0.5" {...s} />
            <text y="-24" textAnchor="middle" fontSize="11" letterSpacing="1" fontWeight="700" fill={INK}>
              VINYLJAKTEN
            </text>
            <text y="34" textAnchor="middle" fontSize="9" letterSpacing="1.5" fill={INK}>
              HALL OF FAME
            </text>
            <circle r="7" fill="#fff" stroke={INK} strokeWidth="2" {...s} />
          </g>
        </g>

        {/* start / stop button */}
        <circle cx="100" cy="470" r="28" fill="#fff" stroke={INK} strokeWidth="2" {...s} />
        <circle cx="100" cy="470" r="18" fill={playing ? INK : "#fff"} stroke={INK} strokeWidth="1.5" {...s} />
        <circle cx="142" cy="500" r="6" fill={playing ? "#3ccf6e" : "#fff"} stroke={INK} strokeWidth="1.5" {...s} />

        {/* next track */}
        <rect x="470" y="478" width="40" height="30" rx="6" fill="#fff" stroke={INK} strokeWidth="2" {...s} />

        {/* tonearm base plate */}
        <circle cx={PIVOT.x} cy="140" r="46" fill="#fff" stroke={INK} strokeWidth="2" {...s} />
        <circle cx={PIVOT.x} cy="140" r="38" fill="none" stroke={INK} strokeWidth="1" opacity="0.4" {...s} />
      </g>

      {/* next-track glyph (screen space so it stays crisp) */}
      <path d="M485 287 l8 5 -8 5z M495 287 v10" fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />

      {/* volume fader */}
      {Array.from({ length: 10 }, (_, k) => (
        <path key={k} d={`M565 ${204 + k * 10} h7`} stroke={INK} strokeWidth="1" opacity={k % 5 === 0 ? 0.9 : 0.45} />
      ))}
      <rect x="577" y="200" width="8" height="100" rx="4" fill={INK} />
      <g transform={`translate(581 ${knobY})`}>
        <rect x="-14" y="-8" width="28" height="16" rx="3" fill="#fff" stroke={INK} strokeWidth="2" />
        <path d="M-8 -3 h16 M-8 0 h16 M-8 3 h16" stroke={INK} strokeWidth="1" />
      </g>
      <text x="581" y="194" textAnchor="middle" fontSize="8" letterSpacing="1" fill={INK}>VOL</text>

      {/* arm rest */}
      <path d={`M${rest.x} ${rest.y + 4} v14`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d={`M${rest.x - 7} ${rest.y + 2} q7 6 14 0`} stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* tonearm pivot tower */}
      <path d={`M${PIVOT.x - 22} ${PIVOT.y} v12 a22 10 0 0 0 44 0 v-12`} fill="#fff" stroke={INK} strokeWidth="2" />
      <ellipse cx={PIVOT.x} cy={PIVOT.y} rx="22" ry="10" fill="#fff" stroke={INK} strokeWidth="2" />

      {/* tonearm */}
      <g ref={arm} transform={`rotate(${ARM_REST} ${PIVOT.x} ${PIVOT.y})`}>
        <g transform={`translate(${PIVOT.x} ${PIVOT.y})`}>
          <rect x="-13" y="-52" width="26" height="28" rx="5" fill="#fff" stroke={INK} strokeWidth="2" />
          <path d="M-13 -44 h26 M-13 -36 h26" stroke={INK} strokeWidth="1" opacity="0.5" />
          <path d="M0 -24 V0" stroke={INK} strokeWidth="4" />
          <path d="M0 0 L0 132 Q0 148 -9 158" stroke={INK} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M0 0 L0 132 Q0 148 -9 158" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M-24 154 L4 150 L8 172 L-20 176 Z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 160 l10 -3" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M-8 176 v6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <circle r="7" fill="#fff" stroke={INK} strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}
