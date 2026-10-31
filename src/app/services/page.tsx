import type { Metadata } from "next";
import Site from "@/components/site";
export const metadata: Metadata = {
  title: "Services & Demo Pricing",
  description:
    "Explore six concept detailing treatments, from interior care to paint correction and ceramic coating. All pricing is illustrative.",
  alternates: { canonical: "/services/" },
  openGraph: {
    title: "Services & Demo Pricing — NORD DETAILING",
    description:
      "Six considered automotive treatments. Demonstration services and pricing.",
    url: "/services/",
  },
};
export default function ServicesPage() {
  return <Site page="services" />;
}
