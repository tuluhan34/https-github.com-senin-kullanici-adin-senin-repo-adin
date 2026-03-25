import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SITE, services } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "İş Ortaklığı ve Referans Programı",
  description:
    "34 Moto Kurye İstanbul iş ortaklığı programı: ajanslar, e-ticaret işletmeleri ve yerel rehberler için linklenebilir ortaklık modeli.",
  alternates: {
    canonical: `https://${SITE.domain}/is-ortakligi`,
  },
};

const partnerTypes = [
  "Dijital ajanslar ve SEO ekipleri",
  "Yerel haber/rehber platformları",
  "E-ticaret altyapı sağlayıcıları",
  "Bölgesel işletme toplulukları",
  "B2B lojistik içerik yayıncıları",
];

const partnershipFlow = [
  "On gorusme: yayin profili, trafik dagilimi ve icerik kategorileri degerlendirilir.",
  "Kaynak secimi: basin kiti, hizmetler, blog veya veri dosyasi baglam bazli secilir.",
  "Yayin plani: metin uzunlugu, baglanti konumu ve teslim tarihi netlestirilir.",
  "Olcumleme: URL bazli trafik, tiklama ve donusum etkisi aylik raporlanir.",
];

const partnerFaq = [
  {
    question: "Sadece dofollow baglanti mi kabul ediliyor?",
    answer:
      "Hayir. Dogal profil icin nofollow, sponsored ve dofollow karmasi birlikte degerlidir. Ana hedef, baglamsal ve gercek editoryal gorunurluktur.",
  },
  {
    question: "Icerik uzunlugu ne kadar olmali?",
    answer:
      "Teknik inceleme veya karsilastirma yazilarinda 900-1500 kelime araligi genelde daha iyi performans verir. Kisa haber formatinda ise dogru baglanti baglami daha onemlidir.",
  },
  {
    question: "Hangi metrikler takip ediliyor?",
    answer:
      "Referring domain artisi, hedef sayfa gorunurlugu, anchor dagilimi ve markali sorgu trendi birlikte izlenir.",
  },
];

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="section-shell py-12">
        <article className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-600">
              Backlink ve Ortaklık Programı
            </p>
            <h1 className="font-display text-5xl uppercase tracking-wide text-zinc-900">
              34 Moto Kurye İstanbul İş Ortaklığı
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-zinc-700">
              Güvenilir kaynak bağlantıları için sürdürülebilir bir ortaklık modeli sunuyoruz.
              Rehber siteleri, sektör blogları, ajanslar ve yerel topluluklar bu sayfayı referans
              göstererek iş birliği başlatabilir.
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Kimlerle Çalışıyoruz?</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {partnerTypes.map((partner) => (
                <li key={partner}>- {partner}</li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-900">Ortaklara Sağlanan Değer</h2>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>- Özel teklif URL&apos;leri ve dönüşüm takibi</li>
                <li>- Ortak içerik üretimi ve bölgesel landing sayfaları</li>
                <li>- Güncel kurye hizmet verileri ile içerik desteği</li>
                <li>- Aylık performans raporu ve optimizasyon önerileri</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-900">Link Verilebilir Sayfalar</h2>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>
                  <a className="text-yellow-700 underline" href={`https://${SITE.domain}/basin-kiti`}>
                    Basın Kiti
                  </a>
                </li>
                <li>
                  <a className="text-yellow-700 underline" href={`https://${SITE.domain}/blog`}>
                    Operasyon ve lojistik blog içerikleri
                  </a>
                </li>
                <li>
                  <a className="text-yellow-700 underline" href={`https://${SITE.domain}/hizmetler`}>
                    Hizmetler sayfası
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Desteklediğimiz Hizmet Başlıkları</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              İçerik ortaklığı kurarken aşağıdaki hizmet başlıkları etrafında editoryal üretim
              yapılabilir:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {services.map((service) => (
                <span
                  key={service.slug}
                  className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
                >
                  {service.title}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Ortaklik Isleyis Modeli</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Is ortakligi sureci tek bir baglanti talebi olarak degil, olculebilir bir icerik is
              birligi olarak yurutulur. Bu modelde hedef, yalnizca baglanti edinmek degil; hem
              yayinci tarafi hem de marka tarafi icin surekli deger olusturmaktir. Bu nedenle her
              partner icin kaynak secimi, metin baglami ve takip metrikleri standart bir akisla
              ilerler.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {partnershipFlow.map((step) => (
                <li key={step}>- {step}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Başvuru</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Ortaklık başvurusu için kısa tanıtım, yayın alanı ve aylık erişim bilgilerinizi
              paylaşmanız yeterlidir.
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Operasyon takibi için hazır şablonlar: {" "}
              <a
                className="text-yellow-700 underline"
                href={`https://${SITE.domain}/data/backlink-outreach-tracker-template.csv`}
              >
                outreach tracker
              </a>{" "}
              ve{" "}
              <a
                className="text-yellow-700 underline"
                href={`https://${SITE.domain}/data/backlink-prospect-scorecard-template.csv`}
              >
                prospect scorecard
              </a>
              .
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-700">
              Yayinlarin kullanabilecegi embed rozetleri ve tum resmi kaynaklar icin{" "}
              <a className="text-yellow-700 underline" href={`https://${SITE.domain}/kaynaklar`}>
                Kaynaklar merkezine
              </a>{" "}
              yonlendirme yapabilirsiniz.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>
                E-posta: <a className="text-yellow-700 underline" href="mailto:bilgi@34kurye.com">bilgi@34kurye.com</a>
              </li>
              <li>
                Telefon: <a className="text-yellow-700 underline" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Ortaklik SSS</h2>
            <div className="mt-4 space-y-4 text-sm text-zinc-700">
              {partnerFaq.map((item) => (
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
    </div>
  );
}
