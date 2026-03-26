import addresses from "../clean-upload/addresses.json";

const normalize = (value) =>
  String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const slugifyTr = (value) => normalize(value);

const uniqueBy = (items, makeKey) => {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = makeKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
};

const buildNeighborhoodContent = (district, neighborhood) => {
  const area = `${district} ${neighborhood}`;
  const serviceTypes = [
    {
      title: "Aracli Kurye",
      text: "Araba kurye ve aracli kurye modeli, buyuk paket kurye ve agir yuk kurye taleplerinde guvenli tasima saglar.",
    },
    {
      title: "Moto Kurye",
      text: "Moto kurye ve motorlu kurye hizmeti, yogun trafikte hizli teslimat hizmeti isteyen kullanicilar icin ideal cozumdur.",
    },
    {
      title: "Acil Kurye",
      text: "Acil kurye taleplerinde aninda kurye planlamasi yapilir, acil gonderi sureci oncelikli rota ile yonetilir.",
    },
    {
      title: "Ekspres Kurye",
      text: "Ekspres kurye ve ekspres teslimat modeli, ayni gun teslimat beklentisi olan gonderilerde sureyi kisaltir.",
    },
    {
      title: "Sehir Ici Kurye",
      text: "Sehir ici kurye operasyonu, ${area} bolgesinde gun ici teslimat ve paket teslimati ihtiyacina hizli cevap verir.",
    },
    {
      title: "Sehirler Arasi Kurye",
      text: "Sehirler arasi kurye secenegi, planli cikis ve teslim dogrulama adimlariyla ticari ve bireysel gonderilerde kullanilir.",
    },
    {
      title: "VIP Kurye",
      text: "VIP kurye ve ozel kurye hizmeti, kritik gonderilerde yuksek oncelik ve profesyonel operasyon disiplini sunar.",
    },
    {
      title: "Gece Kurye",
      text: "Gece kurye hizmeti, mesai disi saatlerde de guvenilir kurye destegi isteyen musteriler icin aktiftir.",
    },
    {
      title: "7/24 Kurye",
      text: "7/24 kurye modeli ile online kurye cagir ve kurye siparisi ver adimlari gunun her saatinde calisir.",
    },
  ];

  return {
    seoTitle: `${district} ${neighborhood} Kurye | Hizli Teslimat`,
    h1: `${district} ${neighborhood} Kurye Hizmeti`,
    shortDescription: `${neighborhood} mahallesinde hizli kurye, acil gonderi ve ayni gun teslimat cozumleri.`,
    metaDescription: `${district} ${neighborhood} kurye hizmeti: acil kurye, paket teslimati, 7/24 kurye ve guvenilir ayni gun teslimat.`,
    intro:
      `${area} bolgesinde kurye hizmeti, yalnizca hiz degil guvenli teslimat ve dogru planlama gerektirir. Biz, kullanici niyetine uygun operasyonla en yakin kurye ihtiyacini bekletmeden karsilariz.`,
    serviceDetail:
      `${neighborhood} mahallesinde evrak kurye, paket teslimati, e-ticaret kurye ve sirketler icin kurye talepleri farkli akislarla yonetilir. Kurye fiyatlari, mesafe ve teslim modeline gore netlestirilir; uygun fiyatli kurye ve profesyonel kurye dengesi korunur.`,
    serviceTypes,
    suitableFor: [
      "Esnaf ve mahalle dukkanlari",
      "Mahalle isletmeleri ve restoranlar",
      "Ofisler ve muhasebe birimleri",
      "Plazalar ve kurumsal firmalar",
      "E-ticaret satisi yapan markalar",
    ],
    whyUs: [
      "Guvenilir kurye sureci: adres, alici ve teslim dogrulama adimlari",
      "Hizli teslimat firmasi disiplini: trafik ve rota bazli planlama",
      "Uygun kurye hizmeti: ihtiyaca gore esnek fiyatlandirma",
      "Kurye firmasi tecrubesi: ticari kurye ve bireysel kurye operasyonlarinda profesyonellik",
    ],
    faqs: [
      {
        q: `${district} ${neighborhood} bolgesinde en yakin kurye ne kadar surede gelir?`,
        a: "Operasyon yogunluguna gore degisir; uygun ekip oldugunda dakik kurye yonlendirmesi yapilir.",
      },
      {
        q: "Kurye fiyatlari nasil belirlenir?",
        a: "Mesafe, gonderi turu, aciliyet ve teslimat saatine gore seffaf fiyatlandirma uygulanir.",
      },
      {
        q: "Ayni gun teslimat hangi gonderiler icin uygundur?",
        a: "Evrak, paket, numune ve acil gonderi tiplerinde ayni gun teslimat modeli kullanilabilir.",
      },
      {
        q: "Gece kurye ve 7/24 kurye hizmeti aktif mi?",
        a: "Evet. Uygunluk durumuna gore gece kurye ve 7/24 kurye hizmeti kesintisiz devam eder.",
      },
      {
        q: "E-ticaret kurye hizmeti duzenli calismaya uygun mu?",
        a: "Evet. E-ticaret gonderileri icin duzenli alimli, gun ici teslimat odakli operasyon kurgusu kurulabilir.",
      },
    ],
    cta: "Kurye hizmeti almak icin hemen online kurye cagir adimiyla talep olusturun; ekibimiz en kisa surede sizi yonlendirsin.",
  };
};

export const neighborhoodPages = uniqueBy(
  addresses
    .filter((item) => item?.district && item?.neighborhood)
    .map((item) => ({
      district: item.district,
      neighborhood: item.neighborhood,
      districtSlug: slugifyTr(item.district),
      neighborhoodSlug: slugifyTr(item.neighborhood),
      ...buildNeighborhoodContent(item.district, item.neighborhood),
    })),
  (item) => `${item.districtSlug}__${item.neighborhoodSlug}`,
);

export const getNeighborhoodBySlugs = (districtSlug, neighborhoodSlug) =>
  neighborhoodPages.find(
    (item) => item.districtSlug === districtSlug && item.neighborhoodSlug === neighborhoodSlug,
  ) || null;

export const getNeighborhoodsByDistrictName = (districtName) => {
  const districtSlug = slugifyTr(districtName);
  return neighborhoodPages.filter((item) => item.districtSlug === districtSlug);
};
