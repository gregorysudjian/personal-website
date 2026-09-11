import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: `${siteUrl}/en`, fr: `${siteUrl}/fr` };
  return [
    { url: `${siteUrl}/en`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${siteUrl}/fr`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
  ];
}
