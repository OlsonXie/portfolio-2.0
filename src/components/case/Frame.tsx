import Image from "next/image";
import type { FrameBg, Img } from "@/lib/cases";

const BG: Record<FrameBg, string> = {
  grey: "var(--frame-grey)",
  light: "#e6e6e6",
  blue: "var(--frame-blue)",
  dark: "var(--frame-dark)",
  pink: "var(--frame-pink)",
};

/** The image frame every case uses: sharp corners, tinted background, image centered inside */
export function Frame({
  bg,
  children,
  className = "",
  style,
}: {
  bg: FrameBg;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure className={`relative overflow-hidden ${className}`} style={{ background: BG[bg], ...style }}>
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
        unoptimized={image.src.endsWith(".svg")}
        className={`h-auto max-h-full w-auto max-w-full ${shadow ? "shadow-[0_4px_12px_rgba(0,0,0,0.2)]" : ""} ${blend ? "mix-blend-multiply" : ""}`}
      />
    </div>
  );
}
