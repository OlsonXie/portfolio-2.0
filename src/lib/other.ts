/** Side projects, shown under "Other projects" at the end of Selected work */
export type OtherProject = {
  title: string;
  body: string;
  thumb: { src: string; alt: string };
  /** Internal page (starts with /) or external site */
  href?: string;
  status?: string;
};

export const otherProjects: OtherProject[] = [
  {
    title: "Who Am I?",
    body: "A fun side game that makes culture pop — play it in the app or as a card game. Collect celebrity body parts, give sneaky hints and guess who you are.",
    thumb: { src: "/other/whoami.webp", alt: "Who Am I? card artwork next to the app on three phones" },
    href: "https://www.thewhoamigame.com",
  },
  {
    title: "Trax",
    body: "A work in progress: a ski app where I'm trying to fill the gap FATMAP left behind — finding the right lines and routes when we head to the mountains in Norway.",
    thumb: { src: "/other/trax.webp", alt: "Trax logo on a red background" },
    status: "In progress",
  },
  {
    title: "Bolon",
    body: "Motion design for the campaign introducing Bolon Studios — looping geometric animations and the hero film.",
    thumb: { src: "/other/bolon.webp", alt: "Grid of colourful geometric animation stills for Bolon Studios" },
    href: "/work/bolon",
  },
];

/** The square loops on the Bolon page, in the order they're shown */
export const bolonLoops = [
  "bigger-wing",
  "hexagon",
  "link",
  "morph-color-bg",
  "prism",
  "triangle",
  "scale",
  "wave",
  "moves",
  "rectangle-pillar",
  "morph-grey-bg",
].map((name) => ({
  video: `/motion/bolon-${name}.mp4`,
  poster: `/motion/bolon-${name}.webp`,
  alt: `Looping geometric animation: ${name.replace(/-/g, " ")}`,
}));
