import { pageUrl } from "@/lib/config";
import type { Metadata } from "next";
import Site from "@/components/site";
export const metadata: Metadata = {
  title: "Privacy & Demo Information",
  description:
    "How this demonstration works, image attribution and privacy information.",
  alternates: { canonical: pageUrl("/privacy/") },
};
export default function PrivacyPage() {
  return <Site page="privacy" />;
}
