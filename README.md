# Portfolio 2.0 — Oscar Olson Xie

A customizable bento portfolio. Visitors can drag blocks around, change their colours and swap the profile photo; the layout is saved in their browser. Opening a block (Selected work, About, Extras) grows it into a scrollable panel from wherever it sits, while Picture and Links stay put beside it.

## Stack

- **Next.js 16** (App Router, Cache Components) + TypeScript
- **Tailwind CSS 4** + CSS custom properties as design tokens (`src/app/globals.css`)
- **dnd-kit** for drag-and-drop, **Motion** for layout/shared-element animations
- Self-hosted **Inter** via `@fontsource-variable/inter`
- Deploy: **Vercel** (import this repo, no config needed)

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Where things live

| What | File |
|---|---|
| Colour tokens (`--block-{hue}-{soft\|deep}`), frame backgrounds | `src/app/globals.css` |
| Links, intro, photos, Instagram selection, **YouTube playlist ID** | `src/lib/site.ts` |
| Case studies (all use one template) | `src/lib/cases.ts` |
| Bento grid, drag/swap, open panel | `src/components/bento/` |
| Case template, image frames, SUS score | `src/components/case/` |
| Instagram carousel, record player | `src/components/about/` |

### Add or edit a case

Add an entry to `cases` in `src/lib/cases.ts`. Blocks are rendered in order:

- `{ kind: "text", label, body }`
- `{ kind: "frame", layout: "full", bg, image, fit?, shadow? }` — one frame, full width
- `{ kind: "frame", layout: "pair", bg, images: [a, b], fit?, blend? }` — two frames side by side
- `{ kind: "frame", layout: "row", bg, images }` — several screens in one frame
- `{ kind: "illustrations", images }`, `{ kind: "sus" }`

Frame backgrounds: `grey`, `blue`, `dark`, `pink`. Put images in `public/work/` (WebP).

### Record player

Set `youtubePlaylistId` in `src/lib/site.ts` to the ID after `list=` in the YouTube playlist URL. Until then the record spins but no music plays.

### Instagram

`public/insta/01.webp … 13.webp` — a random 6 are shown per visit. Replace or add files and update the count in `src/lib/site.ts`.
