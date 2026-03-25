import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { listBlogPosts } from "@/lib/blog/service";
import { excerptFromHtml, formatBlogDate } from "@/lib/blog/utils";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "İstanbul Kurye Blogu | Fiyatlar, Süreler ve Teslimat Rehberi",
  description:
    "İstanbul moto kurye, acil kurye, kurye fiyatları, aynı gün teslimat ve operasyon ipuçları için hazırlanan detaylı blog yazılarını hemen şimdi inceleyin.",
  keywords: [
    "istanbul moto kurye blog",
    "kurye fiyatlari",
    "acil kurye rehberi",
    "ayni gun teslimat",
    "istanbul kurye",
  ],
  alternates: {
    canonical: `https://${SITE.domain}/blog`,
  },
  openGraph: {
    title: `İstanbul Kurye Blogu | ${SITE.name}`,
    description:
      "Istanbul genelinde moto kurye operasyonu, acil teslimat ve hizmet secimi icin hazirlanan blog yazilarimizi inceleyin.",
    url: `https://${SITE.domain}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `İstanbul Kurye Blogu | ${SITE.name}`,
    description: "Kurye fiyatları, teslimat süreleri ve operasyon rehberleri.",
  },
};

export default async function BlogPage() {
  const { posts, totalPosts } = await listBlogPosts(1, 1000);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `https://${SITE.domain}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `https://${SITE.domain}/blog` },
    ],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.name} Blog`,
    url: `https://${SITE.domain}/blog`,
    description: "İstanbul kurye operasyonu, kurye fiyatları ve aynı gün teslimat hakkında hazırlanan blog içerikleri.",
    inLanguage: "tr-TR",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: `https://${SITE.domain}`,
    },
  };

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} Blog Yazıları`,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://${SITE.domain}/blog/${post.slug}`,
      name: post.title,
      description: excerptFromHtml(post.content, 160),
    })),
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,248,229,0.7),rgba(255,255,255,1))] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white/85 backdrop-blur">
        <div className="section-shell flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="font-display text-4xl uppercase tracking-wide text-zinc-950">
              34 Moto Kurye İstanbul Blog
            </Link>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
              Istanbul moto kurye operasyonu, acil teslimat planlamasi ve hizmet secimi konusunda duzenli olarak yayinlanan bilgi yazilari.
            </p>
          </div>
          <div className="flex gap-3 text-sm font-semibold">
            <Link href="/" className="rounded-full border border-zinc-300 px-5 py-3 transition hover:border-zinc-950 hover:text-zinc-950">
              Ana Sayfa
            </Link>
            <Link href="/hizmetler" className="rounded-full border border-zinc-300 px-5 py-3 transition hover:border-zinc-950 hover:text-zinc-950">
              Hizmetler
            </Link>
          </div>
        </div>
      </header>

      <main className="section-shell py-12 md:py-16">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_70px_rgba(24,24,27,0.06)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">SEO Rehberi</p>
              <h1 className="mt-2 font-display text-5xl uppercase tracking-wide text-zinc-950 md:text-6xl">
                Blog Yazilari
              </h1>
            </div>
            <p className="text-sm text-zinc-500">Toplam {totalPosts} yayinlanmis yazi</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-[1.5rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff,#fff9ec)] p-6 transition hover:-translate-y-0.5 hover:border-zinc-950 hover:shadow-[0_20px_50px_rgba(24,24,27,0.10)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700">
                  {formatBlogDate(post.publishedAt)}
                </p>
                <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] tracking-wide text-zinc-950">
                  <Link href={`/blog/${post.slug}`} className="hover:text-yellow-700">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  {excerptFromHtml(post.content, 220)}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    SEO uyumlu icerik
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-yellow-500 hover:text-zinc-950"
                  >
                    Yaziyi Oku
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
    </div>
  );
}