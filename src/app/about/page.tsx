import type { Metadata } from "next";
import { Label, PanelNav } from "@/components/PanelNav";
import { InstaCarousel } from "@/components/about/InstaCarousel";
import { Turntable } from "@/components/about/Turntable";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <div>
      <PanelNav />
      <div className="px-6 pb-16 lg:px-10 lg:pb-24">
        <h1 className="pt-10 text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-tight lg:pt-20">About me</h1>

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
              You tell me. I want to keep building design systems that help large teams ship faster without losing
              consistency — and explore how AI changes the way those systems are made and maintained. If you&rsquo;re
              working on something like that, let&rsquo;s talk.
            </p>
          </section>
        </div>

        <div className="mt-16 grid items-start gap-[var(--gap)] sm:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:mt-24">
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
