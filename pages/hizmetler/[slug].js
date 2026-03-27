import Head from "next/head";
import Link from "next/link";
import { servicesCatalog } from "../../lib/services-catalog";

export default function ServiceDetailPage({ service }) {
  if (!service) {
    return null;
  }

  const siteUrl = "https://www.34motokuryeistanbul.com";
  const canonicalUrl = `${siteUrl}/hizmetler/${service.slug}/`;
  const pageTitle = `${service.title} | 34 Moto Kurye İstanbul`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.longDescription,
    areaServed: "Istanbul",
    provider: {
      "@type": "LocalBusiness",
      name: "34 Moto Kurye Istanbul",
      telephone: "+90 530 321 90 04",
      url: siteUrl,
    },
    url: canonicalUrl,
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={service.longDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={service.longDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${siteUrl}${service.image}`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={service.longDescription} />
        <meta name="twitter:image" content={`${siteUrl}${service.image}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Kurumsal Hizmet Detayı</p>
            <h1>{service.title}</h1>
            <p className="lead">{service.longDescription}</p>
          </div>

          <article className="service-card service-detail-card">
            <img
              className="service-card-media service-detail-media"
              src={service.image}
              alt={service.imageAlt}
              loading="lazy"
            />
            <h3>Hizmet Özeti</h3>
            <p>{service.desc}</p>
            <p>
              Bu hizmet, İstanbul içi kurumsal operasyonlarda zaman yönetimi ve teslim güvenliği
              odaklı planlanır. Talep türüne göre ekip, rota ve araç profili dinamik olarak belirlenir.
            </p>

            <h3>Kurumsal Operasyon Avantajları</h3>
            <ul className="service-highlights">
              {service.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="services-bottom-cta">
              <a className="btn btn-primary" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">
                WhatsApp Destek
              </a>
              <a className="btn btn-whatsapp" href="tel:05303219004">
                Arama Yap
              </a>
            </div>

            <Link href="/hizmetlerimiz" className="btn btn-whatsapp">Tüm Hizmetlere Dön</Link>
          </article>
        </section>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: servicesCatalog.map((service) => ({ params: { slug: service.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const service = servicesCatalog.find((item) => item.slug === params.slug) || null;

  return {
    props: {
      service,
    },
  };
}
