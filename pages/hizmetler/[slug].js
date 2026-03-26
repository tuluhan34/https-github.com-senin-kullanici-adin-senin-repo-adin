import Head from "next/head";
import Link from "next/link";
import { servicesCatalog } from "../../lib/services-catalog";

export default function ServiceDetailPage({ service }) {
  if (!service) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{service.title} | 34 Moto Kurye İstanbul</title>
        <meta name="description" content={service.longDescription} />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Kurumsal Hizmet Detayı</p>
            <h1>{service.title}</h1>
            <p className="lead">{service.longDescription}</p>
          </div>

          <article className="service-card">
            <img className="service-card-media" src={service.image} alt={service.imageAlt} loading="lazy" />
            <h3>Hizmet Özeti</h3>
            <p>{service.desc}</p>
            <p>
              Bu hizmet, İstanbul içi kurumsal operasyonlarda zaman yönetimi ve teslim güvenliği
              odaklı planlanır. Talep türüne göre ekip, rota ve araç profili dinamik olarak belirlenir.
            </p>
            <Link href="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
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
