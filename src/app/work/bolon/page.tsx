import type { Metadata } from "next";
import { PanelNav } from "@/components/PanelNav";
import { LoopVideo } from "@/components/LoopVideo";
import { bolonLoops } from "@/lib/other";

export const metadata: Metadata = {
  title: "Bolon Studios — Motion design",
  description: "Motion design for the campaign introducing Bolon Studios.",
  openGraph: { images: ["/other/bolon.webp"] },
};

const CAMPAIGN = "https://www.bolon.com/sv/bolon-studio";

export default function BolonPage() {
  return (
    <article>
      <PanelNav back={{ href: "/work#other-projects", label: "Back to projects" }} />
      <div className="px-[var(--pad)] pb-16 lg:pb-24">
        <header className="pt-6 lg:pt-10">
          <p className="t-eyebrow">Bolon Studios</p>
          <h1 className="t-display mt-3">Motion design</h1>
          <p className="t-body mt-6 max-w-[33.5em]">
            Motion design I created as part of the campaign introducing Bolon Studios — a set of looping geometric
            animations built from the brand&rsquo;s shapes and colours. I also created the campaign&rsquo;s hero film.
          </p>
        </header>

        <hr className="my-10 border-line lg:my-20" />

        <ul className="grid grid-cols-2 gap-px bg-[var(--stroke)] p-px sm:grid-cols-3">
          {bolonLoops.map((l) => (
            <li key={l.video} className="aspect-square bg-[var(--frame-grey)]">
              <LoopVideo src={l.video} poster={l.poster} label={l.alt} w={540} h={540} className="h-full w-full object-cover" />
            </li>
          ))}
          <li className="aspect-square bg-white">
            <a
              href={CAMPAIGN}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-end p-[clamp(1rem,2vw,1.75rem)] transition hover:bg-ink hover:text-white"
            >
              <span className="t-eyebrow">See the campaign</span>
              <span className="mt-2 text-[clamp(1.25rem,2.2vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.01em]">
                bolon.com <span aria-hidden>↗</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
