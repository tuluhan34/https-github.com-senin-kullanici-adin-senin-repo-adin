import Head from "next/head";
import Link from "next/link";
import { servicesCatalog } from "../lib/services-catalog";

export default function Hizmetlerimiz() {
  return (
    <>
      <Head>
        <title>Hizmetlerimiz | 34 Moto Kurye İstanbul</title>
        <meta
          name="description"
          content="Kurumsal moto kurye hizmetlerimiz: acil kurye, express kurye, VIP kurye ve araçlı kurye çözümleri."
        />
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
        </section>
      </main>
    </>
  );
}
