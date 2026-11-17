import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cases } from "@/lib/cases";
import { PanelNav } from "@/components/PanelNav";
import { Frame } from "@/components/case/Frame";

export const metadata: Metadata = { title: "Selected work" };

export default function WorkList() {
  return (
    <div>
      <PanelNav />
      <h1 className="sr-only">Selected work</h1>
      <ul className="space-y-14 px-6 pb-16 lg:space-y-20 lg:px-10 lg:pb-24">
        {cases.map((c, i) => {
          const tall = c.cover.h > c.cover.w;
          return (
            <li key={c.slug}>
              <Link href={`/work/${c.slug}`} className="group block">
                <Frame bg={c.coverBg} className="aspect-[1052/680]">
                  {tall ? (
                    <div className="flex h-full items-center justify-center gap-[3%] p-[6%]">
                      {(c.blocks.find((b) => b.kind === "frame" && b.layout === "row") as { images: typeof c.cover[] } | undefined)?.images
                        .slice(0, 4)
                        .map((img) => (
                          <Image
                            key={img.src}
                            src={img.src}
                            alt=""
                            width={img.w}
                            height={img.h}
                            sizes="(min-width: 1024px) 14vw, 22vw"
                            className="h-full w-auto rounded-lg shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)] transition duration-500 group-hover:-translate-y-1"
                          />
                        ))}
                    </div>
                  ) : c.coverBg === "grey" && c.slug === "ssab-wear-iq" ? (
                    <div className="flex h-full items-center justify-center p-[8%]">
                      <Image
                        src={c.cover.src}
                        alt=""
                        width={c.cover.w}
                        height={c.cover.h}
                        sizes="(min-width: 1024px) 50vw, 90vw"
                        priority={i === 0}
                        className="h-auto max-h-full w-auto max-w-full rounded-md shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <Image
                      src={c.cover.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      priority={i === 0}
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                </Frame>
                <div className="mt-6 flex items-end justify-between gap-6">
                  <div>
                    <h2 className="text-[clamp(2.25rem,4vw,4rem)] leading-none tracking-tight group-hover:underline">
                      {c.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-[15px] leading-snug text-ink-muted lg:text-lg">{c.summary}</p>
                  </div>
                  <span className="shrink-0 text-sm text-ink-muted">
                    {c.timeline}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
