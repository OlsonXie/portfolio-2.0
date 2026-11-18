"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BentoState, DEFAULT_STATE, STORAGE_KEY, TileId, Tone, parseState } from "@/lib/bento";

export function useBentoState() {
  const [state, setState] = useState<BentoState>(DEFAULT_STATE);
  const loaded = useRef(false);

  // Load the visitor's saved layout once, then reveal the grid
  useEffect(() => {
    let saved: BentoState | null = null;
    try {
      saved = parseState(window.localStorage.getItem(STORAGE_KEY));
    } catch {}
    // Hydrating from browser storage after SSR is the intended sync here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setState(saved);
    loaded.current = true;
    requestAnimationFrame(() => document.documentElement.classList.remove("bento-pending"));
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const swap = useCallback((a: TileId, b: TileId) => {
    setState((s) => {
      const order = [...s.order];
      const i = order.indexOf(a);
      const j = order.indexOf(b);
      if (i < 0 || j < 0 || i === j) return s;
      [order[i], order[j]] = [order[j], order[i]];
      return { ...s, order };
    });
  }, []);

  const move = useCallback((id: TileId, dir: -1 | 1) => {
    setState((s) => {
      const i = s.order.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= s.order.length) return s;
      const order = [...s.order];
      [order[i], order[j]] = [order[j], order[i]];
      return { ...s, order };
    });
  }, []);

  const setTone = useCallback((id: TileId, tone: Tone) => {
    setState((s) => ({ ...s, tones: { ...s.tones, [id]: tone } }));
  }, []);

  const setPhoto = useCallback((photo: number) => {
    setState((s) => ({ ...s, photo }));
  }, []);

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  return { state, swap, move, setTone, setPhoto, reset };
}
