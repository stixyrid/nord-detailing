import { siteUrl } from "@/lib/config";
import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  return ["", "services/", "gallery/", "about/", "contact/", "privacy/"].map(
    (path) => ({
      url: `${base}/${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    }),
  );
}
