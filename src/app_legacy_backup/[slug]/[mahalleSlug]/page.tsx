import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoogleMap } from "@/components/google-map";
import { SiteFooter } from "@/components/site-footer";
import {
  SITE,
  allDistrictNeighborhoodParams,
  buildNeighborhoodMetadataDescription,
  buildNeighborhoodMiniFaq,
  buildNeighborhoodSeoArticle,
  defaultOrderMessage,
  districtBySlug,
  getNearbyNeighborhoods,
  getNeighborhoodBySlugs,
  getNeighborhoodsForDistrict,
  services,
  whatsappLink,
} from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string; mahalleSlug: string }>;
};

export function generateStaticParams() {
  return allDistrictNeighborhoodParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, mahalleSlug } = await params;
  const district = districtBySlug.get(slug);
  const neighborhood = getNeighborhoodBySlugs(slug, mahalleSlug);

  if (!district || !neighborhood) {
    return {};
  }

  const title = `${district.name} ${neighborhood.name} Moto Kurye | 7/24 Acil Teslimat`;
  const description = buildNeighborhoodMetadataDescription(district.name, neighborhood.name);
  const canonical = `https://${SITE.domain}/${slug}/${mahalleSlug}`;

  return {
    title,
    description,
    keywords: [
      `${district.name} ${neighborhood.name} moto kurye`,
      `${district.name} ${neighborhood.name} acil kurye`,
      `${district.name} mahalle kurye`,
      `${district.name} moto kurye`,
      "İstanbul mahalle moto kurye",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${district.name} ${neighborhood.name} için 7/24 hızlı kurye yönlendirmesi ve anlık fiyat desteği.`,
    },
  };
}

export default async function NeighborhoodPage({ params }: Props) {
  const { slug, mahalleSlug } = await params;
  const district = districtBySlug.get(slug);
  const neighborhood = getNeighborhoodBySlugs(slug, mahalleSlug);

  if (!district || !neighborhood) {
    notFound();
  }

  const paragraphs = buildNeighborhoodSeoArticle(district.name, neighborhood.name);
  const siblingNeighborhoods = getNeighborhoodsForDistrict(slug).filter(
    (item) => item.slug !== neighborhood.slug,
  );
  const nearbyNeighborhoodNames = getNearbyNeighborhoods(district.name, neighborhood.name, 6);
  const nearbyNeighborhoods = nearbyNeighborhoodNames
    .map((name) => siblingNeighborhoods.find((item) => item.name === name))
    .filter((item): item is (typeof siblingNeighborhoods)[number] => Boolean(item));
  const neighborhoodFaqItems = buildNeighborhoodMiniFaq(district.name, neighborhood.name);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `https://${SITE.domain}` },
      { "@type": "ListItem", position: 2, name: `${district.name} Moto Kurye`, item: `https://${SITE.domain}/${district.slug}` },
      { "@type": "ListItem", position: 3, name: `${district.name} ${neighborhood.name} Moto Kurye`, item: `https://${SITE.domain}/${district.slug}/${neighborhood.slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Moto Kurye",
    name: `${district.name} ${neighborhood.name} Moto Kurye Hizmeti`,
    areaServed: {
      "@type": "Place",
      name: `${district.name} ${neighborhood.name}, Istanbul`,
    },
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      telephone: "+905303219004",
      url: `https://${SITE.domain}`,
    },
    url: `https://${SITE.domain}/${district.slug}/${neighborhood.slug}`,
  };

  const neighborhoodFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: neighborhoodFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <main className="section-shell py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Mahalle Sayfası
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-wide sm:text-6xl">
          {district.name} {neighborhood.name} Moto Kurye
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700">
          {district.name} {neighborhood.name} bölgesinde acil moto kurye, ekspres teslimat ve
          aynı gün kurye ihtiyaçlarınız için hızlı yönlendirme alabilirsiniz.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={whatsappLink(
              `Merhaba, ${district.name} ${neighborhood.name} için moto kurye fiyat bilgisi almak istiyorum.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-zinc-950"
          >
            WhatsApp&apos;tan Fiyat Al
          </a>
          <a
            href={SITE.phoneHref}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold"
          >
            Hemen Ara
          </a>
        </div>

        <article className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {district.name} {neighborhood.name} Bölgesinde Kurye Operasyonu
          </h2>
          <div className="mt-5 grid gap-5 text-sm leading-8 text-zinc-700">
            {paragraphs.map((paragraph, index) => (
              <p key={`${district.slug}-${neighborhood.slug}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-200">
          <GoogleMap
            query={`${neighborhood.name}, ${district.name}, Istanbul, Turkey`}
            zoom={15}
            className="h-[320px] w-full"
            title={`${district.name} ${neighborhood.name} haritasi`}
          />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {neighborhood.name} Yakin Hizmet Alanlari
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700">
            Bu bolgeye yakin mahalle sayfalari ayni ilce icindeki teslimat akislarini daha net
            gosterir. Kullanici hangi noktaya yakin oldugunu daha hizli anlayabilir.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {nearbyNeighborhoods.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="block rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:bg-white hover:text-zinc-950"
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Yakin Mahalle
                  </span>
                  <span className="mt-2 block text-base font-semibold">
                    {district.name} {item.name} Moto Kurye
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {district.name} İlçesindeki Diğer Mahalle Sayfaları
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {siblingNeighborhoods.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/${district.slug}`}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800"
            >
              {district.name} İlçe Sayfası
            </Link>
            <Link
              href="/hizmetler"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800"
            >
              Tüm Hizmetler
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {district.name} {neighborhood.name} Mini SSS
          </h2>
          <div className="mt-4 grid gap-3">
            {neighborhoodFaqItems.map((item) => (
              <details key={item.question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-zinc-900">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-zinc-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-white">
          <h2 className="font-display text-4xl uppercase tracking-wide">Hemen Sipariş Verin</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-300">
            {district.name} {neighborhood.name} bölgesi için dakikalar içinde kurye yönlendirmesi
            almak üzere WhatsApp hattımıza yazabilirsiniz.
          </p>
          <a
            href={whatsappLink(defaultOrderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-zinc-950"
          >
            WhatsApp ile Sipariş
          </a>
        </section>
      </main>

      <section className="section-shell pb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {district.name} İçin Önerilen Hizmetler
        </h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/hizmetler/${service.slug}`}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950"
              >
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodFaqSchema) }}
      />
    </div>
  );
}
