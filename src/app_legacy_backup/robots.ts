import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-data";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = `https://${SITE.domain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/*?*utm_*"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: SITE.domain,
  };
}
