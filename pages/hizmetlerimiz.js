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
