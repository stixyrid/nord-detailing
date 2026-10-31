import type { Metadata } from "next";
import Site from "@/components/site";
export const metadata: Metadata = {
  title: "Contact & Demo Booking",
  description:
    "Try the NORD demonstration booking form. No appointments are submitted and no personal data is sent or stored.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "Let’s Talk Details — NORD DETAILING",
    description:
      "Explore a demonstration automotive booking experience. No real bookings.",
    url: "/contact/",
  },
};
export default function ContactPage() {
  return <Site page="contact" />;
}
