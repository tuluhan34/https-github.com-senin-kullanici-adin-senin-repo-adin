import Head from "next/head";
import Link from "next/link";
import { getNeighborhoodBySlugs, neighborhoodPages } from "../../../lib/location-pages-data";

const COURIER_FALLBACK_IMAGE = "/images/courier-fallback.jpg";
const MAP_FALLBACK_IMAGE = "/images/neighborhood-map-fallback.jpg";

export default function NeighborhoodPage({ data }) {
  if (!data) {
    return null;
  }

  const siteUrl = "https://www.34motokuryeistanbul.com";
  const canonicalUrl = `${siteUrl}/ilceler/${data.districtSlug}/${data.neighborhoodSlug}/`;
  const locationLabel = `${data.neighborhood}, ${data.district}, Istanbul`;
  const courierPhotoUrl = COURIER_FALLBACK_IMAGE;
  const streetViewUrl = MAP_FALLBACK_IMAGE;
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
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.h1,
    serviceType: "Moto Kurye",
    areaServed: locationLabel,
    provider: {
      "@type": "LocalBusiness",
      name: "34 Moto Kurye Istanbul",
      telephone: "+90 530 321 90 04",
      url: siteUrl,
    },
    url: canonicalUrl,
    description: data.metaDescription,
  };

  return (
    <>
      <Head>
        <title>{data.seoTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <meta property="og:title" content={data.seoTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${siteUrl}${courierPhotoUrl}`} />
        <meta name="twitter:title" content={data.seoTitle} />
        <meta name="twitter:description" content={data.metaDescription} />
        <meta name="twitter:image" content={`${siteUrl}${courierPhotoUrl}`} />
        <meta name="keywords" content={`${data.district}, ${data.neighborhood}, moto kurye, acil kurye, istanbul kurye`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Lokal Kurye Hizmeti</p>
            <h1>{data.h1}</h1>
            <p className="lead">{data.shortDescription}</p>
          </div>

          <article className="service-card service-detail-card">
            <img
              className="service-card-media"
              src={streetViewUrl}
              alt={`${data.neighborhood} mahallesi harita görseli`}
              loading="lazy"
            />
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
