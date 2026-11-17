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
          const lc = c.listCover;
          return (
            <li key={c.slug}>
              <Link href={`/work/${c.slug}`} className="group block">
                <Frame bg="grey" className="aspect-[1052/680]">
                  {lc.kind === "single" ? (
                    <div className="flex h-full items-center justify-center p-[8%]">
                      <Image
                        src={lc.image.src}
                        alt=""
                        width={lc.image.w}
                        height={lc.image.h}
                        sizes="(min-width: 1024px) 50vw, 90vw"
                        priority={i === 0}
                        className="h-auto max-h-full w-auto max-w-full rounded-md shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className={`flex h-full items-center justify-center ${lc.plain ? "gap-[2%] p-[7%]" : "gap-[2.5%] p-[7%]"}`}>
                      {lc.images.map((img, k) => (
                        <Image
                          key={img.src}
                          src={img.src}
                          alt=""
                          width={img.w}
                          height={img.h}
                          sizes="(min-width: 1024px) 15vw, 25vw"
                          className={`h-auto min-w-0 flex-1 transition duration-500 group-hover:-translate-y-1 ${lc.plain ? "" : "rounded-lg shadow-[0_14px_30px_-12px_rgba(0,0,0,0.35)]"}`}
                          style={{ transitionDelay: `${k * 40}ms` }}
                        />
                      ))}
                    </div>
                  )}
                </Frame>
                <div className="mt-6 flex items-end justify-between gap-6">
                  <div>
                    <h2 className="text-[clamp(2.25rem,4vw,4rem)] leading-none tracking-tight group-hover:underline">
                      {c.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-[15px] leading-snug text-ink-muted lg:text-lg">{c.summary}</p>
                  </div>
                  <span className="shrink-0 text-sm text-ink-muted">{c.timeline}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
