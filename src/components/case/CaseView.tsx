import Image from "next/image";
import Link from "next/link";
import { Case, cases } from "@/lib/cases";
import { Label, PanelNav } from "@/components/PanelNav";
import { Frame, FrameImage } from "./Frame";
import { SusScore } from "./SusScore";

const FULL = "(min-width: 1024px) 60vw, 100vw";
const HALF = "(min-width: 1024px) 30vw, 100vw";

export function CaseView({ c }: { c: Case }) {
  const idx = cases.findIndex((x) => x.slug === c.slug);
  const next = cases[(idx + 1) % cases.length];

  return (
    <article>
      <PanelNav back={{ href: "/work", label: "Back to projects" }} />
      <div className="px-6 pb-16 lg:px-10 lg:pb-24">
        <header className="pt-10 lg:pt-20">
          <h1 className="text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-tight">{c.title}</h1>
          <p className="mt-3 text-lg font-medium lg:text-xl">{c.client}</p>
        </header>

        <hr className="my-10 border-line lg:my-20" />

        <dl className="grid gap-8 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:gap-x-16">
          <div className="space-y-8">
            <div>
              <dt><Label>My role</Label></dt>
              <dd className="mt-2 leading-relaxed">{c.role.join(", ")}</dd>
            </div>
            <div>
              <dt><Label>Timeline</Label></dt>
              <dd className="mt-2">{c.timeline}</dd>
            </div>
          </div>
          <div>
            <dt><Label>Description</Label></dt>
            <dd className="mt-2 max-w-2xl text-[17px] leading-relaxed lg:text-lg">{c.description}</dd>
          </div>
        </dl>

        <div className="mt-14 space-y-14 lg:mt-20 lg:space-y-20">
          {c.blocks.map((b, i) => {
            switch (b.kind) {
              case "text":
                return (
                  <section key={i} className="max-w-2xl">
                    <Label>{b.label}</Label>
                    <p className="mt-3 text-[17px] leading-relaxed lg:text-lg">{b.body}</p>
                  </section>
                );
              case "sus":
                return <SusScore key={i} />;
              case "illustrations":
                return (
                  <Frame key={i} bg="dark" className="grid grid-cols-2 items-center gap-6 p-6 sm:grid-cols-3 lg:gap-10 lg:p-14">
                    {b.images.map((img, k) => (
                      <Image
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        width={img.w}
                        height={img.h}
                        sizes="(min-width: 1024px) 18vw, 45vw"
                        className="mx-auto h-auto w-full max-w-[240px] animate-[float_6s_ease-in-out_infinite]"
                        style={{ animationDelay: `${-k * 1.1}s` }}
                      />
                    ))}
                  </Frame>
                );
              case "frame":
                if (b.layout === "full") {
                  return (
                    <Frame key={i} bg={b.bg} className="aspect-[1052/680]">
                      <FrameImage image={b.image} fit={b.fit} shadow={b.shadow} sizes={FULL} priority={i === 0} />
                    </Frame>
                  );
                }
                if (b.layout === "pair") {
                  return (
                    <div key={i} className="grid gap-[var(--gap)] sm:grid-cols-2">
                      {b.images.map((img) => (
                        <Frame key={img.src} bg={b.bg} className="aspect-[4/5]">
                          <FrameImage image={img} fit={b.fit} blend={b.blend} sizes={HALF} />
                        </Frame>
                      ))}
                    </div>
                  );
                }
                return (
                  <Frame key={i} bg={b.bg} className="px-[6%] py-[8%]">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
                      {b.images.map((img) => (
                        <Image
                          key={img.src}
                          src={img.src}
                          alt={img.alt}
                          width={img.w}
                          height={img.h}
                          sizes="(min-width: 1024px) 14vw, 45vw"
                          className="h-auto w-full rounded-lg shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)]"
                        />
                      ))}
                    </div>
                  </Frame>
                );
            }
          })}
        </div>

        <hr className="my-14 border-line lg:my-20" />
        <Link href={`/work/${next.slug}`} className="group flex items-end justify-between gap-6">
          <span>
            <span className="text-sm font-medium uppercase tracking-wide text-ink-muted">Next project</span>
            <span className="mt-2 block text-[clamp(2rem,3.5vw,3rem)] leading-none tracking-tight group-hover:underline">
              {next.title}
            </span>
          </span>
          <span aria-hidden className="text-3xl transition group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
