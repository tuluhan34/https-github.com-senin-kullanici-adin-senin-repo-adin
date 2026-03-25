import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { HomepageLiveSignals } from "@/components/homepage-live-signals";
import { HomepageTrustRotator } from "@/components/homepage-trust-rotator";
import { PwaInstallButton } from "@/components/pwa-install";
import { SiteFooter } from "@/components/site-footer";
import {
  commonDeliveredItems,
  commonSearchIntents,
  SITE,
  defaultOrderMessage,
  districts,
  faqItems,
  googleBusinessEmbeds,
  googleBusinessMapUrl,
  googleBusinessProfileUrl,
  googleBusinessSnapshot,
  services,
  whatsappLink,
} from "@/lib/site-data";

const QuickOrderBox = dynamic(
  () => import("@/components/quick-order-box").then((module) => module.QuickOrderBox),
  {
    loading: () => (
      <section
        id="hizli-fiyat"
        className="rounded-3xl border border-zinc-800 bg-zinc-950/95 p-5 shadow-2xl shadow-yellow-400/10 md:p-7"
        aria-label="Hızlı sipariş kutusu"
      >
        <h2 className="font-display text-3xl uppercase tracking-wide text-white">
          1 Dakikada Fiyat Al
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          Hızlı fiyat formu yükleniyor. Bu sırada WhatsApp veya telefon ile doğrudan
          kurye talebi oluşturabilirsiniz.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappLink(defaultOrderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-yellow-300"
          >
            WhatsApp ile Sipariş
          </a>
          <a
            href={SITE.phoneHref}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-300"
          >
            Hemen Ara
          </a>
        </div>
      </section>
    ),
  },
);

const FaqSection = dynamic(
  () => import("@/components/faq-section").then((module) => module.FaqSection),
  {
    loading: () => <div className="mt-6 h-32 rounded-2xl border border-zinc-200 bg-white" />,
  },
);

const GoogleMap = dynamic(
  () => import("@/components/google-map").then((module) => module.GoogleMap),
  {
    loading: () => (
      <div className="h-[400px] w-full animate-pulse rounded-b-2xl bg-zinc-100" />
    ),
  },
);

export const metadata: Metadata = {
  title: "İstanbul Moto Kurye | Acil Kurye, VIP Kurye, 7/24 Teslimat",
  description:
    "İstanbul moto kurye, acil kurye, VIP kurye ve araçlı kurye hizmetinde 30-60 dakikada teslimat, 7/24 hızlı fiyat ve anında kurye yönlendirmesi sunuyoruz.",
  keywords: [
    "istanbul moto kurye",
    "acil kurye istanbul",
    "kurye fiyatlari",
    "istanbul kurye",
    "ekspres kurye",
    "vip kurye",
    "gece kurye",
    "aracli kurye",
    "ayni gun teslimat",
    "hizli kurye",
  ],
  alternates: {
    canonical: `https://${SITE.domain}`,
  },
  openGraph: {
    title: `İstanbul Moto Kurye | Acil Kurye ve 7/24 Teslimat | ${SITE.name}`,
    description:
      "İstanbul genelinde moto kurye, acil kurye, VIP kurye ve aynı gün teslimat hizmeti. WhatsApp ile hızlı fiyat teklifi alın.",
    url: `https://${SITE.domain}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `İstanbul Moto Kurye ve Acil Kurye | ${SITE.name}`,
    description: "7/24 İstanbul kurye hizmeti, hızlı fiyat teklifi ve aynı gün teslimat.",
  },
};

export default function Home() {
  const serviceIconMap: Record<string, string> = {
    "moto-kurye": "/icons/moto-kurye.svg",
    "vip-kurye": "/icons/yildiz.svg",
    "acil-kurye": "/icons/saat.svg",
    "gece-kurye": "/icons/harita.svg",
    "aracli-kurye": "/icons/paket.svg",
    "ekspres-kurye": "/icons/hiz.svg",
    "vale-ozel-sofor": "/icons/telefon.svg",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: `https://${SITE.domain}`,
      },
    ],
  };

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE.name} Ana Sayfa`,
    url: `https://${SITE.domain}`,
    description: metadata.description,
    inLanguage: "tr-TR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: `https://${SITE.domain}`,
    },
    primaryImageOfPage: `https://${SITE.domain}/opengraph-image`,
  };

  const servicesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} Hizmet Listesi`,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://${SITE.domain}/hizmetler/${service.slug}`,
      name: service.title,
      description: service.shortDescription,
    })),
  };

  const districtsListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} Ilce Hizmet Alanlari`,
    itemListElement: districts.map((district, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://${SITE.domain}/${district.slug}`,
      name: `${district.name} Moto Kurye`,
      areaServed: district.name,
    })),
  };

  const deliveredItemsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} Sık Talep Edilen İşler`,
    itemListElement: commonDeliveredItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
    })),
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-zinc-700 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur">
        <div className="section-shell py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="font-display text-4xl uppercase tracking-wide text-white">
                34 Moto Kurye
                <br className="hidden md:block" />
                İstanbul
              </Link>
              <div className="hidden h-8 w-px bg-yellow-400/40 sm:block" />
              <p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-300 sm:block">
                Kurumsal ve Kesintisiz Operasyon
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <Link
                href="/hizmetler"
                className="hidden text-sm font-semibold text-zinc-300 transition hover:text-yellow-300 md:inline-block"
              >
                Hizmetler
              </Link>
              <Link
                href="/galeri"
                className="hidden text-sm font-semibold text-zinc-300 transition hover:text-yellow-300 md:inline-block"
              >
                Galeri
              </Link>
              <Link
                href="/blog"
                className="hidden text-sm font-semibold text-zinc-300 transition hover:text-yellow-300 md:inline-block"
              >
                Blog
              </Link>
              <PwaInstallButton label="Uygulamayi Indir" />
              <div className="hidden h-6 w-px bg-zinc-700 md:block" />
              <a
                href={SITE.phoneHref}
                className="inline-flex h-11 items-center rounded-full border border-zinc-600 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300"
              >
                {SITE.phoneDisplay}
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex h-11 items-center rounded-full bg-zinc-700/60 px-5 text-sm font-bold text-white transition hover:bg-zinc-600"
              >
                Hemen Ara
              </a>
              <a
                href={whatsappLink(defaultOrderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-full bg-yellow-400 px-5 text-sm font-bold text-zinc-950 shadow-lg shadow-yellow-500/40 transition hover:bg-yellow-300"
              >
                WhatsApp ile Sipariş
              </a>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 md:hidden">
            <Link
              href="/hizmetler"
              className="inline-flex h-9 items-center rounded-full border border-zinc-700 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-300"
            >
              Hizmetler
            </Link>
            <Link
              href="/galeri"
              className="inline-flex h-9 items-center rounded-full border border-zinc-700 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-300"
            >
              Galeri
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-9 items-center rounded-full border border-zinc-700 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-300"
            >
              Blog
            </Link>
            <PwaInstallButton
              label="Uygulamayi Indir"
              className="inline-flex h-9 items-center rounded-full border border-zinc-700 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-300"
              compact
            />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-950 text-white">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "linear-gradient(110deg, rgba(250,204,21,0.16), transparent 45%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="section-shell relative py-12 md:py-20">
            <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:gap-10">
              <div className="min-w-0">
                <QuickOrderBox />
              </div>

              <div className="min-w-0 xl:pt-4">
                <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-200">
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1">
                    Faturalı Kurumsal Hizmet
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1">
                    39 İlçede Aktif Saha
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1">
                    7/24 Operasyon Merkezi
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1">
                    Uzun Suredir Sahada Calisan Ekip
                  </span>
                </div>

                <p className="inline-flex rounded-full border border-yellow-300/40 bg-yellow-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-200">
                  7/24 İstanbul Operasyon
                </p>
                <h1 className="mt-4 font-display text-5xl uppercase leading-[0.92] tracking-wide sm:text-6xl md:text-7xl">
                  İstanbul&apos;un En Hızlı Moto Kurye Hizmeti
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-200 md:text-lg">
                  30-60 dakika içinde teslimat – 7/24 hizmet. Evraktan pakete,
                  kritik gönderileriniz için güven veren kurumsal kurye altyapısı.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={whatsappLink(defaultOrderMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-yellow-400 px-6 text-sm font-bold text-zinc-950 transition hover:bg-yellow-300 sm:w-auto"
                  >
                    WhatsApp ile Sipariş
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-yellow-400 bg-yellow-400 px-6 text-sm font-bold text-zinc-950 shadow-lg shadow-yellow-500/30 transition hover:bg-yellow-300 sm:w-auto"
                  >
                    Hemen Ara
                  </a>
                </div>

                <div className="mt-6 grid max-w-4xl gap-2 text-sm text-zinc-100 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2">
                    ✔ 7/24 Hizmet
                  </div>
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2">
                    ✔ Hızlı Teslimat
                  </div>
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2">
                    ✔ Yakındaki Kurye
                  </div>
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2">
                    ✔ Evrak ve Paket Teslimat
                  </div>
                </div>

                <div className="mt-6 max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
                    Öne Çıkan Hizmetler
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-200">
                    {[
                      "İstanbul Moto Kurye",
                      "Acil Kurye İstanbul",
                      "Ekspres Kurye",
                      "VIP Kurye Hizmeti",
                      "Gece Kurye 7/24",
                      "Araçlı Kurye İstanbul",
                      "Kurye Fiyat Teklifi",
                      "Aynı Gün Teslimat",
                      "Hızlı Evrak Teslimatı",
                      "Evrak ve Paket Teslimat",
                    ].map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell deferred-section py-14">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-display text-5xl uppercase tracking-wide text-zinc-950">
              En Cok Aranan Kurye Konulari
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-700 md:text-base">
              Kullanicilar en cok hiz, fiyat ve bolge bazli kurye sorgularinda arama yapiyor.
              Bu nedenle iceriklerimizde &quot;Istanbul moto kurye&quot;, &quot;acil kurye Istanbul&quot;, &quot;kurye
              fiyatlari&quot; ve &quot;ayni gun teslimat&quot; gibi yuksek niyetli sorgulari net hizmet
              sayfalarina bagliyoruz. Hizmet secimi icin once{" "}
              <Link className="font-semibold text-zinc-900 underline" href="/hizmetler">
                hizmetler sayfasina
              </Link>{" "}
              gidip model karsilastirmasi yapabilir, bolgesel teslimat ihtiyaclari icin ilce
              bazli iceriklerimize gecebilirsiniz.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Istanbul Moto Kurye", "/hizmetler/moto-kurye"],
                ["Acil Kurye Istanbul", "/hizmetler/acil-kurye"],
                ["Ekspres Kurye", "/hizmetler/ekspres-kurye"],
                ["Kurye Fiyatlari", "/hizmetler"],
                ["Gece Kurye", "/hizmetler/gece-kurye"],
                ["VIP Kurye", "/hizmetler/vip-kurye"],
                ["Aracli Kurye", "/hizmetler/aracli-kurye"],
                ["Istanbul Kurye", "/hizmetler"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  39 Ilce Hizmet Alani
                </p>
                <h2 className="mt-2 font-display text-5xl uppercase tracking-wide text-zinc-950">
                  Ilce Bazli Kurye Sayfalari
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-600 md:text-base">
                  Istanbul&apos;un 39 ilcesi icin hazirlanan tekil sayfalardan bolgenizi secin.
                  Her ilce sayfasi ilgili mahalle sayfalarina baglanir; boylece hem kullanici hem
                  arama motorlari hizmet alanini daha net gorur.
                </p>
              </div>
            </div>

            <ul className="mt-6 flex flex-wrap gap-3">
              {districts.map((district) => (
                <li key={district.slug}>
                  <Link
                    href={`/${district.slug}`}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-yellow-400 hover:bg-white hover:text-zinc-950"
                  >
                    {district.name} Moto Kurye
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section-shell deferred-section py-14">
          <div className="rounded-[2rem] border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_80px_rgba(24,24,27,0.08)] backdrop-blur md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Operasyona Uygun Modeller
                </p>
                <h2 className="mt-2 font-display text-5xl uppercase tracking-wide text-zinc-950">
                  Hizmetlerimiz
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-600 md:text-base">
                  Tek adrese ekspres çıkıştan çoklu paket dağıtımına kadar farklı hız ve
                  operasyon ihtiyacına göre kurgulanmış kurye modellerimizi inceleyin.
                </p>
              </div>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950 hover:text-zinc-950"
                href="/hizmetler"
              >
                Tüm Hizmetleri Gör
              </Link>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <article className="relative overflow-hidden rounded-[1.75rem] bg-zinc-950 p-6 text-white shadow-[0_24px_60px_rgba(24,24,27,0.25)] md:p-8">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 opacity-30">
                  <Image src="/icons/moto-kurye.svg" alt="Moto kurye" fill className="object-contain" />
                </div>
                <div className="relative">
                  <p className="inline-flex rounded-full border border-yellow-300/40 bg-yellow-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
                    Öne Çıkan Hizmet
                  </p>
                  <h3 className="mt-4 font-display text-6xl uppercase leading-[0.92] tracking-wide">
                    {services[0].title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 md:text-base">
                    {services[0].longDescription}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-200">
                    {services[0].bullets.map((bullet) => (
                      <span
                        key={bullet}
                        className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1"
                      >
                        {bullet}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href={`/hizmetler/${services[0].slug}`}
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 text-sm font-bold text-zinc-950 transition hover:bg-yellow-300"
                    >
                      Detayları İncele
                    </Link>
                    <span className="text-sm font-semibold text-zinc-300">
                      Hedef teslimat: {services[0].deliveryTime}
                    </span>
                  </div>
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                {services.slice(1).map((service) => (
                  <article
                    key={service.slug}
                    className="group rounded-[1.5rem] border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_16px_40px_rgba(24,24,27,0.10)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 shrink-0 rounded-lg bg-zinc-100 p-1.5">
                          <Image
                            src={serviceIconMap[service.slug] || "/icons/paket.svg"}
                            alt={service.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <h3 className="font-display text-3xl uppercase tracking-wide text-zinc-950">
                          {service.title}
                        </h3>
                      </div>
                      <span className="rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-300">
                        {service.deliveryTime}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {service.shortDescription}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-zinc-500">
                      {service.bullets.slice(0, 2).map((bullet) => (
                        <span key={bullet} className="rounded-full border border-zinc-200 px-2 py-1">
                          {bullet}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/hizmetler/${service.slug}`}
                      className="mt-5 inline-flex text-sm font-semibold text-zinc-950 transition group-hover:text-zinc-700"
                    >
                      Detay Sayfası {"->"}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-white md:p-8">
            <h2 className="font-display text-5xl uppercase tracking-wide">Neden 34 Moto Kurye İstanbul</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Hızlı Teslimat", "İstanbul genelinde 30-60 dakika odaklı operasyon"],
                ["Profesyonel Ekip", "Bölgeleri bilen deneyimli saha kuryeleri"],
                ["Uygun Fiyat", "İhtiyaca göre net ve şeffaf fiyatlandırma"],
                ["İstanbul Geneli", "39 ilçenin tamamına aktif servis"],
              ].map(([title, desc]) => (
                <article key={title} className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
                  <h3 className="text-lg font-semibold text-yellow-300">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <HomepageLiveSignals />
        </section>

        <section className="section-shell deferred-section pb-14">
          <HomepageTrustRotator />
        </section>

        <section className="section-shell deferred-section pb-14">
          <div className="grid gap-6">
            <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Sektorde Aranan Isler
              </p>
              <h2 className="mt-2 font-display text-5xl uppercase tracking-wide text-zinc-950">
                En Sık Talep Edilen Gonderi Turleri
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
                Kullanici arama niyeti ile gercek teslimat ihtiyaci ayni dilde bulustugunda site daha
                guclu bir kaynak haline gelir. Bu nedenle aranan hizmetleri dogrudan teslim edilen
                is tipleriyle eslestiren net bir kurgu kullaniyoruz.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {commonDeliveredItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm font-semibold text-zinc-900">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Kullanici Arama Niyetleri
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {commonSearchIntents.map((item) => (
                    <span key={item} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <h2 className="font-display text-5xl uppercase tracking-wide">Nasıl Çalışır</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "1. WhatsApp'tan yaz, bilgileri doldur veya ver",
              "2. Kurye yönlendirelim",
              "3. Teslimatınızı tamamlayalım",
            ].map((step) => (
              <div key={step} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-lg font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-5xl uppercase tracking-wide">Google Yorum ve Puan</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600">
                Site uzerinde sahte yorum kartlari yerine dogrudan yorum birakma ve profil gorme
                aksiyonlarini tutuyoruz. Ayrintili isletme baglantilari arka planda schema ve
                kurumsal baglanti mantiginda calismaya devam eder.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={googleBusinessProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Google Isletmemi Ac
              </a>
              <a
                href={SITE.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950 hover:text-zinc-950"
              >
                Google&apos;da Yorum Yap
              </a>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Yerel Isletme Sinyali
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-6">
                <div>
                  <p className="font-display text-6xl uppercase tracking-wide text-zinc-950">
                    {googleBusinessSnapshot.ratingValue}/{googleBusinessSnapshot.bestRating}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">Google Isletme ortalama puani</p>
                </div>
                <div>
                  <p className="font-display text-5xl uppercase tracking-wide text-zinc-950">
                    {googleBusinessSnapshot.reviewCount}+
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">Google degerlendirme sinyali</p>
                </div>
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-600">
                Gercek yorum ve puan verisini merkeze almak, sahte yorum kartlarina gore daha guvenli
                ve daha profesyonel bir sunum saglar. Kullanici isterse dogrudan Google profilinden
                degerlendirme akisini inceleyebilir.
              </p>
            </article>

            <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-950">Neden Daha Guvenli?</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-600">
                <li>Google Isletme puani ve yorum sayisi kullaniciya dogrudan resmi profil sinyali verir.</li>
                <li>Gercek fotograflar ve ilce mahalle sayfalari aktif bir isletme algisini guclendirir.</li>
                <li>Yorum birakma ve profil inceleme baglantilari, yapay sosyal kanit yerine dogrulanabilir kaynak sunar.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-display text-5xl uppercase tracking-wide">Harita onizlemesi ve Google baglantilari</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  Gorunmeme ve iframe hatasi riskini azaltmak icin bu alani dogrudan tiklanabilir Google
                  baglanti kartlari olarak tutuyoruz. Harita ve profil akislarini yeni sekmede acabilirsiniz.
                </p>
              </div>
              <a
                href={googleBusinessProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Google Isletmemi Ac
              </a>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              {googleBusinessEmbeds.map((embed, index) => {
                const actionHref =
                  index === 0
                    ? googleBusinessProfileUrl
                    : index === 1
                      ? googleBusinessMapUrl
                      : SITE.googleReviewUrl;
                const actionLabel =
                  index === 0
                    ? "Google isletme profilini ac"
                    : index === 1
                      ? "Google Haritalarda konumu ac"
                      : "Google yorum akisina git";

                return (
                  <article
                    key={embed.src}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Google erisim karti
                    </p>
                    <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-zinc-950">
                      {embed.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">{embed.description}</p>
                    <a
                      href={actionHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex text-sm font-semibold text-zinc-950 underline decoration-yellow-500 underline-offset-4 hover:text-zinc-700"
                    >
                      {actionLabel}
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <h2 className="font-display text-5xl uppercase tracking-wide">Sıkça Sorulan Sorular</h2>
          <p className="mt-2 text-sm text-zinc-500">Gün içinde farklı saatlerde en çok sorulan sorular gösteriliyor.</p>
          <FaqSection />
        </section>

        <section className="section-shell deferred-section pb-14">
          <h2 className="font-display text-5xl uppercase tracking-wide">İstanbul Operasyon Noktası</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-300 bg-white">
            <GoogleMap
              query="Istanbul, Turkey"
              zoom={11}
              className="h-[400px] w-full"
              title="İstanbul operasyon haritası"
            />
          </div>
        </section>

        <section className="section-shell deferred-section pb-14">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
            <h2 className="font-display text-5xl uppercase tracking-wide">İlçe Sayfaları</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
              Her ilçe için özel hazırlanan SEO uyumlu moto kurye içeriklerini
              inceleyin. WhatsApp ve telefonla tek tıkla sipariş verebilirsiniz.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {districts.slice(0, 20).map((district) => (
                <Link
                  key={district.slug}
                  href={`/${district.slug}`}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium transition hover:border-zinc-950"
                >
                  {district.name} Moto Kurye
                </Link>
              ))}
            </div>
            {districts.length > 20 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-zinc-500 hover:text-zinc-900">
                  Tüm ilçeleri göster ({districts.length - 20} ilçe daha)
                </summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {districts.slice(20).map((district) => (
                    <Link
                      key={district.slug}
                      href={`/${district.slug}`}
                      className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium transition hover:border-zinc-950"
                    >
                      {district.name} Moto Kurye
                    </Link>
                  ))}
                </div>
              </details>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(districtsListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deliveredItemsSchema) }}
      />
    </div>
  );
}
