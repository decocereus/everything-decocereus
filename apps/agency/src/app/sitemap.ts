import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      priority: 1,
      url: SITE.url,
    },
  ];
}
