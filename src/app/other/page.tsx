import type { Metadata } from "next";
import { PanelNav } from "@/components/PanelNav";

export const metadata: Metadata = { title: "Other projects" };

type Project = {
  title: string;
  kind: string;
  body: string;
  href?: string;
  tone: string;
  mark: string;
  status?: string;
};

const projects: Project[] = [
  {
    title: "Bolon",
    kind: "Motion design",
    body: "A series of looping geometric animations for Bolon Studios — triangles, prisms, waves and morphing shapes.",
    href: "https://oscar-tomson-olson.webflow.io/motion-graphics",
    tone: "cobalt-deep",
    mark: "◐",
  },
  {
    title: "Who am I",
    kind: "Card game",
    body: "The game that makes culture pop: collect celebrity body parts, give sneaky hints and guess who you are.",
    href: "https://www.thewhoamigame.com",
    tone: "plum-deep",
    mark: "?",
  },
  {
    title: "Ski app",
    kind: "App — in progress",
    body: "A FATMAP replacement for finding the right lines when we head to Norway. Maps, terrain and route planning.",
    tone: "forest-deep",
    mark: "▲",
    status: "In progress",
  },
  {
    title: "More soon",
    kind: "Sketchbook",
    body: "Side projects, experiments and things in the making will land here.",
    tone: "sage-soft",
    mark: "+",
  },
];

export default function Other() {
  return (
    <div>
      <PanelNav />
      <div className="px-6 pb-16 lg:px-10 lg:pb-24">
        <h1 className="pt-10 text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-tight lg:pt-20">Other</h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-muted lg:text-lg">
          Motion, apps, and other stuff I enjoy creating outside client work.
        </p>

        <ul className="mt-12 grid gap-x-[var(--gap)] gap-y-10 sm:grid-cols-2 lg:mt-16">
          {projects.map((p) => {
            const inner = (
              <>
                <div
                  data-tone={p.tone}
                  className="relative grid aspect-[506/300] place-items-center overflow-hidden rounded-[var(--radius-tile)] transition duration-500 group-hover:scale-[1.015]"
                >
                  <span aria-hidden className="text-[clamp(4rem,9vw,8rem)] leading-none opacity-90">
                    {p.mark}
                  </span>
                  {p.status && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink">
                      {p.status}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-ink-muted">{p.kind}</p>
                  <h2 className="mt-1 text-2xl tracking-tight group-hover:underline lg:text-3xl">
                    {p.title}
                    {p.href && <span aria-hidden> ↗</span>}
                  </h2>
                  <p className="mt-2 max-w-md leading-relaxed text-ink-muted">{p.body}</p>
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
      </div>
    </div>
  );
}
