import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedBlogPost, listBlogPosts } from "@/lib/blog/service";
import { formatBlogDate } from "@/lib/blog/utils";
import { defaultOrderMessage, SITE, services, whatsappLink } from "@/lib/site-data";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const { posts } = await listBlogPosts(1, 1000);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Yazisi Bulunamadi",
      description: "Aradiginiz blog yazisi bulunamadi.",
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://${SITE.domain}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://${SITE.domain}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const [post, recentResult] = await Promise.all([
    getPublishedBlogPost(slug),
    listBlogPosts(1, 6),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = recentResult.posts.filter((p) => p.slug !== slug).slice(0, 4);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateCreated: post.createdAt,
    dateModified: post.publishedAt,
    description: post.metaDescription,
    mainEntityOfPage: `https://${SITE.domain}/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(24,24,27,0.03),rgba(255,255,255,1))] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="section-shell flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/blog" className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Bloga Don
            </Link>
            <h1 className="mt-2 max-w-4xl font-display text-5xl uppercase leading-[0.94] tracking-wide text-zinc-950 md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-zinc-500">{formatBlogDate(post.publishedAt)}</p>
          </div>
          <div className="flex gap-3 text-sm font-semibold">
            <a
              href={whatsappLink(defaultOrderMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-zinc-950 transition hover:bg-yellow-300"
            >
              WhatsApp
            </a>
            <a
              href={SITE.phoneHref}
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-zinc-800 transition hover:border-zinc-950 hover:text-zinc-950"
            >
              Ara
            </a>
          </div>
        </div>
      </header>

      <main className="section-shell py-12 md:py-16">
        <article className="mx-auto max-w-4xl rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_70px_rgba(24,24,27,0.06)] md:p-10">
          <div
            className="[&_a]:font-semibold [&_a]:text-yellow-700 [&_a]:underline-offset-4 hover:[&_a]:text-zinc-950 [&_a:hover]:underline [&_figcaption]:mt-2 [&_figcaption]:text-xs [&_figcaption]:text-zinc-500 [&_figure]:mt-6 [&_figure]:overflow-hidden [&_figure]:rounded-2xl [&_figure]:border [&_figure]:border-zinc-200 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:uppercase [&_h2]:tracking-wide [&_img]:h-auto [&_img]:w-full [&_li]:ml-5 [&_li]:list-disc [&_li]:text-sm [&_li]:leading-7 [&_p]:mt-5 [&_p]:text-[15px] [&_p]:leading-8 [&_ul]:mt-5 [&_.blog-cta]:mt-10 [&_.blog-cta]:rounded-[1.5rem] [&_.blog-cta]:bg-zinc-950 [&_.blog-cta]:p-6 [&_.blog-cta]:text-white [&_.blog-cta_h2]:mt-0 [&_.blog-cta_h2]:text-3xl [&_.blog-cta_a]:text-yellow-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {relatedPosts.length > 0 && (
          <section className="mx-auto mt-10 max-w-4xl">
            <h2 className="font-display text-3xl uppercase tracking-wide text-zinc-950">Son Yazılar</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block rounded-2xl border border-zinc-200 bg-white p-5 text-sm font-semibold text-zinc-800 transition hover:border-yellow-400 hover:shadow-md"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-auto mt-8 max-w-4xl">
          <h2 className="sr-only">Hizmetlerimiz</h2>
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/hizmetler/${s.slug}`}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 transition hover:border-yellow-400 hover:text-zinc-950"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            <li><Link href="/hizmetler" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 transition hover:border-yellow-400 hover:text-zinc-950">Tüm Hizmetler</Link></li>
            <li><Link href="/blog" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 transition hover:border-yellow-400 hover:text-zinc-950">Tüm Yazılar</Link></li>
          </ul>
        </section>
      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
    </div>
  );
}