'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import {
  SITE,
  galleryTimeSlotLabels,
  getDisplayBusinessPhotos,
  getGalleryTimeSlot,
  galleryUsesRealPhotos,
  googleBusinessEmbeds,
  googleBusinessMapUrl,
  googleBusinessProfileUrl,
  realBusinessPhotos,
  whatsappLink,
} from '@/lib/site-data';

type CategoryId = 'all' | (typeof realBusinessPhotos)[number]['category'];

const categories: Array<{ id: CategoryId; label: string }> = [
  { id: 'all', label: 'Tum Fotograflar' },
  { id: 'moto', label: 'Moto Kurye' },
  { id: 'vip', label: 'VIP Hizmet' },
  { id: 'acil', label: 'Acil Teslimat' },
  { id: 'hizmet', label: 'Hizmetler' },
];

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [timeSlot, setTimeSlot] = useState(() => getGalleryTimeSlot());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeSlot(getGalleryTimeSlot());
    }, 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const photos = getDisplayBusinessPhotos(realBusinessPhotos, timeSlot);

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <header className="border-b border-zinc-200">
        <div className="section-shell flex h-20 items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-zinc-950">
            34 Moto Kurye
          </Link>
          <nav className="hidden gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
              Ana Sayfa
            </Link>
            <Link href="/hizmetler" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
              Hizmetler
            </Link>
            <Link href="/galeri" className="text-sm font-medium text-zinc-950">
              Galeri
            </Link>
          </nav>
        </div>
      </header>

      <main className="section-shell py-20">
        {/* Title Section */}
        <div className="mb-16 space-y-2">
          <h1 className="font-display text-5xl uppercase tracking-wide text-zinc-950">
            Hizmet Galerisi
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600">
            34 Moto Kurye Istanbul olarak sundugumuz hizmetlerin gercek gorsellerini ve Google
            Isletme tabanli vitrin alanlarini inceleyin.
          </p>
          <div className="inline-flex rounded-full border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-semibold text-zinc-800">
            Su an otomatik gosterim: {galleryTimeSlotLabels[timeSlot]} galerisi
          </div>
          <div className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700">
            {galleryUsesRealPhotos ? 'Gercek fotograf modu aktif' : 'Yer tutucu gorsel modu aktif'}
          </div>
          <p className="max-w-3xl text-sm leading-7 text-zinc-500">
            Galeri, gun icindeki zaman dilimine gore oncelikli gercek fotograflari ust siralara tasir.
            Yeni gercek JPG veya WEBP dosyalari ekledikce ayni mekanizma otomatik calismaya devam eder.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-yellow-300 text-zinc-950'
                  : 'border border-zinc-300 text-zinc-700 hover:border-zinc-950'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPhotos.map((photo) => (
            <article
              key={photo.id}
              className="group overflow-hidden rounded-xl border border-zinc-200 transition hover:border-zinc-950 hover:shadow-lg"
            >
              <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  loading="lazy"
                  unoptimized
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-yellow-600">
                  {
                    categories.find((cat) => cat.id === photo.category)
                      ?.label
                  }
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-zinc-950">
                  {photo.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  {photo.description}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Kaynak: {photo.source}
                </p>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-20 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-4xl uppercase tracking-wide text-zinc-950">
              Harita onizlemesi ve Google baglantilari
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-zinc-600">
              Gorunmeme ve iframe hatasi riskini azaltmak icin galeri sayfasinda da dogrudan tiklanabilir
              Google baglanti kartlari kullaniyoruz.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {googleBusinessEmbeds.map((embed, index) => {
              const actionHref =
                index === 0
                  ? googleBusinessProfileUrl
                  : index === 1
                    ? googleBusinessMapUrl
                    : SITE.googleReviewUrl;
              const actionLabel =
                index === 0
                  ? 'Google isletme profilini ac'
                  : index === 1
                    ? 'Google Haritalarda konumu ac'
                    : 'Google yorum akisina git';

              return (
                <article key={embed.src} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Google erisim karti
                  </p>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-zinc-950">
                    {embed.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">{embed.description}</p>
                  <a
                    href={actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex text-sm font-semibold text-zinc-900 underline decoration-yellow-500 underline-offset-4 hover:text-zinc-700"
                  >
                    {actionLabel}
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-zinc-950 to-zinc-800 p-8 text-white md:p-12">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Hizmet Almak İstiyorum
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Fotoğraflardaki hizmetler hakkında daha fazla bilgi almak için bizimle iletişime geçin.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={whatsappLink('Merhaba, galeri sayfanizdaki hizmetler icin bilgi almak istiyorum.')}
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              WhatsApp&apos;ta İletişim
            </a>
            <a
              href={SITE.phoneHref}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white px-6 font-semibold text-white transition hover:bg-white/10"
            >
              Telefon Ara
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: '34 Moto Kurye Istanbul Foto Galeri',
            url: `https://${SITE.domain}/galeri`,
            about: 'Moto kurye ve acil teslimat hizmet galeri gorselleri',
            image: photos.map((photo) => photo.image),
          }),
        }}
      />
    </div>
  );
}
