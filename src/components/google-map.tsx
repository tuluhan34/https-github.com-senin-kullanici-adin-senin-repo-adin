type Props = {
  query: string;
  zoom?: number;
  className?: string;
  title?: string;
};

const ISTANBUL_OSM_BBOX = "28.75%2C40.92%2C29.35%2C41.18";

const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${ISTANBUL_OSM_BBOX}&layer=mapnik`;

export function GoogleMap({
  query,
  className = "h-[400px] w-full",
  title = "Konum haritasi",
}: Props) {
  const normalizedQuery = query.replace(/,?\s*Turkey/i, "").replace(/,?\s*Turkiye/i, "").trim();

  return (
    <div className={`relative overflow-hidden bg-zinc-950 text-white ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.24),_transparent_34%),linear-gradient(135deg,_rgba(24,24,27,0.96),_rgba(39,39,42,0.92))]" />
      <div className="absolute -right-12 top-8 h-48 w-48 rounded-full border border-white/10 bg-white/5 blur-2xl" />
      <div className="absolute left-8 top-10 h-28 w-28 rounded-full border border-yellow-300/20 bg-yellow-300/10 blur-xl" />

      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300">Operasyon Bilgisi</p>
          <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-white md:text-4xl">{title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
            Harita veya navigasyon bildirimi gostermeden, sadece hizmet alanini anlatan pasif konum karti kullaniyoruz.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Hizmet alani</p>
            <p className="mt-2 font-display text-2xl uppercase tracking-wide text-white">{normalizedQuery}</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              39 ilceye yayilan teslimatlar icin merkez koordinasyon bu bolge mantiginda calisir. Net adres bilgisi sadece siparis asamasinda paylasilir.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Neden pasif kart?</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-300">
              <li>Navigasyon ya da konum bildirimi ciktisi olusturmaz.</li>
              <li>Kullaniciyi harici harita ekranina zorlamaz.</li>
              <li>Sayfada temiz ve guvenli bir gorunum saglar.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
