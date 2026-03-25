import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { FloatingActions } from "@/components/floating-actions";
import { PwaInstallNudge, PwaNotificationBridge, PwaRegistration } from "@/components/pwa-install";
import { SITE, googleBusinessMapUrl, googleBusinessProfileUrl, googleBusinessSnapshot } from "@/lib/site-data";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  applicationName: SITE.name,
  title: {
    default: `İstanbul Moto Kurye, Acil Kurye ve Hızlı Teslimat | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "İstanbul moto kurye, acil kurye, VIP kurye ve araçlı kurye hizmeti. 7/24 operasyon, 39 ilçede hızlı teslimat ve WhatsApp ile anında fiyat teklifi alın.",
  keywords: [
    "İstanbul moto kurye",
    "acil kurye",
    "hızlı kurye",
    "VIP kurye",
    "moto kurye İstanbul",
    "kurye hizmeti",
    "gece kurye",
    "araçlı kurye",
    "kurye fiyatları",
    "İstanbul kurye",
    "aynı gün teslimat",
  ],
  category: "Lojistik ve Kurye Hizmetleri",
  classification: "Kurye, lojistik, aynı gün teslimat, moto kurye",
  referrer: "origin-when-cross-origin",
  creator: SITE.name,
  publisher: SITE.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/brand/34motokuryeistanbul-google-logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/34motokuryeistanbul-google-logo.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `İstanbul Moto Kurye ve Acil Kurye Hizmeti | ${SITE.name}`,
    description:
      "İstanbul genelinde moto kurye, acil kurye, VIP kurye ve araçlı kurye hizmeti. 7/24 hızlı teslimat ve anında fiyat teklifi.",
    url: `https://${SITE.domain}`,
    siteName: SITE.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} İstanbul Moto Kurye`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `İstanbul Moto Kurye ve Acil Kurye | ${SITE.name}`,
    description: "7/24 moto kurye, acil teslimat ve WhatsApp ile hızlı fiyat teklifi.",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: `https://${SITE.domain}`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "TR-34",
    "geo.placename": "İstanbul",
    "geo.position": "41.0082;28.9784",
    ICBM: "41.0082, 28.9784",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: `https://${SITE.domain}`,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "CommunicateAction",
      target: `https://wa.me/${SITE.whatsappNumber}`,
      name: "WhatsApp ile kurye talebi oluştur",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: `https://${SITE.domain}`,
    logo: `https://${SITE.domain}/brand/34motokuryeistanbul-google-logo.svg`,
    image: `https://${SITE.domain}/opengraph-image`,
    telephone: "+905303219004",
    sameAs: [
      ...Object.values(SITE.social),
      ...Object.values(SITE.directories),
      googleBusinessProfileUrl,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+905303219004",
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: ["tr"],
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    url: `https://${SITE.domain}`,
    telephone: "+905303219004",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressRegion: "Istanbul",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.0082,
      longitude: 28.9784,
    },
    hasMap: googleBusinessMapUrl,
    image: `https://${SITE.domain}/opengraph-image`,
    logo: `https://${SITE.domain}/brand/34motokuryeistanbul-google-logo.svg`,
    openingHours: "Mo-Su 00:00-23:59",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: {
      "@type": "City",
      name: "İstanbul",
    },
    priceRange: "$$",
    serviceType: [
      "Moto Kurye",
      "Acil Kurye",
      "VIP Kurye",
      "Gece Kurye",
      "Araçlı Kurye",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(googleBusinessSnapshot.ratingValue),
      reviewCount: String(googleBusinessSnapshot.reviewCount),
      bestRating: String(googleBusinessSnapshot.bestRating),
    },
    sameAs: [
      ...Object.values(SITE.social),
      ...Object.values(SITE.directories),
      googleBusinessProfileUrl,
    ].filter(Boolean),
  };

  return (
    <html lang="tr" className={`${sora.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)]">
        {children}
        <FloatingActions />
        <PwaRegistration />
        <PwaNotificationBridge />
        <PwaInstallNudge />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteSchema, organizationSchema, localBusinessSchema]) }}
        />
      </body>
    </html>
  );
}
