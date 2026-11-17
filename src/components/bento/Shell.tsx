"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TILE_ROUTE, TileId, WIDE, placeTiles, routeToTile } from "@/lib/bento";
import { photos } from "@/lib/site";
import { useBentoState } from "./useBentoState";
import { TileContent } from "./TileContent";
import { TileControls } from "./TileControls";

const LABEL: Record<TileId, string> = {
  picture: "Picture",
  works: "Selected work",
  links: "Links",
  about: "About",
  extras: "Extras",
};

/** Tiles that stay visible next to an open panel */
const STATIC_TILES: TileId[] = ["picture", "links"];

const spring = { type: "spring", bounce: 0.12, duration: 0.65 } as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = routeToTile(pathname);
  const { state, swap, move, setTone, nextPhoto, reset } = useBentoState();
  const lastDrag = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  // New page in the panel → start at the top
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
    if (window.matchMedia("(max-width: 1023px)").matches) window.scrollTo({ top: 0 });
  }, [pathname]);

  const onDragEnd = (e: DragEndEvent) => {
    lastDrag.current = Date.now();
    if (e.over && e.over.id !== e.active.id) swap(e.active.id as TileId, e.over.id as TileId);
  };

  // Where the open panel goes: it grows from the side where its tile lives
  const pos = placeTiles(state.order);
  const panelLeft = active ? pos[active].col === 0 : false;
  const staticOrder = state.order.filter((id) => STATIC_TILES.includes(id) && id !== active);

  const controls = (id: TileId) => (
    <TileControls
      label={LABEL[id]}
      tone={state.tones[id]}
      onTone={(t) => setTone(id, t)}
      onMove={(d) => move(id, d)}
      onReset={reset}
      extra={
        id === "picture" ? (
          <button
            type="button"
            onClick={() => nextPhoto(photos.length)}
            aria-label="Show another photo of Oscar"
            className="grid size-9 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        ) : null
      }
    />
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <LayoutGroup>
        <div
          data-bento
          className="grid grid-cols-1 gap-[var(--gap)] p-[var(--gap)] lg:h-dvh lg:grid-cols-3 lg:grid-rows-2 lg:grid-flow-dense"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {active === null &&
              state.order.map((id) => (
                <Tile
                  key={id}
                  id={id}
                  tone={state.tones[id]}
                  wide={!!WIDE[id]}
                  href={TILE_ROUTE[id]}
                  lastDrag={lastDrag}
                  controls={controls(id)}
                >
                  <TileContent id={id} photo={state.photo} />
                </Tile>
              ))}

            {active !== null &&
              staticOrder.map((id, i) => (
                <Tile
                  key={id}
                  id={id}
                  tone={state.tones[id]}
                  placement={{ col: panelLeft ? "3" : "1", row: String(i + 1) }}
                  lastDrag={lastDrag}
                  hideOnMobile
                  controls={controls(id)}
                >
                  <TileContent id={id} photo={state.photo} />
                </Tile>
              ))}

            {active !== null && (
              <motion.section
                key="panel"
                layoutId={`tile-${active}`}
                transition={spring}
                data-tone="paper"
                aria-label={LABEL[active]}
                className="relative overflow-hidden rounded-[var(--radius-tile)] lg:[grid-column:var(--col)] lg:[grid-row:1/span_2]"
                style={{ "--col": panelLeft ? "1 / span 2" : "2 / span 2" } as React.CSSProperties}
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
    </DndContext>
  );
}

type TileProps = {
  id: TileId;
  tone: string;
  wide?: boolean;
  href?: string;
  placement?: { col: string; row: string };
  hideOnMobile?: boolean;
  lastDrag: React.RefObject<number>;
  controls: React.ReactNode;
  children: React.ReactNode;
};

function Tile({ id, tone, wide, href, placement, hideOnMobile, lastDrag, controls, children }: TileProps) {
  const {
    setNodeRef: setDragNode,
    listeners,
    attributes,
    transform: t,
    isDragging,
  } = useDraggable({ id, attributes: { roleDescription: "movable block" } });
  const { setNodeRef: setDropNode, isOver } = useDroppable({ id });

  const minH = id === "picture" ? "aspect-square lg:aspect-auto" : id === "works" ? "min-h-[440px]" : "min-h-[320px]";

  return (
    <motion.div
      ref={setDropNode}
      layoutId={`tile-${id}`}
      layout
      transition={spring}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className={`relative ${minH} lg:min-h-0 ${wide ? "lg:col-span-2" : ""} ${placement ? "lg:[grid-column:var(--col)] lg:[grid-row:var(--row)]" : ""} ${hideOnMobile ? "max-lg:hidden" : ""} ${isDragging ? "z-30" : ""}`}
      style={placement ? ({ "--col": placement.col, "--row": placement.row } as React.CSSProperties) : undefined}
    >
      <div
        ref={setDragNode}
        {...listeners}
        {...attributes}
        aria-label={`${LABEL[id]} block. Press space to pick up and move.`}
        data-tone={tone}
        className={`group absolute inset-0 touch-manipulation overflow-hidden rounded-[var(--radius-tile)] outline-offset-4 ${
          isDragging ? "cursor-grabbing shadow-2xl" : "cursor-grab"
        } ${isOver && !isDragging ? "ring-4 ring-[var(--block-cobalt-deep)]/60" : ""}`}
        style={{
          transform: t ? `translate3d(${t.x}px, ${t.y}px, 0) scale(1.02)` : undefined,
          transition: t ? "box-shadow 200ms" : "transform 250ms var(--ease-out), box-shadow 200ms",
        }}
      >
        {href ? (
          <Link
            href={href}
            draggable={false}
            onClick={(e) => {
              if (Date.now() - lastDrag.current < 250) e.preventDefault();
            }}
            className="absolute inset-0 z-0"
            aria-label={`Open ${LABEL[id]}`}
          />
        ) : null}
        <div className={`relative h-full ${href ? "pointer-events-none [&_a]:pointer-events-auto" : ""}`}>{children}</div>
        <div className="opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
          {controls}
        </div>
      </div>
    </motion.div>
  );
}
