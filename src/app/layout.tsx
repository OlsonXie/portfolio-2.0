import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/bento/Shell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000",
  ),
  title: { default: site.title, template: "%s — Oscar Olson Xie" },
  description: site.intro,
  openGraph: { title: site.title, description: site.intro, images: ["/photos/swim.webp"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
