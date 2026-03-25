import Link from "next/link";
import { PwaInstallButton, PwaNotificationButton } from "@/components/pwa-install";
import { SITE, googleBusinessProfileUrl, services, districts } from "@/lib/site-data";

const popularDistricts = [
  "besiktas", "kadikoy", "sisli", "fatih", "atasehir",
  "maltepe", "umraniye", "kartal", "bakirkoy", "sariyer",
  "levent", "maslak", "pendik", "taksim", "mecidiyekoy",
];

const platformLinks = [
  { label: "Google Isletme", href: googleBusinessProfileUrl },
  { label: "Instagram", href: SITE.social.instagram },
  { label: "Facebook", href: SITE.social.facebook },
  { label: "Twitter / X", href: SITE.social.twitter },
  { label: "LinkedIn", href: SITE.social.linkedin },
  { label: "YouTube", href: SITE.social.youtube },
  { label: "TikTok", href: SITE.social.tiktok },
  { label: "Threads", href: SITE.social.threads },
  { label: "Pinterest", href: SITE.social.pinterest },
  { label: "Yandex Haritalar", href: SITE.directories.yandexMaps },
  { label: "Apple Haritalar", href: SITE.directories.appleMaps },
  { label: "Foursquare", href: SITE.directories.foursquare },
  { label: "Yelp", href: SITE.directories.yelp },
  { label: "Trustpilot", href: SITE.directories.trustpilot },
  { label: "Beyaz Sayfa", href: SITE.directories.beyazsayfa },
  { label: "Firma Rehberi", href: SITE.directories.firmarehberi },
  { label: "Firma Listesi", href: SITE.directories.firmaliste },
  { label: "Bulurum", href: SITE.directories.bulurum },
  { label: "En İyisi", href: SITE.directories.eniyisi },
  { label: "Sahibinden", href: SITE.directories.sahibinden },
  { label: "Türkiye Rehberi", href: SITE.directories.turkiyerehberi },
  { label: "Yerel Rehber", href: SITE.directories.yerelrehber },
  { label: "Hotfrog", href: SITE.directories.hotfrog },
  { label: "Cylex", href: SITE.directories.cylex },
  { label: "Wikimapia", href: SITE.directories.wikimapia },
].filter((p): p is { label: string; href: string } => Boolean(p.href));

export function SiteFooter() {
  return (
    <footer className="deferred-section border-t border-zinc-800 bg-zinc-950 py-12 text-zinc-300">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 md:grid-cols-4 md:px-6 xl:grid-cols-5">
        <div>
          <p className="font-display text-3xl uppercase tracking-wide text-white">
            {SITE.name}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            İstanbul genelinde 7/24 moto kurye, acil kurye, VIP kurye ve araçlı
            kurye hizmetleri.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-300">
            Hizmetler
          </h3>
          <ul className="mt-3 grid gap-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link className="hover:text-white" href={`/hizmetler/${service.slug}`}>
                  {service.title}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link className="hover:text-yellow-300" href="/galeri">
                Fotoğraf Galerisi
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-300" href="/blog">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-300">
            Yasal
          </h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link className="hover:text-white" href="/sss">
                Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/privacy">
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/terms">
                Kullanım Şartları
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/cookies">
                Çerez Politikası
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-300">
            Popüler İlçeler
          </h3>
          <ul className="mt-3 grid gap-2 text-sm">
            {districts
              .filter((d) => popularDistricts.includes(d.slug))
              .map((d) => (
                <li key={d.slug}>
                  <Link className="hover:text-white" href={`/${d.slug}`}>
                    {d.name} Kurye
                  </Link>
                </li>
              ))}
            <li className="pt-1">
              <Link className="hover:text-yellow-300" href="/">
                Tüm İlçeler
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-300">
            İletişim Bilgileri
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-zinc-400">Telefon</p>
              <a href={SITE.phoneHref} className="text-white font-medium hover:text-yellow-300">
                {SITE.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="text-zinc-400">E-posta</p>
              <a href="mailto:bilgi@34kurye.com" className="text-white font-medium hover:text-yellow-300">
                bilgi@34kurye.com
              </a>
            </div>
            <div>
              <p className="text-zinc-400">Hizmet Saati</p>
              <p className="text-white font-medium">7/24 - Kesintisiz</p>
            </div>
            <div>
              <p className="text-zinc-400">Hizmet Bölgesi</p>
              <p className="text-white font-medium">İstanbul Geneli</p>
            </div>
            <div className="pt-2">
              <p className="text-zinc-400">Uygulama</p>
              <div className="mt-2 flex flex-col gap-2">
                <PwaInstallButton
                  label="Uygulamayi Indir"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-yellow-300"
                />
                <PwaNotificationButton
                  label="Bildirim Izinlerini Ac"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-6xl border-t border-zinc-800 px-4 pt-6 md:px-6">
        <div className="flex flex-row flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-3">
            {SITE.social.instagram && (
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-zinc-400 transition hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            )}
            {SITE.social.facebook && (
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-zinc-400 transition hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {SITE.social.twitter && (
              <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="text-zinc-400 transition hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {SITE.social.linkedin && (
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-zinc-400 transition hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {SITE.social.youtube && (
              <a href={SITE.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-zinc-400 transition hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {SITE.social.tiktok && (
              <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-zinc-400 transition hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
      {platformLinks.length > 0 && (
        <div className="mx-auto mt-6 w-full max-w-6xl border-t border-zinc-800 px-4 pt-6 pb-2 md:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Kayıtlı Olduğumuz Platformlar
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {platformLinks.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 transition hover:text-zinc-300"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </footer>
  );
}
