import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Basın Kiti ve Medya Kaynakları",
  description:
    "34 Moto Kurye İstanbul için medya bülteni, marka bilgileri, atıf metni ve kaynak linkleri.",
  alternates: {
    canonical: `https://${SITE.domain}/basin-kiti`,
  },
};

const pressFacts = [
  "İstanbul genelinde 7/24 operasyon",
  "Moto kurye, acil kurye, VIP ve araçlı kurye hizmetleri",
  "Kurumsal ve bireysel müşterilere aynı gün teslimat modelleri",
  "WhatsApp ve telefon üzerinden anlık sipariş akışı",
];

const suggestedAnchors = [
  "İstanbul moto kurye",
  "acil kurye İstanbul",
  "7/24 kurye hizmeti",
  "34 Moto Kurye İstanbul",
];

const editorialGuidelines = [
  "Marka adini ilk geciste tam haliyle verin: 34 Moto Kurye İstanbul.",
  "Hizmet bolgesini net yazin: Istanbul geneli, 39 ilce.",
  "Okur niyetine gore sayfa secin: genel bilgi icin ana sayfa, detay icin hizmetler.",
  "Ayni metinde tekrarli anahtar kelime yerine anlamsal cesitlilik kullanin.",
  "Mumkunse acik veri dosyasi veya basin kiti baglantisini ekleyin.",
];

const pressFaq = [
  {
    question: "Hangi sayfaya link verilmesi daha uygundur?",
    answer:
      "Yazi baglamina gore secim yapilmalidir. Genel tanitimlarda ana sayfa, hizmet karsilastirmalarinda hizmetler sayfasi, veri odakli yazilarda acik veri dosyasi daha dogrudur.",
  },
  {
    question: "Anchor metni nasil secilmeli?",
    answer:
      "Marka, kismi eslesme ve genel anchor birlikte kullanilmalidir. Tek bir anchor kalibina asiri yuklenmek yerine dogal dagilim tercih edilmelidir.",
  },
  {
    question: "Yayinci icin en kolay kaynak paketi nedir?",
    answer:
      "Basin kiti, kaynaklar merkezi ve embed rozetleri birlikte kullanildiginda yayinci tek ekranda tum materyale ulasir.",
  },
];

export default function PressKitPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${SITE.name} Basın Kiti`,
    url: `https://${SITE.domain}/basin-kiti`,
    inLanguage: "tr-TR",
    about: {
      "@type": "Organization",
      name: SITE.name,
      url: `https://${SITE.domain}`,
      telephone: SITE.phoneHref.replace("tel:", "+"),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="section-shell py-12">
        <article className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-600">
              Medya ve Backlink Kaynağı
            </p>
            <h1 className="font-display text-5xl uppercase tracking-wide text-zinc-900">
              34 Moto Kurye İstanbul Basın Kiti
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-zinc-700">
              Bu sayfa; haber siteleri, bloglar, sözlükler, iş rehberleri ve sektör yayınları
              için doğrulanmış marka bilgileri sunar. Kaynak göstermek isteyen yayınlar aşağıdaki
              bağlantıları ve atıf metnini doğrudan kullanabilir.
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Kısa Marka Özeti</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {pressFacts.map((fact) => (
                <li key={fact}>- {fact}</li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-900">Önerilen Kaynak Linkleri</h2>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>
                  Ana sayfa: <a className="text-yellow-700 underline" href={`https://${SITE.domain}`}>{`https://${SITE.domain}`}</a>
                </li>
                <li>
                  Hizmetler: <a className="text-yellow-700 underline" href={`https://${SITE.domain}/hizmetler`}>{`https://${SITE.domain}/hizmetler`}</a>
                </li>
                <li>
                  Blog: <a className="text-yellow-700 underline" href={`https://${SITE.domain}/blog`}>{`https://${SITE.domain}/blog`}</a>
                </li>
                <li>
                  Açık veri dosyası: <a className="text-yellow-700 underline" href={`https://${SITE.domain}/data/istanbul-moto-kurye-verileri-2026.json`}>{`https://${SITE.domain}/data/istanbul-moto-kurye-verileri-2026.json`}</a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-900">Önerilen Anchor Metinleri</h2>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                {suggestedAnchors.map((anchor) => (
                  <li key={anchor}>- {anchor}</li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-zinc-600">
                Operasyon ekibi için takip şablonları: {" "}
                <a
                  className="text-yellow-700 underline"
                  href={`https://${SITE.domain}/data/backlink-outreach-tracker-template.csv`}
                >
                  Outreach Tracker CSV
                </a>{" "}
                ve{" "}
                <a
                  className="text-yellow-700 underline"
                  href={`https://${SITE.domain}/data/backlink-prospect-scorecard-template.csv`}
                >
                  Prospect Scorecard CSV
                </a>
                .
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Hazır Atıf Metni</h2>
            <p className="mt-3 rounded-xl bg-zinc-100 p-4 text-sm leading-7 text-zinc-700">
              34 Moto Kurye İstanbul, İstanbul genelinde 7/24 moto kurye, acil kurye, VIP kurye ve araçlı kurye
              hizmeti sunan yerel bir lojistik markasıdır. Fiyat ve sipariş süreçleri için resmi web
              sitesi: <a className="text-yellow-700 underline" href={`https://${SITE.domain}`}>{SITE.domain}</a>
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-700">
              Embed rozetleri ve tum kaynak paketleri icin{" "}
              <a className="text-yellow-700 underline" href={`https://${SITE.domain}/kaynaklar`}>
                Kaynaklar sayfasini
              </a>{" "}
              kullanabilirsiniz.
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Editoryal Rehber</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Bu rehber, haber editörleri ve içerik ekipleri için kaynak kullanımı standardı sunar.
              Amaç; kısa vadeli anahtar kelime tekrarından ziyade uzun vadede güvenilir kaynak
              gösterimi ve okur için net bilgi akışıdır. Yayınlar içerik akışına uygun bağlantı
              verdiğinde hem kullanıcı deneyimi hem de arama görünürlüğü birlikte güçlenir.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {editorialGuidelines.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-7 text-zinc-700">
              Kurumsal yayınlarda önerilen yaklaşım; metin içinde en fazla bir ana bağlantı ve bir
              destek bağlantısı kullanmaktır. Bu yaklaşım hem editoryal kaliteyi korur hem de
              bağlantı profilinin doğal görünmesini sağlar.
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Medya SSS</h2>
            <div className="mt-4 space-y-4 text-sm text-zinc-700">
              {pressFaq.map((item) => (
                <div key={item.question} className="rounded-xl bg-zinc-50 p-4">
                  <p className="font-semibold text-zinc-900">{item.question}</p>
                  <p className="mt-2 leading-7">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Medya İletişimi</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>
                E-posta: <a className="text-yellow-700 underline" href="mailto:bilgi@34kurye.com">bilgi@34kurye.com</a>
              </li>
              <li>
                Telefon: <a className="text-yellow-700 underline" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
              </li>
            </ul>
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
