export type TileId = "picture" | "works" | "links" | "about" | "extras";

export const TONES = [
  "paper",
  "cobalt-soft",
  "sage-soft",
  "orchid-soft",
  "clay-soft",
  "cobalt-deep",
  "forest-deep",
  "plum-deep",
  "oxblood-deep",
] as const;
export type Tone = (typeof TONES)[number];

export const TONE_LABEL: Record<Tone, string> = {
  paper: "Paper",
  "cobalt-soft": "Cobalt mist",
  "sage-soft": "Sage",
  "orchid-soft": "Orchid",
  "clay-soft": "Clay rose",
  "cobalt-deep": "Cobalt",
  "forest-deep": "Forest",
  "plum-deep": "Plum",
  "oxblood-deep": "Oxblood",
};

export type BentoState = {
  order: TileId[];
  tones: Record<TileId, Tone>;
  photo: number;
};

/** Tiles that span two columns on desktop */
export const WIDE: Partial<Record<TileId, boolean>> = { works: true };

/** Which tile opens which route */
export const TILE_ROUTE: Partial<Record<TileId, string>> = {
  works: "/work",
  about: "/about",
  extras: "/other",
};

export const DEFAULT_STATE: BentoState = {
  order: ["picture", "works", "links", "about", "extras"],
  tones: {
    picture: "paper",
    works: "paper",
    links: "paper",
    about: "cobalt-soft",
    extras: "paper",
  },
  photo: 0,
};

export const STORAGE_KEY = "bento:v1";

export function routeToTile(pathname: string): TileId | null {
  if (pathname.startsWith("/work")) return "works";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/other")) return "extras";
  return null;
}

/**
 * Simulates CSS grid `dense` auto-placement for a 3×2 grid so we know
 * which column each tile starts in. Used to decide which side the
 * open panel expands toward.
 */
export function placeTiles(order: TileId[], cols = 3) {
  const taken = new Set<string>();
  const pos: Record<string, { col: number; row: number }> = {};
  for (const id of order) {
    const span = WIDE[id] ? 2 : 1;
    outer: for (let row = 0; row < 10; row++) {
      for (let col = 0; col + span <= cols; col++) {
        const cells = Array.from({ length: span }, (_, i) => `${row}:${col + i}`);
        if (cells.every((c) => !taken.has(c))) {
          cells.forEach((c) => taken.add(c));
          pos[id] = { col, row };
          break outer;
        }
      }
    }
  }
  return pos as Record<TileId, { col: number; row: number }>;
}

export function parseState(raw: string | null): BentoState | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as BentoState;
    const ids = new Set(DEFAULT_STATE.order);
    if (!Array.isArray(s.order) || s.order.length !== ids.size || !s.order.every((id) => ids.has(id))) return null;
    const tones = { ...DEFAULT_STATE.tones };
    for (const id of DEFAULT_STATE.order) {
      if (TONES.includes(s.tones?.[id])) tones[id] = s.tones[id];
    }
    return { order: s.order, tones, photo: Number.isInteger(s.photo) ? s.photo : 0 };
  } catch {
    return null;
  }
}
