import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SITE, defaultOrderMessage, services, whatsappLink } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "İstanbul Kurye Hizmetleri | Moto, Acil, VIP, Gece ve Araçlı Kurye",
  description:
    "İstanbul kurye hizmetleri sayfasında moto, acil, VIP, gece ve araçlı kurye seçeneklerini fiyat, hız, teslimat süresi ve kullanım alanına göre inceleyin.",
  keywords: [
    "kurye hizmetleri",
    "istanbul kurye hizmeti",
    "moto kurye fiyat",
    "acil kurye",
    "ekspres kurye",
    "vip kurye",
    "gece kurye",
    "aracli kurye",
    "kurye ucreti",
    "ayni gun kurye",
  ],
  alternates: {
    canonical: `https://${SITE.domain}/hizmetler`,
  },
  openGraph: {
    title: `İstanbul Kurye Hizmetleri | ${SITE.name}`,
    description:
      "Moto kurye, acil kurye, VIP kurye, gece kurye ve araçlı kurye hizmetlerini tek sayfada karşılaştırın.",
    url: `https://${SITE.domain}/hizmetler`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `İstanbul Kurye Hizmetleri | ${SITE.name}`,
    description: "Moto, acil, VIP, gece ve araçlı kurye hizmetlerini karşılaştırın.",
  },
};

export default function ServicesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `https://${SITE.domain}` },
      { "@type": "ListItem", position: 2, name: "Hizmetler", item: `https://${SITE.domain}/hizmetler` },
    ],
  };

  const servicesPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "İstanbul Kurye Hizmetleri",
    url: `https://${SITE.domain}/hizmetler`,
    description: metadata.description,
    inLanguage: "tr-TR",
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${SITE.name} Hizmet Kataloğu`,
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.seoDescription,
        url: `https://${SITE.domain}/hizmetler/${service.slug}`,
        areaServed: "Istanbul",
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <main className="section-shell py-12">
        <h1 className="font-display text-6xl uppercase tracking-wide">Kurye Hizmetleri</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700">
          İşinize en uygun modeli seçin. Tüm hizmetlerde WhatsApp üzerinden hızlı fiyat,
          telefonla anlık destek ve 7/24 operasyon avantajından faydalanın.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-display text-4xl uppercase tracking-wide">
                {service.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{service.longDescription}</p>
              <p className="mt-3 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700">
                Hedef teslimat: {service.deliveryTime}
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold"
                >
                  Detay Sayfası
                </Link>
                <a
                  href={whatsappLink(
                    `Merhaba, ${service.title} hizmeti icin fiyat almak istiyorum.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-950"
                >
                  WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-display text-4xl uppercase tracking-wide">Yuksek Trafik Anahtar Kelime Kumesi</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700">
            Bu sayfa; hiz odakli, fiyat odakli ve hizmet tipi odakli aramalari birlikte karsilar.
            Kullanici niyetine gore dogru alt sayfaya yonlendirme yapildiginda hem tiklama orani
            hem de donusum gucu artar. Ozellikle &quot;moto kurye fiyat&quot;, &quot;acil kurye&quot;, &quot;ekspres
            kurye&quot; ve &quot;Istanbul kurye hizmeti&quot; sorgulari icin ilgili hizmet detaylarina net gecis
            verilmesi onerilir.
          </p>
          <div className="mt-4 grid gap-2 text-sm text-zinc-700 md:grid-cols-2">
            <p className="rounded-lg bg-zinc-50 p-3">
              Hiz odakli sorgular: acil kurye, ekspres kurye, ayni gun kurye
            </p>
            <p className="rounded-lg bg-zinc-50 p-3">
              Fiyat odakli sorgular: kurye fiyatlari, moto kurye fiyat, kurye ucreti
            </p>
            <p className="rounded-lg bg-zinc-50 p-3">
              Hizmet tipi sorgular: VIP kurye, gece kurye, aracli kurye
            </p>
            <p className="rounded-lg bg-zinc-50 p-3">
              Lokasyon odakli sorgular: Istanbul kurye, ilce bazli moto kurye
            </p>
          </div>
        </section>

        <div className="mt-10 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-white">
          <h2 className="font-display text-4xl uppercase tracking-wide">Hızlı Sipariş</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-300">
            Doğrudan WhatsApp&apos;a geçin veya bizi arayın. Ekiplerimiz size en uygun teslimat
            modelini dakikalar içinde planlasın.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={whatsappLink(defaultOrderMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-zinc-950"
            >
              WhatsApp ile Sipariş
            </a>
            <a
              href={SITE.phoneHref}
              className="rounded-xl border border-zinc-600 px-5 py-3 text-sm font-semibold"
            >
              Hemen Ara
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
      />
    </div>
  );
}
