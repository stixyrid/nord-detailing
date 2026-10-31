import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://nord-detailing-vexora.giddypath1.chatgpt.site";
  return ["", "services/", "gallery/", "about/", "contact/", "privacy/"].map(
    (path) => ({
      url: `${base}/${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    }),
  );
}
