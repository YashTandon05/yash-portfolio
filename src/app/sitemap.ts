import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteMeta } from "@/content/bio";

/**
 * Native App Router sitemap — no next-sitemap dependency needed at this size.
 * Update `siteMeta.url` when the real domain is live.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteMeta.url, lastModified, priority: 1 },
    ...projects
      .filter((p) => !p.placeholder)
      .map((p) => ({
        url: `${siteMeta.url}/projects/${p.slug}`,
        lastModified,
        priority: 0.7,
      })),
  ];
}
