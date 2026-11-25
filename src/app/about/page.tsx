import type { Metadata } from "next";
import { Label, PanelNav } from "@/components/PanelNav";
import { InstaCarousel } from "@/components/about/InstaCarousel";
import { Turntable } from "@/components/about/Turntable";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <div>
      <PanelNav />
      <div className="px-[var(--pad)] pb-16 lg:pb-24">
        <p className="t-eyebrow pt-6 lg:pt-10">About me</p>
        <h1 className="t-display mt-3">Let me introduce myself…</h1>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-12 lg:mt-20">
          <section>
            <Label>Background</Label>
            <p className="mt-3 text-[17px] leading-relaxed lg:text-lg">
              Before design, there was a guitar. After high school I played in two rock bands with my childhood
              friend, and when we started recording albums someone had to make the artwork and the concept around
              it. That fell to me — and I realised I loved it more than the music. So I went to Berlin to study art
              direction, moved from advertising into digital design, and today I work in UX/UI and design systems.
              Along the way I&rsquo;ve worked across most of visual design: identity, illustration, motion and product.
            </p>
          </section>
          <section>
            <Label>What&rsquo;s next?</Label>
            <p className="mt-3 text-[17px] leading-relaxed lg:text-lg">
              You tell me. As a product designer, I want to keep making the best possible products — digital or any
              other kind — with systems thinking at the core: solid foundations that let teams ship faster without
              losing consistency. I&rsquo;m also curious about how AI changes the way products and systems are made.
              If you&rsquo;re working on something like that, let&rsquo;s talk.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {[
                ["LinkedIn", site.links.linkedin],
                ["Email", site.links.email],
                ["Instagram", site.links.instagram],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="inline-flex items-center gap-2 border border-[var(--stroke)] px-4 py-2 font-semibold transition hover:bg-ink hover:text-white"
                  >
                    {label}
                    <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-16 grid items-start gap-10 sm:grid-cols-2 sm:gap-12 lg:mt-24">
          <InstaCarousel />
          <div>
            <Turntable />
            <section className="mt-6 max-w-xl">
              <h2 className="text-lg font-medium lg:text-xl">Vinyl hunt</h2>
              <p className="mt-2 leading-relaxed text-ink-muted">
                Since 2017, a friend and I have been buying records we know nothing about. We walk into a shop with a
                rule — shelf B, record 15; something yellow on the cover; a mountain; a number picked by a stranger —
                and buy whatever it lands on. Then we go home and drop the needle to find out what we&rsquo;ve brought
                back. This playlist is the hall of fame: the best of what the hunt has turned up.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
