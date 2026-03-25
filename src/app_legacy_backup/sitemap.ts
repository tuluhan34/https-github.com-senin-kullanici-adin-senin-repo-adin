import type { MetadataRoute } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE, allDistrictNeighborhoodParams, districts, services } from "@/lib/site-data";

export const dynamic = "force-static";

type BlogSitemapPost = {
  slug: string;
  publishedAt: string;
};

const readBlogPostsForSitemap = async (): Promise<BlogSitemapPost[]> => {
  try {
    const filePath = path.join(process.cwd(), "data", "blog", "blog-posts.json");
    const file = await readFile(filePath, "utf8");
    const parsed = JSON.parse(file) as { posts?: BlogSitemapPost[] };
    return parsed.posts ?? [];
  } catch {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${SITE.domain}`;
  const now = new Date();
  const blogPosts = await readBlogPostsForSitemap();

  const serviceUrls = services.map((service) => ({
    url: `${base}/hizmetler/${service.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const districtUrls = districts.map((district) => ({
    url: `${base}/${district.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const neighborhoodUrls = allDistrictNeighborhoodParams.map((params) => ({
    url: `${base}/${params.slug}/${params.mahalleSlug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.68,
  }));

  const blogUrls = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.72,
  }));

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.86,
    },
    {
      url: `${base}/galeri`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/hizmetler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/data/backlink-outreach-tracker-template.csv`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.52,
    },
    {
      url: `${base}/data/backlink-prospect-scorecard-template.csv`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.52,
    },
    {
      url: `${base}/badges/34motokuryeistanbul-kaynak-dark.svg`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.42,
    },
    {
      url: `${base}/badges/34motokuryeistanbul-kaynak-light.svg`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.42,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/cookies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.35,
    },
    ...serviceUrls,
    ...districtUrls,
    ...neighborhoodUrls,
    ...blogUrls,
  ];
}
