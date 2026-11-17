/**
 * Case studies. Every case follows the same template:
 * header → role / timeline / description → blocks (frames + text sections).
 *
 * Frames are always image containers with a background:
 *  - layout "full":  one frame, full width
 *  - layout "pair":  two frames side by side
 *  - layout "row":   one frame with several images in a row (e.g. phone screens)
 *  - fit "cover":    the image fills the frame edge to edge (photos)
 */

export type Img = { src: string; alt: string; w: number; h: number };
export type FrameBg = "grey" | "blue" | "dark" | "pink";

export type Block =
  | { kind: "text"; label: string; body: string }
  | { kind: "frame"; layout: "full"; bg: FrameBg; image: Img; fit?: "contain" | "cover"; shadow?: boolean }
  | { kind: "frame"; layout: "pair"; bg: FrameBg; images: [Img, Img]; fit?: "contain" | "cover"; blend?: boolean }
  | { kind: "frame"; layout: "row"; bg: FrameBg; images: Img[]; plain?: boolean }
  | { kind: "illustrations"; images: Img[] }
  | { kind: "sus" };

export type Case = {
  slug: string;
  title: string;
  client: string;
  summary: string;
  role: string[];
  timeline: string;
  description: string;
  /** Thumbnail on the work list and home tile */
  cover: Img;
  /** How the work list shows the case: one screen, or a row of phones */
  listCover: { kind: "single"; image: Img } | { kind: "row"; images: Img[]; plain?: boolean };
  blocks: Block[];
};

const w = (name: string, alt: string, width: number, height: number): Img => ({
  src: `/work/${name}.webp`,
  alt,
  w: width,
  h: height,
});

export const cases: Case[] = [
  {
    slug: "ssab-wear-iq",
    title: "Wear IQ",
    client: "SSAB",
    summary: "A full-scale maintenance and inspection platform for wear-parts maintenance, spanning desktop and mobile.",
    role: ["UI Designer", "Illustration", "Motion Design"],
    timeline: "2020 – 2021",
    description:
      "A full-scale maintenance and inspection platform for wear-parts maintenance, spanning desktop and mobile, designed to cut unplanned breakdowns and optimize maintenance cost.",
    cover: w("ssab-analytics", "Wear IQ analytics view for a shredder", 1620, 1043),
    listCover: { kind: "single", image: w("ssab-analytics", "Wear IQ analytics view for a shredder", 1620, 1043) },
    blocks: [
      { kind: "frame", layout: "full", bg: "grey", shadow: true, image: w("ssab-analytics", "Wear IQ analytics view with production chart and consumption details", 1620, 1043) },
      {
        kind: "text",
        label: "Challenge",
        body: "SSAB needed a maintenance and inspection management tool specialized in wear-parts maintenance — the goal was fewer unplanned breakdowns and lower maintenance cost through better reporting and optimized parts performance.",
      },
      {
        kind: "text",
        label: "Solution",
        body: "Designed a full-scale system across desktop and mobile: desktop handled setup, analysis, warnings, and reminders; mobile handled data input and spare parts info. Also built a complete custom illustration set (machines, technicians) with loading animations.",
      },
      { kind: "frame", layout: "full", bg: "grey", shadow: true, image: w("ssab-overview", "Wear IQ machine overview with parts list and maintenance log", 1620, 1043) },
      {
        kind: "frame",
        layout: "row",
        bg: "grey",
        images: [
          w("ssab-m1", "Mobile machine overview", 640, 1391),
          w("ssab-m2", "Mobile wear-part drawing with condition slider", 640, 1394),
          w("ssab-m3", "Mobile maintenance log", 640, 1391),
          w("ssab-m4", "Mobile deviation report", 640, 1391),
        ],
      },
      {
        kind: "text",
        label: "Illustrations",
        body: "To give a heavy-industry tool a more human face, I drew and animated a complete isometric illustration set for Wear IQ — crushers, buckets, trucks, screens and the technicians who keep them running. Built in the product's dark palette with Hardox red as the accent, the illustrations double as loading animations, so waiting time tells a small story about the work the platform supports.",
      },
      {
        kind: "illustrations",
        images: [
          w("ssab-ill1", "Isometric laptop, tablet and phone connected to the platform", 501, 527),
          w("ssab-ill2", "Technician in red overalls scanning parts with a tablet", 361, 426),
          w("ssab-ill3", "Floating dashboard panel and phone with gear icons", 348, 469),
          w("ssab-ill4", "Hardox delivery truck with a laptop placing an order", 560, 439),
          w("ssab-ill5", "Technician replacing teeth on a large bucket", 443, 342),
          w("ssab-ill6", "Laptop surrounded by floating analytics panels", 388, 469),
        ],
      },
      {
        kind: "text",
        label: "Impact",
        body: "In just 4–5 months, delivered a unified cross-platform tool built directly around SSAB's stated goals — reducing unplanned breakdowns and maintenance cost via better reporting and parts optimization — validated with feedback from real users along the way.",
      },
    ],
  },
  {
    slug: "scania-smart-dash",
    title: "Scania",
    client: "Smart Dash",
    summary:
      "Strategic and operational lead for the design system behind Scania's Smart Dash — one source of truth across a multibrand, cross-functional org.",
    role: ["Design Systems Lead", "UX/UI"],
    timeline: "2023 – 2025",
    description:
      "Strategic and operational lead for the design system behind Scania's Smart Dash project, ensuring consistent design standards and a seamless final product across a multibrand, cross-functional org.",
    cover: w("scania-cab", "Scania cab interior with the Smart Dash displays", 1600, 900),
    listCover: { kind: "single", image: w("scania-cab", "Scania cab interior with the Smart Dash displays", 1600, 900) },
    blocks: [
      { kind: "frame", layout: "full", bg: "grey", fit: "cover", image: w("scania-trucks", "Four Scania trucks lined up in front of a forest at dusk", 2000, 1334) },
      {
        kind: "text",
        label: "Challenge",
        body: "Scania needed to scale design consistency across a large, cross-functional Smart Dash product team. Without a shared system, component drift and inconsistent UX were a growing risk as the product expanded.",
      },
      {
        kind: "text",
        label: "Solution",
        body: "Owned the design system strategically and operationally: built and maintained the component library, style guide, and interaction patterns, and worked directly with cross-functional teams to keep design and delivery aligned end to end.",
      },
      {
        kind: "frame",
        layout: "pair",
        bg: "dark",
        fit: "cover",
        images: [
          w("scania-cluster", "Smart Dash instrument cluster behind the steering wheel", 1600, 899),
          w("scania-cab", "Scania cab interior with the Smart Dash centre display", 1600, 900),
        ],
      },
      {
        kind: "text",
        label: "Impact",
        body: "Gave design and engineering a single source of truth for components and patterns, reducing inconsistency and rework across teams. Built to scale, the system continues to support new features and brands as the product grows.",
      },
    ],
  },
  {
    slug: "bris",
    title: "Bris",
    client: "New website",
    summary:
      "Redesigned Bris's navigation and visual concept around how 10–18-year-olds actually use their phones — from failing usability to excellent.",
    role: ["Design Lead", "UX/UI", "User Research", "User Testing"],
    timeline: "2023",
    description:
      "Redesigned BRIS's navigation and visual identity around how 10–18-year-olds actually use their phones. Tested and retested until the site moved from failing usability to excellent.",
    cover: w("bris-m3", "Bris start page with a Valentine's campaign", 640, 1387),
    listCover: { kind: "row", images: [
          w("bris-m3", "Bris start page with a Valentine's campaign", 640, 1387),
          w("bris-m4", "Popular topics: friendship, shyness and peer pressure", 640, 1387),
          w("bris-m2", "Topic page about school with a bullying carousel", 640, 1387),
          w("bris-m1", "Bris menu with the new bottom navigation", 640, 1387),
        ] },
    blocks: [
      {
        kind: "frame",
        layout: "row",
        bg: "grey",
        images: [
          w("bris-m1", "Bris menu with the new bottom navigation", 393, 852),
          w("bris-m2", "Topic page about school with a bullying carousel", 393, 852),
          w("bris-m4", "Popular topics: friendship, shyness and peer pressure", 393, 852),
          w("bris-m3", "Bris start page with a Valentine's campaign", 393, 852),
        ],
      },
      {
        kind: "text",
        label: "Challenge",
        body: "BRIS supports children and young people through chat, messaging, and a 24/7 helpline — often around serious topics. But the site had never been researched or tested, had no design system, and its navigation wasn't built around how kids actually hold and browse on their phones. BRIS knew something was off, just not what to fix first.",
      },
      {
        kind: "text",
        label: "Solution",
        body: "Ran usability testing with BRIS's core age group to find out exactly where the site was failing, then redesigned navigation and visual concept in Figma — moving the main menu to the bottom of the screen for smaller hands. Refined it through several rounds of workshops and rapid tests with the same group, checking in regularly with developers to keep every change technically feasible.",
      },
      {
        kind: "frame",
        layout: "row",
        bg: "grey",
        images: [
          w("bris-m5", "Poll block where kids vote on questions about friendship", 640, 1387),
          w("bris-m6", "Topic page with exercises for sleeping better", 640, 1387),
          w("bris-m7", "Sleep topic page with illustration", 640, 1387),
        ],
      },
      { kind: "sus" },
      {
        kind: "text",
        label: "Impact",
        body: "A calmer, more intuitive site that meets kids where they actually are — easier to navigate under stress, easier to find the right kind of support fast. Retesting with the same group confirmed the redesign held up in practice, not just on paper.",
      },
    ],
  },
  {
    slug: "blinka",
    title: "Blinka IO",
    client: "Legal tech startup",
    summary:
      "A bold, playful identity and product design language for a legal-tech startup — extended into a complete Figma design system.",
    role: ["Visual Identity", "UX/UI", "Art Direction", "Motion Design", "Illustration"],
    timeline: "2021",
    description:
      "A contemporary legal-tech startup needed more than a logo — a bold, playful identity system and product design language to stand apart from competitors and carry the brand into a full product.",
    cover: w("blinka-identity", "Blinka logo, colour palette and typefaces", 1920, 1240),
    listCover: { kind: "row", plain: true, images: [
          w("blinka-phone1", "Blinka app home screen listing agreements", 587, 1087),
          w("blinka-phone2", "Will flow showing progress through steps", 587, 1087),
          w("blinka-phone4", "Inheritance split shown as a pie chart", 587, 1087),
          w("blinka-phone3", "Archive of signed documents", 587, 1087),
        ] },
    blocks: [
      { kind: "frame", layout: "full", bg: "pink", fit: "cover", image: w("blinka-identity", "Blinka logo, symbol, colour palette and typefaces", 1920, 1240) },
      {
        kind: "text",
        label: "Challenge",
        body: "Blinka, a startup digitizing and automating legal documents, needed an original, playful identity — not just a logo — that could differentiate them in a traditionally dry, conservative category, plus initial screens for their future app.",
      },
      {
        kind: "text",
        label: "Solution",
        body: "Designed a full visual identity system — logo, animation, custom icons, color palette, typography — and extended it into a complete Figma design system so the team could build the entire product from it.",
      },
      { kind: "frame", layout: "row", bg: "pink", plain: true, images: [
          w("blinka-phone1", "Blinka app home screen listing agreements", 587, 1087),
          w("blinka-phone2", "Will flow showing progress through steps", 587, 1087),
          w("blinka-phone4", "Inheritance split shown as a pie chart", 587, 1087),
          w("blinka-phone3", "Archive of signed documents", 587, 1087),
        ] },
      {
        kind: "frame",
        layout: "pair",
        bg: "pink",
        fit: "cover",
        images: [
          w("blinka-icons", "Custom Blinka icon set", 915, 957),
          w("blinka-pattern", "Brand pattern built from Blinka icons", 1920, 1240),
        ],
      },
      {
        kind: "text",
        label: "Impact",
        body: "Gave Blinka a distinct, ownable brand in legal tech and a ready-to-build component system, shortening the path from identity to shipped product.",
      },
    ],
  },
];

export const getCase = (slug: string) => cases.find((c) => c.slug === slug);
