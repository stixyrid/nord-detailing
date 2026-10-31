import type { Metadata, Viewport } from "next";
import "./globals.css";
const url =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://nord-detailing-vexora.giddypath1.chatgpt.site";
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "NORD DETAILING — Precision in Every Detail",
    template: "%s | NORD DETAILING",
  },
  description:
    "A premium automotive detailing concept in Tallinn. Explore interior care, paint correction and ceramic protection. Demonstration website by VEXORA Digital.",
  openGraph: {
    type: "website",
    locale: "en_EE",
    siteName: "NORD DETAILING — Demo",
    title: "NORD DETAILING — Precision in Every Detail",
    description:
      "Premium automotive care, thoughtfully imagined. A demonstration project by VEXORA Digital.",
    images: [
      {
        url: "/images/hero.webp",
        width: 1536,
        height: 1024,
        alt: "NORD DETAILING fictional studio concept",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#090909" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
