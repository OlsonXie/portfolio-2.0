export type TileId = "picture" | "works" | "about";

/** Fixed home layout: picture over About in the narrow column, Selected work tall in the wide one */
export const LAYOUT: Record<TileId, { col: number; row: string; tone: "paper" | "signal" }> = {
  picture: { col: 0, row: "1", tone: "paper" },
  about: { col: 0, row: "2", tone: "signal" },
  works: { col: 1, row: "1 / span 2", tone: "paper" },
};

/** DOM / mobile order */
export const ORDER: TileId[] = ["picture", "works", "about"];

/** Which tile opens which route */
export const TILE_ROUTE: Partial<Record<TileId, string>> = {
  works: "/work",
  about: "/about",
};

export function routeToTile(pathname: string): TileId | null {
  if (pathname.startsWith("/work")) return "works";
  if (pathname.startsWith("/about")) return "about";
  return null;
}

/** grid-template-columns (Figma: 650 + 1078) with the wide column at `wideCol` */
export const columns = (wideCol: number) => (wideCol === 0 ? "1078fr 650fr" : "650fr 1078fr");
