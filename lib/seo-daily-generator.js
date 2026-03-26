import { seoKeywords } from "./seo-keywords";

const sectionTemplates = [
  "{location} icinde {mainKeyword} ihtiyaci dogdugunda yalnizca hiz degil, operasyon disiplini de sonucu belirler. Adres dogrulama, teslim kisi teyidi ve rota siralamasi dogru yapildiginda teslimatlar plansiz degil olculebilir bicimde ilerler. Bu model hem bireysel hem de kurumsal gonderilerde gecikme riskini azaltir.",
  "Istanbul trafigi saat bazli degistigi icin {location} cikisli operasyonlarda alternatif guzergah hazirligi kritik onemdedir. Ozellikle sabah ve aksam pik saatlerinde ayni mesafe farkli surede tamamlanabilir. Bu nedenle planlama asamasinda bina giris bilgisi ve teslim alinacak kisi notu netlestirilmelidir.",
  "{mainKeyword} hizmetinde maliyet ve hiz dengesi birlikte ele alinmalidir. Tek adrese acil cikis gereken taleplerde ekspres akis, birden fazla adrese dagitimda rota planli model daha verimli calisir. Bu yaklasim, isletmelerin gunluk sevkiyat kalitesini artirirken operasyonel stresi azaltir.",
  "{location} bolgesindeki teslimat surecinde musteri bilgilendirmesi hizmet kalitesinin parcasidir. Alim bildirimi, yolda bilgisi ve teslim teyidi net olursa hem gonderen hem alici sureci guvenle takip eder. Iletisimdeki seffaflik, yeniden teslimat gibi maliyetli adimlarin onune gecer.",
  "Evrak, numune, e-ticaret paketi veya agir koli gibi farkli gonderiler farkli islem ister. Dogru siniflandirma yapilmadan sahaya cikmak, teslimat suresini uzatir. Bu nedenle ekip, gonderi turune uygun tasima ve teslim protokolu ile hareket etmelidir.",
  "Duzenli gonderi yapan firmalarda haftalik planlama, anlik siparis baskisini azaltir. {location} icinde gunluk tekrar eden teslimatlarin saat araligi dogru tanimlandiginda kapasite daha etkili yonetilir. Boylesi bir sistem, hem teslimat performansini hem musteri memnuniyetini yukselten surdurulebilir bir modeldir.",
];

const faqTemplates = [
  {
    q: "{mainKeyword} icin ayni gun teslimat mumkun mu?",
    a: "Evet. Talebin saatine, trafik yogunluguna ve teslim bolgesine gore ayni gun teslimat planlanir. Acil taleplerde oncelikli rota devreye alinir.",
  },
  {
    q: "Kurye cagirmadan once hangi bilgileri hazirlamaliyim?",
    a: "Alis ve teslim adresi, teslim alacak kisi, telefon numarasi ve gonderi tipi bilgisi yeterlidir. Bu bilgiler sureci hizlandirir.",
  },
  {
    q: "Kurye fiyatlari nasil belirleniyor?",
    a: "Mesafe, gonderi tipi, aciliyet seviyesi ve saat araligi fiyatlamayi etkiler. Net fiyat icin adres bilgisiyle talep acmaniz yeterli olur.",
  },
  {
    q: "Gece veya hafta sonu kurye hizmeti veriliyor mu?",
    a: "Evet, 7/24 hizmet modelinde gece ve hafta sonu operasyonu vardir. Musait ekibe gore en hizli yonlendirme yapilir.",
  },
];

const ctaTemplates = [
  "Istanbul icinde beklemeden kurye planlamak icin hemen WhatsApp hatti uzerinden talep olusturun.",
  "Gonderinizi ertelemeden ayni dakika icinde kurye siparisi verin; ekip en uygun rotayi planlasin.",
  "Kurumsal veya bireysel teslimat ihtiyaciniz icin dogrudan arayin, operasyonu birlikte baslatalim.",
];

const asSlug = (value) =>
  String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const hashCode = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seeded = (seed) => {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const pick = (list, rand) => list[Math.floor(rand() * list.length)];

const pickMany = (list, count, rand) => {
  const bag = [...list];
  const out = [];
  while (bag.length > 0 && out.length < count) {
    const index = Math.floor(rand() * bag.length);
    out.push(bag.splice(index, 1)[0]);
  }
  return out;
};

const wordCount = (text) => String(text).trim().split(/\s+/).filter(Boolean).length;

const cityKeyword = (mainKeyword) => `Istanbul ${mainKeyword}`;

export const buildUnsplashQuery = ({ district, neighborhood, mainKeyword }) => {
  const place = neighborhood ? `${district} ${neighborhood}` : district;
  return `istanbul courier ${mainKeyword} ${place}`;
};

export const buildCourierImageUrl = ({ district, neighborhood, mainKeyword }) => {
  const query = buildUnsplashQuery({ district, neighborhood, mainKeyword });
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
};

export const generateSeoDocument = ({ district, neighborhood, dateKey, index, type }) => {
  const location = neighborhood ? `${district} ${neighborhood}` : district;
  const seed = hashCode(`${location}-${dateKey}-${index}-${type}`);
  const rand = seeded(seed);

  const mainKeyword = pick(seoKeywords, rand);
  const otherKeywords = pickMany(
    seoKeywords.filter((item) => item !== mainKeyword),
    14,
    rand,
  );

  const h1 =
    type === "service"
      ? `${cityKeyword(mainKeyword)} Hizmeti: ${location} Icin Profesyonel Cozumler`
      : `${cityKeyword(mainKeyword)} Rehberi: ${location} Bolgesinde Hizli ve Guvenli Teslimat`;

  const intro = `${cityKeyword(mainKeyword)} aramalarinda ${location} bolgesi icin en dogru sonuc, hiz ve guveni ayni anda sunan planli operasyon modelidir. Bu sayfada ${mainKeyword} hizmetinin nasil daha verimli kullanilacagini, hangi teslimat modelinin hangi ihtiyaca uygun oldugunu ve siparis oncesi dikkat edilmesi gereken kritik detaylari bulacaksiniz.`;

  const sectionTitles = [
    `${mainKeyword} operasyonunda planlama neden onemli?`,
    `${cityKeyword(mainKeyword)} icin hizmet akisinin temel adimlari`,
    `${mainKeyword} kullanirken sik yapilan hatalar ve cozumler`,
    `${cityKeyword(mainKeyword)} taleplerinde dogru kurye modeli secimi`,
  ];

  const sectionBodies = pickMany(sectionTemplates, 4, rand).map((template) =>
    template
      .replaceAll("{location}", location)
      .replaceAll("{mainKeyword}", mainKeyword),
  );

  const advantages = [
    "Tek noktadan hizli siparis ve net operasyon akisi",
    "Acil, planli ve ayni gun teslimat modellerinde esnek planlama",
    "Bireysel ve sirketler icin kurye taleplerinde surec gorunurlugu",
    "Istanbul trafigine uygun rota yonetimi ile zaman kaybinin azalmasi",
    "Teslimat sonu dogrulama ve musteriye net bilgilendirme",
  ];

  const faqs = pickMany(faqTemplates, 4, rand).map((faq) => ({
    question: faq.q.replaceAll("{mainKeyword}", mainKeyword),
    answer: faq.a,
  }));

  const cta = pick(ctaTemplates, rand);

  const lsiKeywords = [cityKeyword(mainKeyword), ...otherKeywords];
  const slug = `${asSlug(location)}-${asSlug(mainKeyword)}-${dateKey}-${index}`;
  const imageUrl = buildCourierImageUrl({ district, neighborhood, mainKeyword });

  const assembledText = [intro, ...sectionBodies, ...advantages, ...faqs.map((f) => f.answer), cta, ...lsiKeywords].join(" ");

  return {
    slug,
    type,
    dateKey,
    district,
    neighborhood: neighborhood || "",
    location,
    mainKeyword,
    h1,
    intro,
    sectionTitles,
    sectionBodies,
    advantages,
    faqs,
    cta,
    lsiKeywords,
    imageUrl,
    wordCount: wordCount(assembledText),
    createdAt: new Date().toISOString(),
  };
};
