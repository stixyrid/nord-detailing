import { pageUrl } from "@/lib/config";
import type { Metadata } from "next";
import Site from "@/components/site";
export const metadata: Metadata = {
  title: "Our Philosophy",
  description:
    "Meet NORD: a fictional detailing concept shaped by Nordic restraint, material care and precision. A VEXORA Digital demonstration.",
  alternates: { canonical: pageUrl("/about/") },
  openGraph: {
    title: "Driven by the Details — NORD DETAILING",
    description: "The philosophy behind a fictional Nordic detailing studio.",
    url: pageUrl("/about/"),
  },
};
export default function AboutPage() {
  return <Site page="about" />;
}
