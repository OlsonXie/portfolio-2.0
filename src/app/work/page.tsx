import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cases } from "@/lib/cases";
import { otherProjects } from "@/lib/other";
import { PanelNav } from "@/components/PanelNav";
import { Frame } from "@/components/case/Frame";

export const metadata: Metadata = { title: "Selected work" };

/** Vertical rhythm between projects: 80px on a 1728px screen */
const SECTION_GAP = "gap-[clamp(3rem,4.63vw,5rem)]";

export default function WorkList() {
  return (
    <div>
      <PanelNav back={{ href: "/", label: "Back to projects" }} />
      <h1 className="sr-only">Selected work</h1>
      <div className={`flex flex-col ${SECTION_GAP} px-[var(--pad)] pb-[var(--pad)] pt-[clamp(1rem,2.31vw,2.5rem)]`}>
        <ul className={`flex flex-col ${SECTION_GAP}`}>
          {cases.map((c, i) => {
            const lc = c.listCover;
            return (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} className="group block">
                  <Frame bg="grey" className="aspect-[996/680]">
                    {lc.kind === "single" ? (
                      <div className="flex h-full items-center justify-center p-[7%]">
                        <Image
                          src={lc.image.src}
                          alt=""
                          width={lc.image.w}
                          height={lc.image.h}
                          sizes="(min-width: 1024px) 55vw, 90vw"
                          priority={i === 0}
                          className="h-auto max-h-full w-auto max-w-full transition duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className={`flex h-full items-center justify-center ${lc.plain ? "gap-[2%] p-[7%]" : "gap-[2.3%] p-[4.7%]"}`}>
                        {lc.images.map((img, k) => (
                          <Image
                            key={img.src}
                            src={img.src}
                            alt=""
                            width={img.w}
                            height={img.h}
                            sizes="(min-width: 1024px) 15vw, 25vw"
                            className={`h-auto min-w-0 flex-1 transition duration-500 group-hover:-translate-y-1 ${lc.plain ? "" : "shadow-[0_4px_12px_rgba(0,0,0,0.2)]"}`}
                            style={{ transitionDelay: `${k * 40}ms` }}
                          />
                        ))}
                      </div>
                    )}
                  </Frame>
                  <div className="mt-6 max-w-[33.5em]">
                    <h2 className="t-display underline-offset-[0.12em] group-hover:underline">{c.title}</h2>
                    <p className="t-body mt-1">{c.summary}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="border-[var(--color-line)]" />

        <section aria-labelledby="other-projects" className={`flex flex-col ${SECTION_GAP}`}>
          <div>
            <h2 id="other-projects" className="t-display">Other projects</h2>
            <p className="t-body mt-1">Stuff I enjoy doing</p>
          </div>

          <ul className="grid gap-[clamp(1.5rem,2.31vw,2.5rem)] sm:grid-cols-2">
            {otherProjects.map((p) => {
              const inner = (
                <>
                  <Frame bg="grey" className="grid aspect-[478/300] place-items-center">
                    <span aria-hidden className="text-[clamp(3.5rem,6vw,6rem)] leading-none text-ink/80 transition duration-500 group-hover:scale-110">
                      {p.mark}
                    </span>
                    {p.status && (
                      <span className="absolute left-4 top-4 border border-[var(--stroke)] bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
                        {p.status}
                      </span>
                    )}
                  </Frame>
                  <div className="mt-6">
                    <h3 className="t-display underline-offset-[0.12em] group-hover:underline">
                      {p.title}
                      {p.href && <span aria-hidden className="ml-2 text-[0.5em] align-[0.35em]">↗</span>}
                    </h3>
                    <p className="t-body mt-1">{p.body}</p>
                  </div>
                </>
              );
              return (
                <li key={p.title}>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noreferrer" className="group block">
                      {inner}
                    </a>
                  ) : (
                    <div className="group">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
