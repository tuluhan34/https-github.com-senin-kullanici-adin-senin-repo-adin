import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoogleMap } from "@/components/google-map";
import { SiteFooter } from "@/components/site-footer";
import {
  SITE,
  buildDistrictMetadataDescription,
  buildDistrictMiniFaq,
  buildDistrictSeoArticle,
  defaultOrderMessage,
  districtBySlug,
  districts,
  getFeaturedNeighborhoodsForDistrict,
  getNeighborhoodsForDistrict,
  services,
  whatsappLink,
} from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return districts.map((district) => ({ slug: district.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const district = districtBySlug.get(slug);

  if (!district) {
    return {};
  }

  return {
    title: `${district.name} Moto Kurye | Acil Kurye ve 7/24 Hızlı Teslimat`,
    description: buildDistrictMetadataDescription(district.name),
    keywords: [
      `${district.name} moto kurye`,
      `${district.name} acil kurye`,
      "İstanbul moto kurye",
      "acil moto kurye",
      "hızlı moto kurye",
    ],
    alternates: {
      canonical: `https://${SITE.domain}/${district.slug}`,
    },
    openGraph: {
      title: `${district.name} Moto Kurye | 7/24 Acil Kurye | ${SITE.name}`,
      description: `${district.name} moto kurye ihtiyaciniz icin 7/24 hizli teslimat, acil moto kurye yonlendirmesi ve WhatsApp ile aninda fiyat alma imkani.`,
      url: `https://${SITE.domain}/${district.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${district.name} Moto Kurye | ${SITE.name}`,
      description: `${district.name} bolgesinde acil kurye ve ayni gun teslimat icin hizli fiyat alin.`,
    },
  };
}

export default async function DistrictPage({ params }: Props) {
  const { slug } = await params;
  const district = districtBySlug.get(slug);

  if (!district) {
    notFound();
  }

  const paragraphs = buildDistrictSeoArticle(district.name);
  const neighborhoods = getNeighborhoodsForDistrict(district.slug);
  const featuredNeighborhoods = getFeaturedNeighborhoodsForDistrict(district.name, 6);
  const districtFaqItems = buildDistrictMiniFaq(district.name);

  const districtBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `https://${SITE.domain}` },
      { "@type": "ListItem", position: 2, name: `${district.name} Moto Kurye`, item: `https://${SITE.domain}/${district.slug}` },
    ],
  };

  const districtLocalBiz = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE.name} - ${district.name} Moto Kurye`,
    url: `https://${SITE.domain}/${district.slug}`,
    telephone: "+905303219004",
    address: {
      "@type": "PostalAddress",
      addressLocality: district.name,
      addressRegion: "Istanbul",
      addressCountry: "TR",
    },
    areaServed: { "@type": "City", name: district.name },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(district.name + ", Istanbul, Turkey")}`,
    openingHours: "Mo-Su 00:00-23:59",
  };

  const neighborhoodListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${district.name} Mahalle Moto Kurye Sayfalari`,
    itemListElement: neighborhoods.map((neighborhood, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${district.name} ${neighborhood.name} Moto Kurye`,
      url: `https://${SITE.domain}${neighborhood.path}`,
    })),
  };

  const districtFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: districtFaqItems.map((item) => ({
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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">İlçe Sayfası</p>
        <h1 className="mt-2 font-display text-6xl uppercase tracking-wide">
          {district.name} Moto Kurye
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700">
          {district.name} bölgesinde hızlı moto kurye, acil moto kurye ve 7/24 teslimat
          ihtiyaçlarınız için güven veren operasyon altyapısı.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={whatsappLink(
              `Merhaba, ${district.name} bolgesi icin moto kurye fiyat bilgisi almak istiyorum.`,
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
          <h2 className="font-display text-4xl uppercase tracking-wide">
            {district.name} İlçesinde Moto Kurye Operasyonu
          </h2>

          <div className="mt-5 grid gap-5 text-sm leading-8 text-zinc-700">
            {paragraphs.map((paragraph, index) => (
              <p key={`${district.slug}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {district.name} Icinde One Cikan Mahalleler
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700">
            Ilce genelindeki hizmet akisini daha net gostermek icin one cikan mahalleleri ayri
            olarak listeliyoruz. Bu alan, kullaniciya dogru bolgeye daha hizli gecis imkani verir.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {featuredNeighborhoods.map((name) => {
              const item = neighborhoods.find((neighborhood) => neighborhood.name === name);

              if (!item) {
                return null;
              }

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="block rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:bg-white hover:text-zinc-950"
                  >
                    <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Mahalle Sayfasi
                    </span>
                    <span className="mt-2 block text-base font-semibold">
                      {district.name} {item.name} Moto Kurye
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {district.name} Mahalle Moto Kurye Sayfaları
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700">
            Mahalle bazlı teslimat detayları için aşağıdaki sayfalardan bölgenizi seçin.
            Bu iç link yapısı sayesinde ilçe ve mahalle içerikleri birbiriyle güçlü şekilde
            bağlanır ve organik görünürlük artar.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {neighborhoods.map((neighborhood) => (
              <li key={neighborhood.path}>
                <Link
                  href={neighborhood.path}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950"
                >
                  {district.name} {neighborhood.name} Moto Kurye
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {district.name} Icin Mini SSS
          </h2>
          <div className="mt-4 grid gap-3">
            {districtFaqItems.map((item) => (
              <details key={item.question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-zinc-900">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-zinc-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-200">
          <GoogleMap
            query={`${district.name}, Istanbul, Turkey`}
            zoom={14}
            className="h-[320px] w-full"
            title={`${district.name} haritasi`}
          />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-white">
          <h2 className="font-display text-4xl uppercase tracking-wide">Hemen Sipariş Verin</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-300">
            {district.name} bölgesinde dakika bazlı moto kurye planlaması için WhatsApp
            hattımıza yazın. Adres detaylarınızı iletin, uygun model ve net fiyatla
            hemen dönelim.
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

      <section className="section-shell py-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {district.name} Bölgesinde Hizmetlerimiz
        </h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/hizmetler/${s.slug}`}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950"
              >
                {s.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/hizmetler" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950">Tüm Hizmetler</Link>
          </li>
          <li>
            <Link href="/blog" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950">Blog</Link>
          </li>
          <li>
            <Link href="/" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950">Ana Sayfa</Link>
          </li>
        </ul>
      </section>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(districtBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(districtLocalBiz) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(districtFaqSchema) }} />
    </div>
  );
}
