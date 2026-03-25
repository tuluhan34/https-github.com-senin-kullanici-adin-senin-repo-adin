import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Kaynaklar ve Embed Rozetleri",
  description:
    "34 Moto Kurye İstanbul icin kaynak baglantilari, embed kodlari, acik veri dosyalari ve editoryal atif materyalleri.",
  alternates: {
    canonical: `https://${SITE.domain}/kaynaklar`,
  },
};

const resourceLinks = [
  {
    title: "Basin Kiti",
    url: `https://${SITE.domain}/basin-kiti`,
    note: "Marka ozeti, atif metni ve medya iletisim bilgileri.",
  },
  {
    title: "Is Ortakligi",
    url: `https://${SITE.domain}/is-ortakligi`,
    note: "Ajanslar ve rehber platformlari icin ortaklik sayfasi.",
  },
  {
    title: "Istanbul Kurye Veri Dosyasi",
    url: `https://${SITE.domain}/data/istanbul-moto-kurye-verileri-2026.json`,
    note: "Yayinlarda kaynak gosterilebilir acik veri varligi.",
  },
  {
    title: "Outreach Tracker CSV",
    url: `https://${SITE.domain}/data/backlink-outreach-tracker-template.csv`,
    note: "Yayinci ulasim ve takip sureci icin hazir tablo.",
  },
  {
    title: "Prospect Scorecard CSV",
    url: `https://${SITE.domain}/data/backlink-prospect-scorecard-template.csv`,
    note: "Domain kalite puanlama ve onceliklendirme sablonu.",
  },
];

const darkBadgeCode = `<a href="https://${SITE.domain}/basin-kiti" target="_blank" rel="noopener noreferrer">
  <img src="https://${SITE.domain}/badges/34motokuryeistanbul-kaynak-dark.svg" width="320" height="96" alt="34 Moto Kurye İstanbul Resmi Kaynak" />
</a>`;

const lightBadgeCode = `<a href="https://${SITE.domain}/basin-kiti" target="_blank" rel="noopener noreferrer">
  <img src="https://${SITE.domain}/badges/34motokuryeistanbul-kaynak-light.svg" width="320" height="96" alt="34 Moto Kurye İstanbul Resmi Kaynak" />
</a>`;

const usageGuide = [
  "Kaynak secimi: Yazi konusu ile en ilgili hedef sayfayi secin.",
  "Baglanti konumu: Ilk 2 paragraf icinde bir ana baglanti kullanin.",
  "Ek kaynak: Veri odakli iceriklerde JSON dosyasini ikinci kaynak olarak ekleyin.",
  "Anchor dagilimi: Marka ve kismi eslesme metinlerini dengeleyin.",
  "Guncelleme: Eski baglantilari aylik kontrol ederek 404 riskini sifirlayin.",
];

const resourcesFaq = [
  {
    question: "Kaynaklar sayfasi neden ayri bir merkez olarak tasarlandi?",
    answer:
      "Yayinci ekipleri farkli sayfalarda link aramak yerine tek noktadan tum materyallere ulassin diye ayri bir merkez olusturuldu.",
  },
  {
    question: "Rozet kodu kullanmak zorunlu mu?",
    answer:
      "Zorunlu degil. Ancak rozet kullanimi kaynak atfini standartlastirir ve marka atfini daha anlasilir hale getirir.",
  },
  {
    question: "Hangi dosyalar daha cok link alir?",
    answer:
      "Genelde acik veri, rehber niteligindeki blog yazilari ve basit kullanima hazir embed varliklari daha hizli link kazanir.",
  },
];

export default function ResourcesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE.name} Kaynak Merkezi`,
    url: `https://${SITE.domain}/kaynaklar`,
    inLanguage: "tr-TR",
    about: {
      "@type": "Organization",
      name: SITE.name,
      url: `https://${SITE.domain}`,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="section-shell py-12">
        <article className="mx-auto max-w-5xl space-y-10">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-600">
              Link Verilebilir Kaynak Merkezi
            </p>
            <h1 className="font-display text-5xl uppercase tracking-wide text-zinc-900">
              34 Moto Kurye İstanbul Kaynaklar
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-zinc-700">
              Yayincilarin, rehber sitelerinin ve icerik ekiplerinin dogrudan baglayabilecegi resmi
              kaynaklar bu sayfada tek noktadan sunulur.
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Kaynak Linkleri</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700">
              {resourceLinks.map((item) => (
                <li key={item.url}>
                  <a className="font-semibold text-yellow-700 underline" href={item.url}>
                    {item.title}
                  </a>
                  <p className="mt-1 text-zinc-600">{item.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Kullanim Rehberi</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Bu bolum, icerik ekiplerinin kaynaklari daha verimli kullanmasi icin pratik bir
              kontrol listesidir. Rehberdeki adimlar uygulandiginda baglanti kalitesi ve yazi
              baglami birlikte iyilesir. Ozellikle birden fazla yazarin oldugu ekiplerde standard
              olusturmak, uzun vadede daha dengeli bir referring domain profili saglar.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {usageGuide.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-900">Dark Rozet</h2>
              <Image
                className="mt-4 rounded-xl border border-zinc-200"
                src="/badges/34motokuryeistanbul-kaynak-dark.svg"
                width={320}
                height={96}
                alt="34 Moto Kurye İstanbul Resmi Kaynak Rozeti"
              />
              <textarea
                className="mt-4 h-36 w-full rounded-xl border border-zinc-300 p-3 text-xs text-zinc-700"
                readOnly
                value={darkBadgeCode}
              />
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-900">Light Rozet</h2>
              <Image
                className="mt-4 rounded-xl border border-zinc-200"
                src="/badges/34motokuryeistanbul-kaynak-light.svg"
                width={320}
                height={96}
                alt="34 Moto Kurye İstanbul Resmi Kaynak Rozeti Light"
              />
              <textarea
                className="mt-4 h-36 w-full rounded-xl border border-zinc-300 p-3 text-xs text-zinc-700"
                readOnly
                value={lightBadgeCode}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Kaynak Merkezi SSS</h2>
            <div className="mt-4 space-y-4 text-sm text-zinc-700">
              {resourcesFaq.map((item) => (
                <div key={item.question} className="rounded-xl bg-zinc-50 p-4">
                  <p className="font-semibold text-zinc-900">{item.question}</p>
                  <p className="mt-2 leading-7">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
