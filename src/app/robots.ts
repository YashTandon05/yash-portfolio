import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/bio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteMeta.url}/sitemap.xml`,
  };
}
