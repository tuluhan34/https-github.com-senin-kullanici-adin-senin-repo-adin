import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { SITE, defaultOrderMessage, whatsappLink } from "@/lib/site-data";
import { buildFaqItemsForEntry, faqHubEntries, faqHubEntryBySlug } from "@/lib/faq-pages";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return faqHubEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = faqHubEntryBySlug.get(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: entry.canonicalUrl,
    },
    openGraph: {
      title: `${entry.title} | ${SITE.name}`,
      description: entry.description,
      url: entry.canonicalUrl,
      type: "article",
    },
  };
}

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = faqHubEntryBySlug.get(slug);

  if (!entry) {
    notFound();
  }

  const faqs = buildFaqItemsForEntry(entry);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(24,24,27,0.04),rgba(255,255,255,1))] text-zinc-950">
      <main className="section-shell py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <Link href="/sss" className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            SSS Merkezine Don
          </Link>

          <h1 className="mt-3 font-display text-5xl uppercase tracking-wide text-zinc-950 md:text-6xl">
            {entry.title}
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-700">{entry.description}</p>

          <section className="mt-8 grid gap-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h2 className="text-base font-semibold text-zinc-900">{item.question}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-700">{item.answer}</p>
              </article>
            ))}
          </section>

          <section className="mt-10 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-white">
            <h2 className="font-display text-3xl uppercase tracking-wide">Saatlik Donen Ek SSS</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Bu bolum gun icindeki saat araligina gore degisen sorulari gosterir. Boylece farkli zamanlarda
              gelen kullanicilar, niyetine daha uygun cevaplari ilk bakista gorebilir.
            </p>
            <FaqSection />
          </section>

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-display text-3xl uppercase tracking-wide text-zinc-950">Hizli Iletisim</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-700">
              Adres detaylarini WhatsApp uzerinden paylasin, ekip gonderi tipine uygun modeli hemen planlasin.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={whatsappLink(defaultOrderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-yellow-300"
              >
                WhatsApp ile Siparis
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
              >
                Hemen Ara
              </a>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
