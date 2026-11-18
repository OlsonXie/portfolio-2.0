"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { LAYOUT, ORDER, TILE_ROUTE, TileId, columns, routeToTile } from "@/lib/bento";
import { TileContent } from "./TileContent";

const LABEL: Record<TileId, string> = {
  picture: "Picture",
  works: "Selected work",
  about: "About me",
};

const spring = { type: "spring", bounce: 0.12, duration: 0.65 } as const;

/** Every block carries the same thin black stroke; the 1px grid gap sits under it */
const STROKE = "shadow-[0_0_0_1px_var(--stroke)]";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = routeToTile(pathname);
  const [photo, setPhoto] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // New page in the panel → start at the top
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
    if (window.matchMedia("(max-width: 1023px)").matches) window.scrollTo({ top: 0 });
  }, [pathname]);

  // Open panel: it takes the column its tile lives in (made wide); the other
  // two tiles stay put, stacked in the narrow column.
  const panelCol = active ? LAYOUT[active].col : LAYOUT.works.col;
  const visible = active ? ORDER.filter((id) => id !== active) : ORDER;
  // Static tiles next to an open panel, in reading order (picture before the rest)
  const staticOrder = (["picture", "about", "works"] as TileId[]).filter((id) => id !== active);

  return (
    <LayoutGroup>
      <div
        className="grid grid-cols-1 gap-px p-px lg:h-dvh lg:grid-rows-2 lg:[grid-template-columns:var(--cols)]"
        style={{ "--cols": columns(panelCol) } as React.CSSProperties}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((id) => (
            <Tile
              key={id}
              id={id}
              href={TILE_ROUTE[id]}
              placement={
                active
                  ? { col: String(2 - panelCol), row: String(staticOrder.indexOf(id) + 1) }
                  : { col: String(LAYOUT[id].col + 1), row: LAYOUT[id].row }
              }
              hideOnMobile={active !== null}
            >
              <TileContent id={id} photo={photo} onPhoto={setPhoto} />
            </Tile>
          ))}

          {active !== null && (
            <motion.section
              key="panel"
              layoutId={`tile-${active}`}
              transition={spring}
              data-tone="paper"
              aria-label={LABEL[active]}
              className={`relative overflow-hidden ${STROKE} lg:[grid-column:var(--col)] lg:[grid-row:1/span_2]`}
              style={{ "--col": String(panelCol + 1) } as React.CSSProperties}
            >
              <div ref={panelRef} className="min-h-dvh lg:absolute lg:inset-0 lg:min-h-0 lg:overflow-y-auto">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {children}
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

type TileProps = {
  id: TileId;
  href?: string;
  placement: { col: string; row: string };
  hideOnMobile?: boolean;
  children: React.ReactNode;
};

function Tile({ id, href, placement, hideOnMobile, children }: TileProps) {
  const minH = id === "picture" ? "aspect-square lg:aspect-auto" : id === "works" ? "min-h-[520px]" : "min-h-[360px]";

  return (
    <motion.div
      layoutId={`tile-${id}`}
      layout
      transition={spring}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className={`relative ${minH} lg:min-h-0 lg:[grid-column:var(--col)] lg:[grid-row:var(--row)] ${hideOnMobile ? "max-lg:hidden" : ""}`}
      style={{ "--col": placement.col, "--row": placement.row } as React.CSSProperties}
    >
      <div data-tone={LAYOUT[id].tone} className={`group absolute inset-0 overflow-hidden ${STROKE}`}>
        {href ? <Link href={href} className="absolute inset-0 z-0" aria-label={`Open ${LABEL[id]}`} /> : null}
        <div className={`relative h-full ${href ? "pointer-events-none" : ""}`}>{children}</div>
      </div>
    </motion.div>
  );
}
