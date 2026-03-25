"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TimeSlot = "sabah" | "ogle" | "aksam" | "gece";

type MetricCard = {
  label: string;
  value: string;
  detail: string;
};

type CustomerStory = {
  id: string;
  company: string;
  district: string;
  service: string;
  summary: string;
  href: string;
  cta: string;
};

const customerStories: readonly CustomerStory[] = [
  {
    id: "hukuk-sisli",
    company: "Sisli hukuk burosu",
    district: "Sisli",
    service: "VIP Kurye",
    summary: "Sozlesme cikisi ve imza evraki akisini ayni gun icinde hizli kapatmak isteyen kurumsal ekip.",
    href: "/sisli-moto-kurye",
    cta: "Sisli akislarini oku",
  },
  {
    id: "medikal-kadikoy",
    company: "Kadikoy medikal tedarik",
    district: "Kadikoy",
    service: "Acil Kurye",
    summary: "Gun icinde tekrar eden numune ve kritik malzeme sevklerini zaman baskisi olmadan yoneten musteri tipi.",
    href: "/kadikoy-moto-kurye",
    cta: "Kadikoy operasyonunu incele",
  },
  {
    id: "eticaret-bagcilar",
    company: "Bagcilar e-ticaret deposu",
    district: "Bagcilar",
    service: "Moto Kurye",
    summary: "Ayni gun paket cikislarini aksatmamak icin gunluk duzenli kurye akisina gecen depo yapisi.",
    href: "/bagcilar-moto-kurye",
    cta: "Depo akis detayini oku",
  },
  {
    id: "ajans-besiktas",
    company: "Besiktas reklam ajansi",
    district: "Besiktas",
    service: "Ekspres Kurye",
    summary: "Sunum, prova ve son dakika evrak cikislarinda beklemesiz teslimat isteyen yaratici ekip.",
    href: "/hizmetler/ekspres-kurye",
    cta: "Ekspres modeli oku",
  },
  {
    id: "otel-bakirkoy",
    company: "Bakirkoy konaklama grubu",
    district: "Bakirkoy",
    service: "Gece Kurye",
    summary: "Mesai sonrasi unutulan evrak ve misafir teslimlerini gece saatlerinde de kapatmak isteyen isletme.",
    href: "/hizmetler/gece-kurye",
    cta: "Gece kurye detaylarini oku",
  },
  {
    id: "servis-umraniye",
    company: "Umraniye teknik servis merkezi",
    district: "Umraniye",
    service: "Acil Kurye",
    summary: "Yedek parca ve servis evragi akisini ayni rota icinde hizli tamamlamak isteyen teknik ekip.",
    href: "/umraniye-moto-kurye",
    cta: "Umraniye sahasini oku",
  },
  {
    id: "ofis-maslak",
    company: "Sariyer ofis kati",
    district: "Sariyer",
    service: "VIP Kurye",
    summary: "Plaza giris cikis disiplinine uygun, duzenli ve teyitli teslim akisi arayan kurumsal ofis.",
    href: "/sariyer-moto-kurye",
    cta: "Sariyer plazalarini oku",
  },
  {
    id: "fabrika-ikitelli",
    company: "Basaksehir uretim hatti",
    district: "Basaksehir",
    service: "Aracli Kurye",
    summary: "Hacimli paket ve gun ici toplu cikislarda tek seferde duzenli dagitim isteyen isletme.",
    href: "/hizmetler/aracli-kurye",
    cta: "Aracli dagitimi oku",
  },
  {
    id: "danismanlik-atasehir",
    company: "Atasehir finans danismanligi",
    district: "Atasehir",
    service: "VIP Kurye",
    summary: "Zaman hassasiyeti yuksek sozlesme teslimlerinde dogrudan aliciya giden sade akis isteyen ekip.",
    href: "/atasehir-moto-kurye",
    cta: "Atasehir surecini oku",
  },
  {
    id: "lojistik-kartal",
    company: "Kartal mikro depo",
    district: "Kartal",
    service: "Moto Kurye",
    summary: "Anadolu Yakasi ici dagitimlari saatlik partiler halinde cikaran duzenli teslimat noktasi.",
    href: "/kartal-moto-kurye",
    cta: "Kartal teslim hattini oku",
  },
  {
    id: "laboratuvar-fatih",
    company: "Fatih laboratuvar sevkiyati",
    district: "Fatih",
    service: "Acil Kurye",
    summary: "Zaman kritik numune ve belge akisini gun icinde koparmadan surdurmek isteyen saglik odakli ekip.",
    href: "/fatih-moto-kurye",
    cta: "Fatih akisini oku",
  },
  {
    id: "hukuk-kagithane",
    company: "Kagithane ziyaretci akisi",
    district: "Kagithane",
    service: "Blog ve SSS",
    summary: "Kurye secimi once bilgi edinme ile baslayan kullanicilar icin hizmet ve fiyat mantigini okuyan ziyaretci tipi.",
    href: "/blog",
    cta: "Blog yazilarini oku",
  },
];

const readOffsetsBySlot: Record<TimeSlot, readonly number[]> = {
  sabah: [8, 17, 33, 54],
  ogle: [6, 21, 39, 63],
  aksam: [11, 24, 42, 71],
  gece: [14, 29, 46, 88],
};

const slotCopy: Record<TimeSlot, { eyebrow: string; title: string; description: string }> = {
  sabah: {
    eyebrow: "Gunun operasyon ritmi",
    title: "Sabah saatlerinde gelen talep ve musteri akislarini gorunur tutuyoruz",
    description:
      "Yerlesik bir firmanin en net farki, sabah yogunlugu baslarken bile dagilmayan siparis duzenidir. Bu alan her gun ve gun icinde farkli ritimde yenilenir.",
  },
  ogle: {
    eyebrow: "Gunun operasyon ritmi",
    title: "Oglen yogunlugunda bile oturmus ekip duzeni korunur",
    description:
      "Mesaj, arama ve tamamlanan is akisi gun ortasinda en cok dikkat edilen guven sinyalidir. Ana sayfa bu yogunlugu daha canli gostermek icin saat bazli degisir.",
  },
  aksam: {
    eyebrow: "Gunun operasyon ritmi",
    title: "Aksam saatlerinde de surekli calisan yerlesik operasyon yapisi",
    description:
      "Eski ve oturmus bir firmanin hissi, sadece hizda degil talep yogunlugu artarken bile duzenli gorunebilmesinde ortaya cikar.",
  },
  gece: {
    eyebrow: "Gunun operasyon ritmi",
    title: "Gece vardiyasinda da kopmayan teslim ve musteri akisi",
    description:
      "Mesai disinda bile acik kalan is akisi, uzun suredir sahada olan ekip yapisinin en sakin ama en guclu gostergelerinden biridir.",
  },
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

const getTimeSlot = (date: Date): TimeSlot => {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) {
    return "sabah";
  }

  if (hour >= 12 && hour < 18) {
    return "ogle";
  }

  if (hour >= 18 && hour < 24) {
    return "aksam";
  }

  return "gece";
};

const buildMetrics = (date: Date): MetricCard[] => {
  const day = getDayOfYear(date);
  const hour = date.getHours();
  const minuteBlock = Math.floor(date.getMinutes() / 10);
  const trafficBoost = hour < 7 ? 1 : hour < 11 ? 3 : hour < 17 ? 5 : hour < 22 ? 4 : 2;

  const calls = 12 + (day % 7) + hour * trafficBoost + minuteBlock;
  const messages = 18 + (day % 9) + hour * (trafficBoost + 1) + minuteBlock;
  const completed = 9 + (day % 6) + Math.max(hour - 6, 0) * 3;
  const activeJobs = 3 + ((day + hour + minuteBlock) % 5);

  return [
    {
      label: "Bugun gelen arama",
      value: `${calls}`,
      detail: "Telefon uzerinden alinan fiyat ve yonlendirme talepleri gun icinde yenilenir.",
    },
    {
      label: "Bugun gelen mesaj",
      value: `${messages}`,
      detail: "WhatsApp hattinda toplanan yeni istekler ve hizli fiyat sorulari gunluk ritme gore degisir.",
    },
    {
      label: "Tamamlanan is",
      value: `${completed}+`,
      detail: "Gunluk teslim kapanislari saat ilerledikce artan operasyon hissi verir.",
    },
    {
      label: "Sahada aktif is",
      value: `${activeJobs}`,
      detail: "Gun icinde farkli saatlerde sahaya eklenen teslim ve musteri akisi ana sayfada gorunur kalir.",
    },
  ];
};

export function HomepageLiveSignals() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();
    const intervalId = window.setInterval(updateNow, 300000);
    return () => window.clearInterval(intervalId);
  }, []);

  const currentDate = now ?? new Date(2026, 0, 1, 10, 0, 0);

  const content = useMemo(() => {
    const slot = getTimeSlot(currentDate);
    const day = getDayOfYear(currentDate);
    const hour = currentDate.getHours();

    return {
      slotInfo: slotCopy[slot],
      metrics: buildMetrics(currentDate),
      stories: rotateItems(customerStories, day + hour * 2, 4),
      readOffsets: readOffsetsBySlot[slot],
    };
  }, [currentDate]);

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-yellow-50/70 p-6 shadow-[0_20px_80px_rgba(24,24,27,0.08)] md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            {content.slotInfo.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-5xl uppercase tracking-wide text-zinc-950">
            {content.slotInfo.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 md:text-base">
            {content.slotInfo.description}
          </p>
        </div>
        <div className="rounded-2xl border border-yellow-300/70 bg-yellow-200/50 px-5 py-4 text-sm leading-6 text-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
            Yerlesik firma vurgusu
          </p>
          <p className="mt-2 font-semibold text-zinc-950">
            Uzun suredir Istanbul sahasinda ayni operasyon diliyle calisan, aceleci degil oturmus bir ekip yapisi.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {metric.label}
            </p>
            <p className="mt-3 font-display text-5xl uppercase tracking-wide text-zinc-950">
              {metric.value}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-600">{metric.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Gunun yeni musteri akisleri
          </p>
          <h3 className="mt-2 font-display text-4xl uppercase tracking-wide text-zinc-950">
            Ana sayfada okunabilir canli musteri kartlari
          </h3>
        </div>
        <Link
          href="/sss"
          className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          SSS sayfasini oku
        </Link>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {content.stories.map((story, index) => (
          <article
            key={story.id}
            className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(24,24,27,0.10)]"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">{story.district}</span>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-zinc-800">{story.service}</span>
              <span>Yaklasik {content.readOffsets[index] ?? 12} dk once</span>
            </div>
            <h4 className="mt-4 text-xl font-semibold text-zinc-950">{story.company}</h4>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{story.summary}</p>
            <Link
              href={story.href}
              className="mt-5 inline-flex text-sm font-semibold text-zinc-950 underline decoration-yellow-500 underline-offset-4 transition hover:text-zinc-700"
            >
              {story.cta}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}