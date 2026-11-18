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
import { TILE_ROUTE, TileId, columns, placeTiles, routeToTile } from "@/lib/bento";
import { useBentoState } from "./useBentoState";
import { TileContent } from "./TileContent";
import { TileControls } from "./TileControls";

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
  const { state, swap, move, setTone, setPhoto, reset } = useBentoState();
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

  const { pos, tallCol } = placeTiles(state.order);
  // Open panel: it takes the column its tile lives in (made wide); the other
  // two tiles stay put, stacked in the narrow column.
  const panelCol = active ? pos[active].col : tallCol;
  const staticOrder = state.order.filter((id) => id !== active);

  const controls = (id: TileId) => (
    <TileControls
      label={LABEL[id]}
      tone={state.tones[id]}
      onTone={(t) => setTone(id, t)}
      onMove={(d) => move(id, d)}
      onReset={reset}
    />
  );

  const content = (id: TileId) => <TileContent id={id} photo={state.photo} onPhoto={setPhoto} />;

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <LayoutGroup>
        <div
          data-bento
          className="grid grid-cols-1 gap-px p-px lg:h-dvh lg:grid-rows-2 lg:[grid-template-columns:var(--cols)]"
          style={{ "--cols": columns(panelCol) } as React.CSSProperties}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {active === null &&
              state.order.map((id) => (
                <Tile
                  key={id}
                  id={id}
                  tone={state.tones[id]}
                  href={TILE_ROUTE[id]}
                  placement={{
                    col: String(pos[id].col + 1),
                    row: pos[id].tall ? "1 / span 2" : String(pos[id].row + 1),
                  }}
                  lastDrag={lastDrag}
                  controls={controls(id)}
                >
                  {content(id)}
                </Tile>
              ))}

            {active !== null &&
              staticOrder.map((id, i) => (
                <Tile
                  key={id}
                  id={id}
                  tone={state.tones[id]}
                  href={TILE_ROUTE[id]}
                  placement={{ col: String(2 - panelCol), row: String(i + 1) }}
                  lastDrag={lastDrag}
                  hideOnMobile
                  controls={controls(id)}
                >
                  {content(id)}
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
    </DndContext>
  );
}

type TileProps = {
  id: TileId;
  tone: string;
  href?: string;
  placement: { col: string; row: string };
  hideOnMobile?: boolean;
  lastDrag: React.RefObject<number>;
  controls: React.ReactNode;
  children: React.ReactNode;
};

function Tile({ id, tone, href, placement, hideOnMobile, lastDrag, controls, children }: TileProps) {
  const {
    setNodeRef: setDragNode,
    listeners,
    attributes,
    transform: t,
    isDragging,
  } = useDraggable({ id, attributes: { roleDescription: "movable block" } });
  const { setNodeRef: setDropNode, isOver } = useDroppable({ id });

  const minH = id === "picture" ? "aspect-square lg:aspect-auto" : id === "works" ? "min-h-[520px]" : "min-h-[360px]";

  return (
    <motion.div
      ref={setDropNode}
      layoutId={`tile-${id}`}
      layout
      transition={spring}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className={`relative ${minH} lg:min-h-0 lg:[grid-column:var(--col)] lg:[grid-row:var(--row)] ${hideOnMobile ? "max-lg:hidden" : ""} ${isDragging ? "z-30" : ""}`}
      style={{ "--col": placement.col, "--row": placement.row } as React.CSSProperties}
    >
      <div
        ref={setDragNode}
        {...listeners}
        {...attributes}
        aria-label={`${LABEL[id]} block. Press space to pick up and move.`}
        data-tone={tone}
        className={`group absolute inset-0 touch-manipulation overflow-hidden outline-offset-4 ${
          isDragging
            ? "cursor-grabbing shadow-[0_0_0_1px_var(--stroke),0_24px_48px_-12px_rgba(0,0,0,0.35)]"
            : `cursor-grab ${STROKE}`
        } ${isOver && !isDragging ? "outline-4 -outline-offset-4 outline-[var(--stroke)]" : ""}`}
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
