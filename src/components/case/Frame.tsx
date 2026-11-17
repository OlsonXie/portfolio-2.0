import Image from "next/image";
import type { FrameBg, Img } from "@/lib/cases";

const BG: Record<FrameBg, string> = {
  grey: "var(--frame-grey)",
  blue: "var(--frame-blue)",
  dark: "var(--frame-dark)",
  pink: "var(--frame-pink)",
};

/** The image frame every case uses: rounded, tinted background, image centered inside */
export function Frame({
  bg,
  children,
  className = "",
}: {
  bg: FrameBg;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={`relative overflow-hidden rounded-[var(--radius-tile)] ${className}`} style={{ background: BG[bg] }}>
      {children}
    </figure>
  );
}

export function FrameImage({
  image,
  fit = "contain",
  shadow,
  blend,
  sizes,
  priority,
}: {
  image: Img;
  fit?: "contain" | "cover";
  shadow?: boolean;
  blend?: boolean;
  sizes: string;
  priority?: boolean;
}) {
  if (fit === "cover") {
    return <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center p-[8%]">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.w}
        height={image.h}
        sizes={sizes}
        priority={priority}
        className={`h-auto max-h-full w-auto max-w-full ${shadow ? "rounded-md shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]" : ""} ${blend ? "mix-blend-multiply" : ""}`}
      />
    </div>
  );
}
