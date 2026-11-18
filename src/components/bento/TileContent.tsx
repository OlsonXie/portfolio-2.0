"use client";

import { TileId } from "@/lib/bento";
import { site } from "@/lib/site";
import { Clock } from "./Clock";
import { PhotoSwitcher } from "./PhotoSwitcher";

type Props = { id: TileId; photo: number; onPhoto: (i: number) => void };

export function TileContent({ id, photo, onPhoto }: Props) {
  switch (id) {
    case "picture":
      return <PhotoSwitcher index={photo} onChange={onPhoto} />;
    case "works":
      return (
        <div className="relative flex h-full flex-col justify-center p-[var(--pad)]">
          <Clock className="absolute left-[var(--pad)] top-[var(--pad)]" />
          <div className="max-w-[30rem] py-16 lg:py-0">
            <TextBlock eyebrow="Work" title="Selected work" />
            <p className="t-body mt-3">{site.intro}</p>
          </div>
        </div>
      );
    case "about":
      return (
        <div className="flex h-full flex-col justify-end p-[var(--pad)]">
          <div className="max-w-[30rem]">
            <TextBlock eyebrow="About me" title="Let me introduce myself…" />
          </div>
        </div>
      );
  }
}

function TextBlock({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="t-eyebrow">{eyebrow}</p>
      <h2 className="t-display mt-3">{title}</h2>
    </>
  );
}
