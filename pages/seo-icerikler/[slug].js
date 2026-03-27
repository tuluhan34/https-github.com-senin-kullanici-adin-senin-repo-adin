import Head from "next/head";
import Link from "next/link";
import { getSeoPostBySlug, readSeoDailyStore } from "../../lib/seo-daily-store";

export default function SeoIcerikDetay({ post }) {
  if (!post) {
    return null;
  }

  const siteUrl = "https://www.34motokuryeistanbul.com";
  const canonicalUrl = `${siteUrl}/seo-icerikler/${post.slug}/`;
  const pageTitle = `${post.h1} | 34 Moto Kurye Istanbul`;
  const pageDescription = post.intro;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.h1,
    description: pageDescription,
    author: {
      "@type": "Organization",
      name: "34 Moto Kurye Istanbul",
    },
    publisher: {
      "@type": "Organization",
      name: "34 Moto Kurye Istanbul",
    },
    image: [
      post.imageUrl?.startsWith("http") ? post.imageUrl : `${siteUrl}${post.imageUrl}`,
    ],
    datePublished: post.createdAt || post.dateKey,
    dateModified: post.updatedAt || post.createdAt || post.dateKey,
    mainEntityOfPage: canonicalUrl,
    inLanguage: "tr-TR",
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.imageUrl?.startsWith("http") ? post.imageUrl : `${siteUrl}${post.imageUrl}`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={post.imageUrl?.startsWith("http") ? post.imageUrl : `${siteUrl}${post.imageUrl}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </Head>

      <main className="home-shell">
        <section className="container section-block">
          <article className="service-card service-detail-card">
            <p className="eyebrow">{post.type === "service" ? "Hizmet" : "Blog"} | {post.dateKey}</p>
            <h1>{post.h1}</h1>
            <img className="service-card-media service-detail-media" src={post.imageUrl} alt={`${post.location} kurye fotograflari`} loading="lazy" />
            <p>{post.intro}</p>

            {post.sectionTitles.map((title, index) => (
              <section key={title}>
                <h2>{title}</h2>
                {String(post.sectionBodies[index] || "")
                  .split("\n\n")
                  .map((paragraph, idx) => (
                    <p key={`${title}-${idx}`}>{paragraph}</p>
                  ))}
              </section>
            ))}

            {Array.isArray(post.serviceDetails) && post.serviceDetails.length > 0 ? (
              <section>
                <h2>Hizmet Aciklamalari</h2>
                <ul className="service-highlights">
                  {post.serviceDetails.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2>Hizmet Avantajlari</h2>
              <ul className="service-highlights">
                {post.advantages.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Sik Sorulan Sorular</h2>
              <div className="faq-grid">
                {post.faqs.map((faq) => (
                  <article className="faq-card" key={faq.question}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2>Hemen Kurye Cagir</h2>
              <p>{post.cta}</p>
              <div className="services-bottom-cta">
                <a className="btn btn-primary" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">
                  WhatsApp Destek
                </a>
                <a className="btn btn-whatsapp" href="tel:05303219004">
                  Arama Yap
                </a>
              </div>
            </section>

            <Link className="btn btn-whatsapp" href="/seo-icerikler">Bloga Don</Link>
          </article>
        </section>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const posts = readSeoDailyStore();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getSeoPostBySlug(params.slug);
  return {
    props: {
      post,
    },
  };
}
