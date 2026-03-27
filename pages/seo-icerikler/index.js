import Head from "next/head";
import Link from "next/link";
import { readSeoDailyStore } from "../../lib/seo-daily-store";

export default function SeoIcerikListesi({ posts }) {
  const siteUrl = "https://www.34motokuryeistanbul.com";
  const canonicalUrl = `${siteUrl}/seo-icerikler/`;
  const title = "Gunluk Blog | 34 Moto Kurye Istanbul";
  const description = "Gunluk uretilen organik kurye icerikleri: Istanbul ilce ve mahalle bazli blog ve hizmet metin arsivi.";
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "34 Moto Kurye Istanbul Blog",
    url: canonicalUrl,
    inLanguage: "tr-TR",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Blog</p>
            <h1>Gunluk Uretilen Kurye Icerikleri</h1>
            <p className="lead">
              Bu sayfada otomatik uretilen ve kaydedilen kurye icerikleri listelenir. Icerikler spam
              yaklasimindan uzak, organik ve bolge odakli yapida hazirlanir.
            </p>
          </div>

          <div className="district-grid">
            {posts.map((post) => (
              <article key={post.slug} className="district-card">
                <p className="eyebrow">{post.type === "service" ? "Hizmet Sayfasi" : "Blog"}</p>
                <h3>{post.h1}</h3>
                <p>
                  {post.location} | Ana kelime: {post.mainKeyword}
                </p>
                <p>
                  Tarih: {post.dateKey} | Kelime sayisi: {post.wordCount}
                </p>
                <Link className="btn btn-whatsapp" href={`/seo-icerikler/${post.slug}`}>
                  Icerigi Ac
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const posts = readSeoDailyStore().slice(0, 200);
  return {
    props: {
      posts,
    },
  };
}
