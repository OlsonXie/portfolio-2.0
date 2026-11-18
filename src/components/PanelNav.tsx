import Link from "next/link";

/** Top bar inside an open panel: back link + close (back to the home grid) */
export function PanelNav({ back = { href: "/", label: "Back" } }: { back?: { href: string; label: string } }) {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-[var(--tone-bg)] px-[var(--pad)] py-5 lg:py-[var(--pad)]">
      <Link
        href={back.href}
        className="inline-flex items-center gap-4 text-[clamp(1.125rem,1.39vw,1.5rem)] font-semibold leading-[1.2] tracking-[-0.01em] underline-offset-4 hover:underline"
      >
        <svg className="size-7 lg:size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8l-4 4 4 4M16 12H8" />
        </svg>
        {back.label}
      </Link>
      <Link href="/" aria-label="Close and go to the home screen" className="transition hover:opacity-60">
        <svg className="size-7 lg:size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
