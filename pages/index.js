import Head from "next/head";
import Link from "next/link";
import { districts } from "../lib/district-data";

export default function Home() {
  return (
    <>
      <Head>
        <title>Istanbul Moto Kurye | 39 Ilce Hizmeti</title>
        <meta
          name="description"
          content="Istanbul genelinde 39 ilcede hizli, guvenli ve profesyonel moto kurye hizmeti. Ayni gun teslimat, evrak tasima ve kurumsal dagitim cozumleri."
        />
      </Head>
      <main className="container home">
        <section className="hero">
          <p className="eyebrow">7/24 Hizmet</p>
          <h1>Istanbul Moto Kurye Hizmeti</h1>
          <p>
            Istanbul'un tum ilcelerinde ayni gun teslimat, acil evrak transferi ve
            kurumsal dagitim operasyonlari sunuyoruz. Asagidaki ilce sayfalarindan
            ihtiyaciniza uygun detayli bilgilere ulasabilirsiniz.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="tel:05303219004">Hemen Ara: 0530 321 90 04</a>
            <a className="btn btn-whatsapp" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">WhatsApp Yaz</a>
          </div>
        </section>

        <section>
          <h2>Ilce Sayfalari</h2>
          <div className="district-grid">
            {districts.map((district) => (
              <Link key={district.slug} href={`/${district.slug}/`} className="district-card">
                <h3>{district.name} Moto Kurye</h3>
                <p>{district.shortText}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
