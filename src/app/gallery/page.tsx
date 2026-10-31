import { pageUrl } from "@/lib/config";
import type { Metadata } from "next";
import Site from "@/components/site";
export const metadata: Metadata = {
  title: "The Art of Detailing — Gallery",
  description:
    "A curated gallery of automotive concept imagery. Filter interior, exterior, paint correction and ceramic coating inspiration.",
  alternates: { canonical: pageUrl("/gallery/") },
  openGraph: {
    title: "The Art of Detailing — NORD Gallery",
    description:
      "Automotive design inspiration. Demonstration imagery, not customer work.",
    url: pageUrl("/gallery/"),
  },
};
export default function GalleryPage() {
  return <Site page="gallery" />;
}
