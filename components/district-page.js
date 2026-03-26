import Head from "next/head";
import Link from "next/link";
import { getNeighborhoodsByDistrictName } from "../lib/location-pages-data";

export default function DistrictPage({ district }) {
  const title = `${district.name} Moto Kurye | Hizli ve Guvenli Teslimat`;
  const description = `${district.name} icinde acil moto kurye, ayni gun teslimat, evrak ve paket transferi. 05303219004 ile aninda kurye cagirabilirsiniz.`;
  const neighborhoods = getNeighborhoodsByDistrictName(district.name);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <main className="container district-page">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span>/</span>
          <span>{district.name} Moto Kurye</span>
        </nav>

        <header className="hero">
          <p className="eyebrow">{district.regionLabel}</p>
          <h1>{district.name} Moto Kurye</h1>
          <p>{district.intro}</p>
        </header>

        <section>
          <h2>{district.name} Icinde Hizli Kurye Operasyonu</h2>
          {district.longParagraphs.slice(0, 6).map((paragraph, idx) => (
            <p key={`h2-a-${idx}`}>{paragraph}</p>
          ))}
        </section>

        <section>
          <h2>Kurumsal ve Bireysel Teslimat Cozumleri</h2>
          {district.longParagraphs.slice(6, 12).map((paragraph, idx) => (
            <p key={`h2-b-${idx}`}>{paragraph}</p>
          ))}
        </section>

        <section>
          <h2>{district.name} Icin Teslimat Planlama Rehberi</h2>
          <h3>Trafik Yogunlugunda Dogru Saat Planlamasi</h3>
          <p>{district.longParagraphs[12]}</p>
          <h3>Evrak ve Hassas Gonderilerde Guvenlik Proseduru</h3>
          <p>{district.longParagraphs[13]}</p>
          <h3>Ayni Gun Teslimatta Maliyet ve Sure Dengesi</h3>
          <p>{district.longParagraphs[14]}</p>
          <h3>Surekli Gonderiler Icin Isbirligi Modeli</h3>
          <p>{district.longParagraphs[15]}</p>
          <h3>Takip, Raporlama ve Musteri Bilgilendirme</h3>
          <p>{district.longParagraphs[16]}</p>
          <h3>Son Kontrol ve Teslimat Dogrulamasi</h3>
          <p>{district.longParagraphs[17]}</p>
        </section>

        <section>
          <h2>Operasyonel Kalite ve Sureklilik</h2>
          {district.longParagraphs.slice(18).map((paragraph, idx) => (
            <p key={`h2-c-${idx}`}>{paragraph}</p>
          ))}
        </section>

        <section>
          {neighborhoods.length > 0 ? (
            <>
              <h2>{district.name} Mahalle Sayfalari</h2>
              <div className="district-grid">
                {neighborhoods.map((item) => (
                  <Link
                    key={`${item.districtSlug}-${item.neighborhoodSlug}`}
                    href={`/ilceler/${item.districtSlug}/${item.neighborhoodSlug}`}
                    className="district-card"
                  >
                    <h3>{item.neighborhood} Mahallesi</h3>
                    <p>{item.description || `${item.neighborhood} mahallesi kurye hizmet detayi`}</p>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </section>

        <section>
          <h2>Sik Sorulan Hizmet Basliklari</h2>
          <ul className="faq-list">
            {district.faqItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{district.outro}</p>
        </section>
      </main>

      <div className="floating-actions" aria-label="Iletisim">
        <a className="fab fab-call" href="tel:05303219004">Ara</a>
        <a className="fab fab-wa" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </>
  );
}
