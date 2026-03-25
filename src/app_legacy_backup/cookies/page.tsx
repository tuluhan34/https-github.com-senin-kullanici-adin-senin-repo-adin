import { SITE } from "@/lib/site-data";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: `Çerez Politikası | ${SITE.name}`,
  description: `${SITE.name} Çerez Politikası`,
  alternates: {
    canonical: `https://${SITE.domain}/cookies`,
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="section-shell py-12">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl uppercase tracking-wide">Çerez Politikası</h1>
          
          <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-700">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">1. Çerezler Nedir?</h2>
              <p>
                Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınızda saklanan küçük metin dosyalarıdır. 
                Web sitelerine ve hizmetlerine erişmeyi iyileştirmek ve kişiselleştirmek için kullanılırlar.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">2. Kullandığımız Çerezlerin Türleri</h2>
              
              <div className="ml-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-zinc-900">Gerekli Çerezler</h3>
                  <p>
                    Web sitemizin temel işlevlerini sağlamak için gereklidir. 
                    Oturum yönetimi, güvenlik ve tercih ayarları için kullanılırlar.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-900">Analitik Çerezler</h3>
                  <p>
                    Web sitemizin nasıl kullanıldığını anlamak için anonim veriler toplarız. 
                    Hizmetlerimizi iyileştirmemize yardımcı olur.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-900">İşlevsellik Çerezleri</h3>
                  <p>
                    Tercihlerinizi hatırlamak için kullanılırlar. Böylece her ziyarette 
                    aynı tercihler uygulanır.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-900">Pazarlama Çerezleri</h3>
                  <p>
                    Tanıtım amaçlı çerezler kullanılabilir. Ancak, size kişisel verilerinize 
                    ilişkin hassas bilgiler paylaşılmaz.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">3. Çerezlerin Kontrol Edilmesi</h2>
              <p>
                Çerezleri tarayıcı ayarlarından kontrol edebilirsiniz. Çoğu tarayıcı çerezlerin depolanmasını 
                engelleme seçeneği sağlar. Ancak, bu durum web sitemizin bazı işlevlerini etkileyebilir.
              </p>
              <ul className="ml-4 mt-3 list-disc space-y-2">
                <li>Chrome: Ayarlar &gt; Gizlilik &gt; Çerez ve diğer site verileri</li>
                <li>Firefox: Seçenekler &gt; Gizlilik &gt; Çerezler</li>
                <li>Safari: Tercihler &gt; Gizlilik &gt; Çerezler</li>
                <li>Edge: Ayarlar &gt; Gizlilik &gt; Çerezler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">4. Çerez Saklama Süresi</h2>
              <p>
                Çerezlerin saklama süresi türlerine göre değişir. Gerekli çerezler oturum sonunda silinir, 
                diğer çerezler ise daha uzun süre saklanabilir. Ayarlarınızdan çerezleri istediğiniz zaman silebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">5. Üçüncü Taraf Çerezleri</h2>
              <p>
                Web sitemizde, analitik ve pazarlama amaçları için Google Analytics ve benzeri 
                hizmetler kullanılabilir. Bu hizmetler tarafından kurulan çerezler hakkında bilgi 
                almak için ilgili hizmetin gizlilik politikasını inceleyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">6. Çerez Seçenekleri</h2>
              <p>
                İlk ziyaretinizde, kullanılacak çerezlerin türleri hakkında bilgilendirilirsiniz. 
                Gerekli olmayan çerezleri kabul etmeyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">7. Değişiklikler</h2>
              <p>
                Bu çerez politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada 
                yayınlandıktan sonra yürürlüğe girer.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">8. İletişim</h2>
              <p>
                Çerez politikası hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
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
