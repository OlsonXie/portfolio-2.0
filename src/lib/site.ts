export const site = {
  name: "Oscar Olson Xie",
  title: "Oscar Olson Xie — Design systems & product design",
  intro:
    "Oscar Olson Xie is a Stockholm-based product designer who builds design systems and interfaces that hold up at scale — from Bris to Scania, always with cross-functional teams.",
  links: {
    instagram: "https://www.instagram.com/tomsonsthlm/",
    instagramHandle: "@tomsonsthlm",
    linkedin: "https://www.linkedin.com/in/oscar-olson-xie-552228116/",
    email: "mailto:tomson.olson@gmail.com",
  },
  /**
   * Music for the record player (Vinyl hunt Hall of Fame).
   * playlistId: the part after `list=` in a YouTube playlist URL — preferred, enables "next track".
   * videoId: a single video, used (and looped) when no playlist is set.
   */
  youtube: { playlistId: "PLXTpj0eKzro8", videoId: "zko1a48RSlU" },
};

export const photos = [
  { src: "/photos/swim.webp", alt: "Oscar half-submerged in clear sea water, smiling at the camera", w: 1200, h: 1049 },
  { src: "/photos/ski.webp", alt: "Oscar in ski goggles and a snowy helmet on a mountain", w: 1120, h: 1494 },
];

export const instagram = Array.from({ length: 13 }, (_, i) => ({
  src: `/insta/${String(i + 1).padStart(2, "0")}.webp`,
  alt: "Photo from Oscar's Instagram",
}));
