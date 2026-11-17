import Link from "next/link";

/** Top bar inside an open panel: back link + close (back to the bento home) */
export function PanelNav({ back = { href: "/", label: "Back" } }: { back?: { href: string; label: string } }) {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-[color-mix(in_srgb,var(--tone-bg)_92%,transparent)] px-6 py-5 backdrop-blur lg:px-10 lg:py-8">
      <Link href={back.href} className="inline-flex items-center gap-3 text-lg font-medium hover:underline lg:text-xl">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8l-4 4 4 4M16 12H8" />
        </svg>
        {back.label}
      </Link>
      <Link href="/" aria-label="Close and go to the home screen" className="rounded-full transition hover:opacity-70">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </Link>
    </nav>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide lg:text-base">{children}</h2>;
}
