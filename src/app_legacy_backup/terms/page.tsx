import { SITE } from "@/lib/site-data";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: `Kullanım Şartları | ${SITE.name}`,
  description: `${SITE.name} Kullanım Şartları`,
  alternates: {
    canonical: `https://${SITE.domain}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="section-shell py-12">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl uppercase tracking-wide">Kullanım Şartları</h1>
          
          <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-700">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">1. Kabul ve Anlaşma</h2>
              <p>
                Bu web sitemizi kullanarak, bu kullanım şartlarını kabul etmiş sayılırsınız. 
                Eğer bu şartları kabul etmiyorsanız, lütfen sitemizi kullanmayınız.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">2. Hizmet Açıklaması</h2>
              <p>
                34 Moto Kurye İstanbul, İstanbul genelinde moto kurye, acil kurye, VIP kurye ve araçlı kurye hizmetleri sunmaktadır. 
                Hizmet saatleri 7/24&apos;tür ve hizmetlerin kalitesi, yoğunluk ve diğer faktörlere bağlı olarak değişiklik gösterebilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">3. Müşteri Sorumlulukları</h2>
              <p>
                Müşteriler aşağıdakilerden sorumludur:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Doğru ve güncel adres bilgisi sağlamak</li>
                <li>Gönderilen ürünün yasal olup olmadığını kontrol etmek</li>
                <li>Tehlikeli veya yasadışı maddeleri gönderememek</li>
                <li>Ödemeleri zamanında yapılması</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">4. Ödeme Koşulları</h2>
              <p>
                Tüm ödemeler, hizmet başlamadan önce yapmalıdır. Kabul ettiğimiz ödeme yöntemleri: 
                nakit, kredi kartı ve banka transferidir. Ödeme yapılmayan siparişler iptal edilebilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">5. İmtina Hakları</h2>
              <p>
                34 Moto Kurye İstanbul, aşağıdaki durumlarda hizmet sunmayı reddedebilir:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Yasal olmayan içerik tespit edilmesi durumunda</li>
                <li>Adres bilgisinin doğru olmaması</li>
                <li>Ödeme yapılmaması</li>
                <li>Tehlikeli maddelerin taşınması istenilmesi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">6. Sorumluluk Sınırlaması</h2>
              <p>
                34 Moto Kurye İstanbul, gönderilen ürünlerin değer kaybı, hasar veya kaybolması durumunda maksimum 
                gönderilen ürünün deklarasyon değeri kadarından sorumludur. Sigorta hizmetine tabi olmayan 
                gönderiler için bu sorumluluk sınırlıdır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">7. Hizmetin Gecikmesi</h2>
              <p>
                Tarifeli teslimat sürelerine rağmen, trafik, hava durumu ve diğer sebeplerle gecikmeler 
                yaşanabilir. Minimum 2 saatlik gecikmeler için tazminat talep edilebilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">8. Uyuşmazlıkların Çözümü</h2>
              <p>
                Bu anlaşmadan doğan uyuşmazlıklar dostane bir şekilde çözülmeye çalışılacaktır. 
                Anlaşmaya varılamaması halinde, uyuşmazlık İstanbul Mahkemeleri&apos;nde çözümlenecektir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">9. Değişiklikler</h2>
              <p>
                34 Moto Kurye İstanbul, bu kullanım şartlarını herhangi bir zaman değiştirme hakkını saklı tutar. 
                Değişiklikler web sitesinde yayınlandıktan sonra yürürlüğe girer.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">10. İletişim</h2>
              <p>
                Kullanım şartları hakkında sorularınız varsa bizimle iletişime geçin:
              </p>
              <ul className="ml-4 space-y-1">
                <li>E-posta: <a href="mailto:bilgi@34kurye.com" className="text-yellow-600 hover:underline">bilgi@34kurye.com</a></li>
                <li>Telefon: <a href="tel:+905303219004" className="text-yellow-600 hover:underline">0530 321 90 04</a></li>
              </ul>
            </section>

            <p className="mt-8 text-xs text-zinc-500">
              Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
