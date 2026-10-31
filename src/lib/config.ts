/** Set at build time. Leave empty when deploying at a domain root. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://nord-detailing-vexora.giddypath1.chatgpt.site"
).replace(/\/$/, "");
export const assetPath = (path: string) => `${basePath}${path}`;
export const pageUrl = (path: string) => `${siteUrl}${path}`;
