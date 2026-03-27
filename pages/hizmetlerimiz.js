import Head from "next/head";
import Link from "next/link";
import { servicesCatalog } from "../lib/services-catalog";

export default function Hizmetlerimiz() {
  const siteUrl = "https://www.34motokuryeistanbul.com";
  const canonicalUrl = `${siteUrl}/hizmetlerimiz/`;
  const title = "Hizmetlerimiz | 34 Moto Kurye İstanbul";
  const description = "Kurumsal moto kurye hizmetlerimiz: acil kurye, express kurye, VIP kurye ve araçlı kurye çözümleri.";
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: servicesCatalog.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `${siteUrl}/hizmetler/${service.slug}/`,
    })),
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Kurumsal Hizmet Sayfaları</p>
            <h1>Hizmetlerimiz</h1>
            <p className="lead">
              Operasyon ihtiyacınıza uygun kurye modelini seçin. Her hizmet sayfasında süreç,
              hız ve taşıma kapsamı profesyonel biçimde açıklanmıştır.
            </p>
            <p className="lead">
              Finans, hukuk, sağlık, üretim ve e-ticaret operasyonları için İstanbul genelinde
              ölçülebilir hız ve kurumsal teslim disiplini sağlıyoruz.
            </p>
          </div>

          <div className="service-grid">
            {servicesCatalog.map((service) => (
              <Link key={service.slug} href={`/hizmetler/${service.slug}`} className="service-card-link">
                <article className="service-card">
                  <img className="service-card-media" src={service.image} alt={service.imageAlt} loading="lazy" />
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </article>
              </Link>
            ))}
          </div>

          <div className="services-bottom-cta">
            <a className="btn btn-primary" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">
              WhatsApp Destek
            </a>
            <a className="btn btn-whatsapp" href="tel:05303219004">
              Arama Yap
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
