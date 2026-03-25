import { SITE } from "@/lib/site-data";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: `Gizlilik Politikası | ${SITE.name}`,
  description: `${SITE.name} Gizlilik Politikası`,
  alternates: {
    canonical: `https://${SITE.domain}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="section-shell py-12">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl uppercase tracking-wide">Gizlilik Politikası</h1>
          
          <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-700">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">1. Genel Bilgiler</h2>
              <p>
                34 Moto Kurye İstanbul olarak, müşterilerimizin kişisal verilerinin korunması konusunda büyük önem taşırız. 
                Bu gizlilik politikası, web sitemizde toplanan, kullanılan ve korunan kişisel bilgiler hakkında 
                bilgi sağlamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">2. Toplanan Veriler</h2>
              <p>
                Web sitemizi kullanırken aşağıdaki bilgileri toplayabiliriz:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>İsim, telefon numarası ve e-posta adresi</li>
                <li>Teslimat adresi ve konum bilgileri</li>
                <li>Kurye hizmetleri hakkındaki tercihleriniz</li>
                <li>İşlem geçmişi ve iletişim kayıtları</li>
                <li>Teknik veriler (IP adresi, tarayıcı türü vb.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">3. Verilerin Kullanımı</h2>
              <p>
                Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Kurye hizmetlerini sunmak</li>
                <li>Siparişleri işlemek ve teslimatı gerçekleştirmek</li>
                <li>Müşteri desteği sağlamak</li>
                <li>Hizmet kalitesini iyileştirmek</li>
                <li>Yasalara uyumlu kalmak</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">4. Verilerin Korunması</h2>
              <p>
                Kişisal verileriniz, endüstrinin en iyi güvenlik uygulamaları kullanılarak korunmaktadır. 
                Veriler, yetkisiz erişim ve değişikliklere karşı şifreleme ve diğer güvenlik önlemleri 
                tarafından korunmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">5. Üçüncü Taraflarla Paylaşım</h2>
              <p>
                Kişisal verileriniz üçüncü taraflara satılmaz, kiralanmaz veya verilmez. Ancak, hizmetleri 
                sunmak için gerekli olan güvenilir iş ortaklarımıza (ödeme işlemcileri, lojistik ortakları vb.) 
                sınırlı bilgi paylaşılabilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">6. Çerezler</h2>
              <p>
                Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
                Tarayıcı ayarlarınızdan çerezleri kontrol edebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">7. Haklarınız</h2>
              <p>
                KVKK uyarınca, kişisal verilerinize ilişkin aşağıdaki hakklara sahipsiniz:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Verilerinizin silinmesini talep etme</li>
                <li>Verilerinize erişim talebinde bulunma</li>
                <li>Verilerin düzeltilmesini isteme</li>
                <li>İşleme itiraz etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">8. İletişim</h2>
              <p>
                Gizlilik politikası hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
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
