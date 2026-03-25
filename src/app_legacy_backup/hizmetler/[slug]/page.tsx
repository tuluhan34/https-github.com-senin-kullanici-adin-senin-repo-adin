import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SITE, services, whatsappLink } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return {};
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    keywords: [
      service.title,
      `${service.title} Istanbul`,
      "istanbul kurye",
      "kurye fiyatlari",
      "hizli kurye",
      "ayni gun teslimat",
    ],
    alternates: {
      canonical: `https://${SITE.domain}/hizmetler/${service.slug}`,
    },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: `https://${SITE.domain}/hizmetler/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const serviceBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `https://${SITE.domain}` },
      { "@type": "ListItem", position: 2, name: "Hizmetler", item: `https://${SITE.domain}/hizmetler` },
      { "@type": "ListItem", position: 3, name: service.title, item: `https://${SITE.domain}/hizmetler/${service.slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.longDescription,
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      url: `https://${SITE.domain}`,
      telephone: "+905303219004",
    },
    areaServed: { "@type": "City", name: "Istanbul" },
    serviceType: service.title,
  };

  return (
    <div className="min-h-screen">
      <main className="section-shell py-12">
        <Link href="/hizmetler" className="text-sm font-semibold text-zinc-600">
          {"<-"} Tüm Hizmetler
        </Link>

        <h1 className="mt-4 font-display text-6xl uppercase tracking-wide">
          {service.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700">
          {service.longDescription}
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Hizmet Kapsamı</h2>
            <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
              {service.bullets.map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-white shadow-sm">
            <h2 className="text-xl font-semibold text-yellow-300">Hızlı Sipariş Kanalları</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Bu hizmet için ekibimizle hemen iletişime geçin. Gönderi detaylarınıza
              göre en hızlı operasyon planını dakikalar içinde oluşturalım.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={whatsappLink(
                  `Merhaba, ${service.title} hizmeti icin detayli fiyat teklifi almak istiyorum.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-950"
              >
              WhatsApp ile Sipariş
            </a>
              <a
                href={SITE.phoneHref}
                className="rounded-xl border border-zinc-600 px-4 py-2 text-sm font-semibold"
              >
                Hemen Ara
              </a>
            </div>
            <p className="mt-4 text-xs text-zinc-400">Hedef teslimat süresi: {service.deliveryTime}</p>
          </article>
        </section>
      </main>
      <section className="section-shell py-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Diğer Hizmetlerimiz</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {services
            .filter((s) => s.slug !== service.slug)
            .map((s) => (
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
            <Link href="/" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950">Ana Sayfa</Link>
          </li>
          <li>
            <Link href="/blog" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:text-zinc-950">Blog</Link>
          </li>
        </ul>
      </section>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </div>
  );
}
