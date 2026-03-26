import Head from "next/head";
import Link from "next/link";
import { getNeighborhoodBySlugs, neighborhoodPages } from "../../../lib/location-pages-data";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function NeighborhoodPage({ data }) {
  if (!data) {
    return null;
  }

  const locationLabel = `${data.neighborhood}, ${data.district}, Istanbul`;
  const courierPhotoUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(`istanbul courier delivery ${data.district} ${data.neighborhood}`)}`;
  const streetViewUrl = API_KEY
    ? `https://maps.googleapis.com/maps/api/streetview?size=1280x720&location=${encodeURIComponent(locationLabel)}&key=${API_KEY}`
    : "";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`;
  const faqs = data.faqs || [];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>{data.seoTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Lokal Kurye Hizmeti</p>
            <h1>{data.h1}</h1>
            <p className="lead">{data.shortDescription}</p>
          </div>

          <article className="service-card service-detail-card">
            {streetViewUrl ? (
              <img
                className="service-card-media"
                src={streetViewUrl}
                alt={`${data.neighborhood} mahallesi Google görüntüsü`}
                loading="lazy"
              />
            ) : null}
            <img
              className="service-card-media service-detail-media"
              src={courierPhotoUrl}
              alt={`${data.district} ${data.neighborhood} kurye hizmeti`}
              loading="lazy"
            />

            <h2>Kurye Hizmeti [Giris]</h2>
            <p>{data.intro}</p>

            <h2>Hizmet Aciklamasi</h2>
            <p>{data.serviceDetail}</p>

            <h2>Hizmet Turleri</h2>
            {data.serviceTypes.map((item) => (
              <section key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </section>
            ))}

            <h2>Kimler Icin Uygun</h2>
            <ul className="service-highlights">
              {data.suitableFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Neden Bizi Tercih Etmelisiniz</h2>
            <ul className="service-highlights">
              {data.whyUs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3>Sik Sorulan Sorular</h3>
            <div className="faq-grid">
              {faqs.map((item) => (
                <article className="faq-card" key={item.q}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </article>
              ))}
            </div>

            <h2>Hemen Kurye Cagir</h2>
            <p>{data.cta}</p>

            <div className="services-bottom-cta">
              <a className="btn btn-primary" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">
                WhatsApp Destek
              </a>
              <a className="btn btn-whatsapp" href="tel:05303219004">
                Arama Yap
              </a>
            </div>

            <Link href="/" className="btn btn-whatsapp">Ana Sayfaya Dön</Link>
          </article>
        </section>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: neighborhoodPages.map((item) => ({
      params: {
        district: item.districtSlug,
        neighborhood: item.neighborhoodSlug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = getNeighborhoodBySlugs(params.district, params.neighborhood);

  return {
    props: {
      data,
    },
  };
}
