/** Side projects, shown under "Other projects" at the end of Selected work */
export type OtherProject = {
  title: string;
  body: string;
  href?: string;
  mark: string;
  status?: string;
};

export const otherProjects: OtherProject[] = [
  {
    title: "Who Am I?",
    body: "A card game that makes culture pop: collect celebrity body parts, give sneaky hints and guess who you are.",
    href: "https://www.thewhoamigame.com",
    mark: "?",
  },
  {
    title: "Ski app",
    body: "A FATMAP replacement for finding the right lines when we head to Norway.",
    mark: "▲",
    status: "In progress",
  },
  {
    title: "Bolon",
    body: "Looping geometric motion for Bolon Studios — prisms, waves and morphing shapes.",
    href: "https://oscar-tomson-olson.webflow.io/motion-graphics",
    mark: "◐",
  },
  {
    title: "Unsure?",
    body: "Side projects, experiments and things in the making will land here.",
    mark: "+",
  },
];
