import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-data";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "34 Kurye",
    description:
      "İstanbul moto kurye, acil kurye, VIP kurye ve araçlı kurye hizmeti. 7/24 hızlı teslimat.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffef8",
    theme_color: "#0a0a0a",
    orientation: "portrait",
    lang: "tr-TR",
    categories: ["business", "logistics", "transportation"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/brand/34motokuryeistanbul-google-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    prefer_related_applications: false,
  };
}
