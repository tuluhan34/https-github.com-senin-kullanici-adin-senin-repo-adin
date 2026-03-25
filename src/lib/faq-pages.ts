import { districts, services, SITE } from "@/lib/site-data";
import { createSeededRandom, hashString, pickMany } from "@/lib/blog/utils";

export type FaqHubKind = "service" | "district";

export type FaqHubEntry = {
  slug: string;
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  kind: FaqHubKind;
  entityName: string;
};

export type FaqHubItem = {
  question: string;
  answer: string;
};

const serviceEntries: FaqHubEntry[] = services.map((service) => ({
  slug: `hizmet-${service.slug}`,
  path: `/sss/hizmet-${service.slug}`,
  title: `${service.title} SSS`,
  description: `${service.title} hizmeti ile ilgili teslimat suresi, fiyatlama, operasyon ve kurumsal kullanim sorularinin tamamini tek sayfada inceleyin.`,
  canonicalUrl: `https://${SITE.domain}/sss/hizmet-${service.slug}`,
  kind: "service",
  entityName: service.title,
}));

const districtEntries: FaqHubEntry[] = districts.map((district) => ({
  slug: `ilce-${district.slug}`,
  path: `/sss/ilce-${district.slug}`,
  title: `${district.name} Kurye SSS`,
  description: `${district.name} bolgesinde kurye cagirma, ayni gun teslimat, gece operasyonu ve rota sureciyle ilgili en cok sorulan sorular burada.`,
  canonicalUrl: `https://${SITE.domain}/sss/ilce-${district.slug}`,
  kind: "district",
  entityName: district.name,
}));

export const faqHubEntries = [...serviceEntries, ...districtEntries];

export const faqHubEntryBySlug = new Map(faqHubEntries.map((entry) => [entry.slug, entry]));

type FaqTemplate = {
  question: string;
  answer: string;
};

const sharedFaqTemplates: FaqTemplate[] = [
  {
    question: "{entity} icin ortalama teslimat suresi nedir?",
    answer:
      "{entity} operasyonunda teslimat suresi; trafik yogunlugu, gonderi tipi ve secilen hizmet modeline gore degisir. Standart akista ayni gun teslimat hedeflenir, acil ve ekspres taleplerde ise sure penceresi daha da kisalir. Alis ve teslim adresleri paylasildiginda ekip net zaman araligini kisa surede iletir.",
  },
  {
    question: "{entity} hizmetinde fiyat nasil hesaplanir?",
    answer:
      "Fiyatlama; mesafe, paket icerigi, teslimat hizi ve varsa cok adresli rota ihtiyacina gore belirlenir. {entity} icin tek adrese acil cikis ile planli dagitim ayni sekilde fiyatlanmaz. Talep aninda gonderi detaylarini paylastiginizda net teklif ve uygun hizmet modeli birlikte sunulur.",
  },
  {
    question: "{entity} hizmetinde gonderi takibi nasil yapilir?",
    answer:
      "Teslimat boyunca WhatsApp uzerinden durum guncellemesi verilir. {entity} rotasinda cikis, yolda olma ve teslim tamamlama adimlari net sekilde paylasilir. Kurumsal kullanimda teslim kaydi, kisi teyidi ve ek operasyon notlari da surece dahil edilebilir.",
  },
  {
    question: "{entity} teslimatinda hangi paket tipleri kabul edilir?",
    answer:
      "Evrak, numune, yedek parca, e-ticaret paketi ve operasyonel gonderiler kabul edilir. {entity} icin hacimli veya kirilabilir urunlerde aracli model onerilir. Hassas icerikler icin siparis asamasinda paket tipi bilgisinin paylasilmasi sureci daha guvenli hale getirir.",
  },
  {
    question: "{entity} teslimatlarinda aliciya ulasilamazsa ne olur?",
    answer:
      "Aliciya ulasilamadiginda once iletisim teyidi saglanir, gerekiyorsa alternatif kisi veya saat bilgisiyle operasyon guncellenir. {entity} teslimatlarinda bu adim standart prosedurdur. Amac, gonderiyi iade etmek yerine en hizli ve guvenli sekilde teslimati tamamlamaktir.",
  },
  {
    question: "{entity} operasyonunda resmi tatillerde hizmet devam eder mi?",
    answer:
      "Evet, resmi tatillerde de hizmet devam eder. {entity} odakli operasyonlarda bayram, hafta sonu ve mesai disi saatlerde aktif ekip yonlendirilir. Uygun hizmet modeli ve tahmini sure bilgisi siparis aninda netlestirilir.",
  },
];

const serviceFaqTemplates: FaqTemplate[] = [
  {
    question: "{entity} icin acil kurye cagirinca surec nasil baslar?",
    answer:
      "{entity} talebinde once alis ve teslim adresleri netlestirilir, ardindan en uygun saha ekibi secilir. Kurye ciktigi anda surec teyidi paylasilir. Gerekli durumlarda alici teyidi, bina notlari ve teslim protokolu ayni akis icinde yonetilir.",
  },
  {
    question: "{entity} hizmetinde gece ve hafta sonu operasyonu var mi?",
    answer:
      "Evet. {entity} hizmet akisi 7/24 olacak sekilde planlanmistir. Gece, hafta sonu ve resmi tatil taleplerinde de aktif ekip yonlendirilir. Ozellikle zaman kritik evrak, medikal ve teknik servis gonderilerinde mesai disi sureklilik onceliklendirilir.",
  },
  {
    question: "{entity} gonderilerinde VIP model ne zaman onerilir?",
    answer:
      "VIP model; kritik evrak, sozlesme veya bekleme kabul etmeyen acil senaryolarda onerilir. {entity} operasyonunda VIP secenekte kurye sadece sizin gonderinize odaklanir ve araya farkli teslimat alinmaz. Bu yaklasim sureyi kisaltir ve belirsizligi azaltir.",
  },
  {
    question: "{entity} icin WhatsApp siparisi kac dakikada onaylanir?",
    answer:
      "WhatsApp uzerinden acilan talepler genellikle kisa surede operasyona alinir. {entity} icin ekipler, gerekli adres ve paket bilgisi tamamlandiginda en uygun modeli onaylayip dogrudan yonlendirme yapar. Hedef, talep ile saha cikisi arasindaki sureyi minimumda tutmaktir.",
  },
];

const districtFaqTemplates: FaqTemplate[] = [
  {
    question: "{entity} bolgesinde kurumsal anlasma yapilabiliyor mu?",
    answer:
      "Kurumsal sirketler icin {entity} odakli periyodik anlasma modelleri sunulur. Duzenli sevkiyat yapan ekiplerde bu model siparis acilisini hizlandirir, operasyon standardini yukselttigi gibi maliyet planlamasini da daha ongorulebilir hale getirir.",
  },
  {
    question: "{entity} icin ayni gun cok adresli dagitim mumkun mu?",
    answer:
      "Evet, {entity} tarafinda tek sipariste cok adresli dagitim planlanabilir. Rota sirasinin dogru kurgulanmasi icin adresler ve teslim notlari toplu paylasilmalidir. Bu yontem ayni gun operasyonunda zaman kaybini azaltir ve teslim tutarliligini artirir.",
  },
  {
    question: "{entity} bolgesinde yogun saatlerde teslimat nasil planlanir?",
    answer:
      "{entity} bolgesinde teslim sureleri sadece mesafeye gore degil, saatlik trafik yogunlugu ve bina giris prosedurlerine gore planlanir. Yogun pencerelerde daha dogru sure vermek icin ekip once rota, park ve teslim noktasi detaylarini netlestirir. Bu yaklasim sahada bekleme riskini azaltir.",
  },
  {
    question: "{entity} bolgesinde hangi gonderiler daha sik tasinir?",
    answer:
      "{entity} tarafinda en cok evrak, numune, e-ticaret paketi, yedek parca ve operasyonel kurum ici gonderiler tasinir. Bolgenin is merkezi, plaza veya rezidans yogunluguna gore uygun kurye modeli belirlenir. Boylece teslimat hizi ile guvenlik dengesi birlikte korunur.",
  },
];

export const buildFaqItemsForEntry = (entry: FaqHubEntry): FaqHubItem[] => {
  const seed = hashString(`${entry.slug}-${entry.kind}`);
  const random = createSeededRandom(seed);
  const source = [
    ...sharedFaqTemplates,
    ...(entry.kind === "service" ? serviceFaqTemplates : districtFaqTemplates),
  ];
  const items = pickMany(source, 8, random);

  return items.map((item) => ({
    question: item.question.replaceAll("{entity}", entry.entityName),
    answer: item.answer.replaceAll("{entity}", entry.entityName),
  }));
};
