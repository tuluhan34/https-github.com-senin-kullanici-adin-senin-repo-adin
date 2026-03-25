import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site-data";
import { faqHubEntries } from "@/lib/faq-pages";

export const metadata: Metadata = {
  title: "Sikca Sorulan Sorular Merkezi",
  description:
    "Istanbul kurye hizmetleri icin ilce ve hizmet tipine gore hazirlanmis SEO odakli sikca sorulan sorular sayfalarini tek merkezden inceleyin.",
  alternates: {
    canonical: `https://${SITE.domain}/sss`,
  },
};

export default function FaqHubPage() {
  const servicePages = faqHubEntries.filter((entry) => entry.kind === "service");
  const districtPages = faqHubEntries.filter((entry) => entry.kind === "district");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,248,229,0.75),rgba(255,255,255,1))] text-zinc-950">
      <main className="section-shell py-12 md:py-16">
        <header className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">SEO Bilgi Merkezi</p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-wide md:text-6xl">Sikca Sorulan Sorular</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-700">
            Organik aramalardan gelen kullanicilarin niyetine uygun cevaplar icin hizmet ve ilce bazli
            sayfalar hazirlandi. Bu merkezden ilgili SSS sayfasina gecerek karar surecini hizlandirabilirsiniz.
          </p>
        </header>

        <section className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-6 md:p-8">
          <h2 className="font-display text-4xl uppercase tracking-wide text-zinc-950">Hizmet Bazli SSS</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {servicePages.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={entry.path}
                  className="block rounded-2xl border border-zinc-200 bg-[linear-gradient(180deg,#fff,#fff9ec)] p-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:shadow-sm"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-6 md:p-8">
          <h2 className="font-display text-4xl uppercase tracking-wide text-zinc-950">Ilce Bazli SSS</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {districtPages.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={entry.path}
                  className="block rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:shadow-sm"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
