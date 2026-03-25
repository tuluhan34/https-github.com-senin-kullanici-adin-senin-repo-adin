import type { Metadata } from "next";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Foto Galeri",
  description:
    "34 Moto Kurye Istanbul saha operasyonu, moto kurye, acil kurye ve VIP teslimat hizmetlerinden kareler.",
  alternates: {
    canonical: `https://${SITE.domain}/galeri`,
  },
  openGraph: {
    title: `Foto Galeri | ${SITE.name}`,
    description:
      "Istanbul genelindeki kurye operasyonlarimizdan gorseller ve hizmet kategorileri.",
    url: `https://${SITE.domain}/galeri`,
    type: "website",
  },
};

export default function GaleriLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}