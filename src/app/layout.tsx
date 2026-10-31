import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { assetPath, pageUrl, siteUrl } from "@/lib/config";
import "./globals.css";
const geist = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: pageUrl("/") },
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
        url: pageUrl("/images/hero.webp"),
        width: 1536,
        height: 1024,
        alt: "NORD DETAILING fictional studio concept",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: { icon: assetPath("/icon.svg") },
};
export const viewport: Viewport = { themeColor: "#090909" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
