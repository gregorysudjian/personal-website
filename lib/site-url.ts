/** The public address of the site. Set NEXT_PUBLIC_SITE_URL once you have a domain;
 *  on Vercel it falls back to the project's production URL automatically. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
