import type { Metadata } from "next";
import Site from "@/components/site";
export const metadata: Metadata = {
  title: "Privacy & Demo Information",
  description:
    "How this demonstration works, image attribution and privacy information.",
  alternates: { canonical: "/privacy/" },
};
export default function PrivacyPage() {
  return <Site page="privacy" />;
}
