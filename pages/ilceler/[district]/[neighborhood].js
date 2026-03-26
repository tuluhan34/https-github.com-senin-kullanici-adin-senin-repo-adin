import Head from "next/head";
import Link from "next/link";
import { getNeighborhoodBySlugs, neighborhoodPages } from "../../../lib/location-pages-data";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function NeighborhoodPage({ data }) {
  if (!data) {
    return null;
  }

  const locationLabel = `${data.neighborhood}, ${data.district}, Istanbul`;
  const streetViewUrl = API_KEY
    ? `https://maps.googleapis.com/maps/api/streetview?size=1280x720&location=${encodeURIComponent(locationLabel)}&key=${API_KEY}`
    : "";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`;

  return (
    <>
      <Head>
        <title>{`${data.neighborhood} Mahallesi Moto Kurye | ${data.district}`}</title>
        <meta
          name="description"
          content={`${data.district} ${data.neighborhood} mahallesinde moto kurye hizmeti, bölgesel teslimat planı ve profesyonel kurye operasyon detayları.`}
        />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Mahalle Hizmet Sayfası</p>
            <h1>{data.neighborhood} Mahallesi Moto Kurye</h1>
            <p className="lead">
              {data.district} ilçesine bağlı {data.neighborhood} mahallesinde evrak, paket ve kurumsal
              teslimatlar için profesyonel moto kurye organizasyonu sağlanır.
            </p>
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

            <h3>Bölgesel Operasyon Bilgisi</h3>
            <p>
              Bu sayfa, {data.district} / {data.neighborhood} bölgesi için rota planlama, teslimat hızı
              ve adres doğrulama süreçlerini net ve kurumsal biçimde sunar.
            </p>
            <p>{data.description || `${locationLabel} lokasyonu için kurye hizmet planı hazırlanır.`}</p>
            <p>{`Sokak: ${data.street || "Belirtilecektir"}  No: ${data.number || "-"}`}</p>

            <div className="services-bottom-cta">
              <a className="btn btn-primary" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">
                WhatsApp Destek
              </a>
              <a className="btn btn-whatsapp" href="tel:05303219004">
                Arama Yap
              </a>
            </div>

            <a className="btn btn-whatsapp" href={mapLink} target="_blank" rel="noreferrer">
              Google Maps'te Konuma Git
            </a>
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
