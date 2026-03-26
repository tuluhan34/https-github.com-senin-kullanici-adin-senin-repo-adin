"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { businessProofItems, homepageTrustMetrics, realBusinessPhotos } from "@/lib/site-data";

type TimeSlot = "morning" | "afternoon" | "evening" | "night";

const sectionVariants: Record<
  TimeSlot,
  {
    eyebrow: string;
    title: string;
    description: string;
  }[]
> = {
  morning: [
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "Gune Guven Veren Yerel Kurye Yapisi",
      description:
        "Sabah saatlerinde kurye arayan kullanici, once isletmenin gercekten aktif ve duzenli calistigini gormek ister. Bu alan, gunun erken saatlerinde o guveni veren sinyalleri one cikarir.",
    },
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "Sabah Operasyonuna Uygun Guven Sinyalleri",
      description:
        "Erken saatli teslimatlar, hiz kadar planlama ister. Bu bolumde gorulen puan, kapsama alani ve gercek gorseller; isletmenin duzenli ve sahada aktif oldugunu daha net hissettirir.",
    },
  ],
  afternoon: [
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "Gun Ortasinda Guven Veren Aktif Isletme Gorunumu",
      description:
        "Oglen ve is saatleri icinde kullanici, teslimatin sadece hizli degil duzenli ve profesyonel yonetildigini de gormek ister. Bu alan o guven duygusunu desteklemek icin doner.",
    },
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "Yerel Olarak Gorunen, Guncel Olarak Guven Veren Yapi",
      description:
        "Gun ortasinda degisen trafik, adres yogunlugu ve taleplere ragmen kurumsal duzenin bozulmadigini gosteren sinyaller burada farkli bir kombinasyonla sunulur.",
    },
  ],
  evening: [
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "Aksam Saatlerinde Guven Veren Kurumsal Akis",
      description:
        "Aksam saatlerinde arama yapan kullanicilar genellikle hizli yanit ve net yonlendirme bekler. Bu bolum, isletmenin gunden geceye uzanan operasyon disiplinini gostermek icin degisir.",
    },
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "Yogun Saatlerde Bile Guven Veren Isletme Izleri",
      description:
        "Gun sonuna dogru artan teslim baskisinda bile guven sinyallerinin net olmasi, kullanici icin belirleyici hale gelir. Buradaki donen icerik o hissi daha canli tutar.",
    },
  ],
  night: [
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "Gece Saatlerinde de Guven Veren Yerel Yapi",
      description:
        "Gece kurye arayan kullanici icin en kritik konu, firmanin gercekten aktif olup olmadigidir. Bu nedenle bolum, gece saatlerinde operasyon surekliligini hissettiren bir tonla degisir.",
    },
    {
      eyebrow: "Kurumsal Guven Katmani",
      title: "7/24 Calisan Isletme Hissini Gucleyen Gorus",
      description:
        "Mesai disi saatlerde dahi aktif ve oturmus bir isletme gorunumu vermek, donusum acisindan fark yaratir. Bu bolumdeki zaman bazli degisim o surekliligi destekler.",
    },
  ],
};

const getTimeSlot = (date: Date): TimeSlot => {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 18) {
    return "afternoon";
  }

  if (hour >= 18 && hour < 24) {
    return "evening";
  }

  return "night";
};

const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
};

const rotateItems = <T,>(items: readonly T[], start: number, count: number) => {
  if (items.length <= count) {
    return [...items];
  }

  const normalizedStart = ((start % items.length) + items.length) % items.length;
  const rotated = [...items.slice(normalizedStart), ...items.slice(0, normalizedStart)];
  return rotated.slice(0, count);
};

export function HomepageTrustRotator() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();
    const intervalId = window.setInterval(updateNow, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  const currentDate = now ?? new Date(2026, 0, 1, 10, 0, 0);

  const { variant, visibleMetrics, visibleProofItems, visiblePhotos } = useMemo(() => {
    const slot = getTimeSlot(currentDate);
    const day = getDayOfYear(currentDate);
    const cycle = Math.floor(currentDate.getTime() / 15000);

    const variantsForSlot = sectionVariants[slot];
    const variant = variantsForSlot[(day + cycle) % variantsForSlot.length];

    return {
      variant,
      visibleMetrics: rotateItems(homepageTrustMetrics, day + cycle, 6),
      visibleProofItems: rotateItems(businessProofItems, day + cycle * 2, 3),
      visiblePhotos: rotateItems(realBusinessPhotos, day + cycle * 3, 4),
    };
  }, [currentDate]);

  return (
    <section className="section-shell deferred-section pb-14">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {variant.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-5xl uppercase tracking-wide text-zinc-950">
            {variant.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">{variant.description}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleMetrics.map((item) => (
            <article key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {item.label}
              </p>
              <p className="mt-3 font-display text-4xl uppercase tracking-wide text-zinc-950">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-600">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {visibleProofItems.map((item) => (
            <article key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-600">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visiblePhotos.map((photo) => (
            <article key={photo.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <div className="relative h-48 w-full">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-zinc-950">{photo.title}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                  {photo.source}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
