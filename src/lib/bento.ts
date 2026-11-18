export type TileId = "picture" | "works" | "about";

export const TONES = [
  "paper",
  "signal",
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
  paper: "White",
  signal: "Signal red",
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

/** The tall tile fills a whole column (both rows) on desktop */
export const TALL: TileId = "works";

/** Which tile opens which route */
export const TILE_ROUTE: Partial<Record<TileId, string>> = {
  works: "/work",
  about: "/about",
};

export const DEFAULT_STATE: BentoState = {
  order: ["picture", "works", "about"],
  tones: {
    picture: "paper",
    works: "paper",
    about: "signal",
  },
  photo: 0,
};

export const STORAGE_KEY = "bento:v2";

export function routeToTile(pathname: string): TileId | null {
  if (pathname.startsWith("/work")) return "works";
  if (pathname.startsWith("/about")) return "about";
  return null;
}

/** Column widths from the Figma frame: 650 + 1078 */
export const NARROW = "650fr";
export const WIDE = "1078fr";

/**
 * Two columns, two rows. The tall tile takes a whole column — the left one if
 * it comes first in the visitor's order, otherwise the right — and the other
 * two tiles stack in the remaining column, in order.
 */
export function placeTiles(order: TileId[]) {
  const tallCol = order[0] === TALL ? 0 : 1;
  const pos = {} as Record<TileId, { col: number; row: number; tall: boolean }>;
  let row = 0;
  for (const id of order) {
    if (id === TALL) pos[id] = { col: tallCol, row: 0, tall: true };
    else pos[id] = { col: 1 - tallCol, row: row++, tall: false };
  }
  return { pos, tallCol };
}

/** grid-template-columns with the wide column at `wideCol` */
export const columns = (wideCol: number) => (wideCol === 0 ? `${WIDE} ${NARROW}` : `${NARROW} ${WIDE}`);

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
