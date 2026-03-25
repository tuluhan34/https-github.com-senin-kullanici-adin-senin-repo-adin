import { districtNeighborhoodNamesByDistrictName } from "@/lib/district-neighborhood-data";

const rawPhoneHref = process.env.NEXT_PUBLIC_PHONE_HREF || "tel:+905303219004";
const rawWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905303219004";

const normalizePhoneHref = (value: string) => {
  if (value.startsWith("tel:")) {
    const number = value.replace("tel:", "").trim();
    const cleaned = number.replace(/[^\d+]/g, "");
    return `tel:${cleaned}`;
  }

  const cleaned = value.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
};

const normalizeWhatsappNumber = (value: string) => {
  return value.replace(/\D/g, "");
};

import galleryAssetManifest from "@/lib/generated-gallery-assets.json";

export const SITE = {
  name: "34 Moto Kurye İstanbul",
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "34motokuryeistanbul.com",
  city: "İstanbul",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "0530 321 90 04",
  phoneHref: normalizePhoneHref(rawPhoneHref),
  whatsappNumber: normalizeWhatsappNumber(rawWhatsappNumber),
  googleReviewUrl:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
    "https://g.page/r/CVtUaZqt_Mn2EBM/review",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
    threads: process.env.NEXT_PUBLIC_THREADS_URL || "",
    pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || "",
  },
  directories: {
    googleBusiness:
      process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ||
      "https://g.page/r/CVtUaZqt_Mn2EBM/review",
    googleMaps: process.env.NEXT_PUBLIC_GOOGLE_MAPS_PROFILE_URL || "",
    yandexMaps: process.env.NEXT_PUBLIC_YANDEX_MAPS_URL || "",
    appleMaps: process.env.NEXT_PUBLIC_APPLE_MAPS_URL || "",
    foursquare: process.env.NEXT_PUBLIC_FOURSQUARE_URL || "",
    yelp: process.env.NEXT_PUBLIC_YELP_URL || "",
    trustpilot: process.env.NEXT_PUBLIC_TRUSTPILOT_URL || "",
    beyazsayfa: process.env.NEXT_PUBLIC_BEYAZSAYFA_URL || "",
    firmarehberi: process.env.NEXT_PUBLIC_FIRMAREHBERI_URL || "",
    firmaliste: process.env.NEXT_PUBLIC_FIRMALISTE_URL || "",
    bulurum: process.env.NEXT_PUBLIC_BULURUM_URL || "",
    eniyisi: process.env.NEXT_PUBLIC_ENIYISI_URL || "",
    sahibinden: process.env.NEXT_PUBLIC_SAHIBINDEN_URL || "",
    turkiyerehberi: process.env.NEXT_PUBLIC_TURKIYEREHBERI_URL || "",
    yerelrehber: process.env.NEXT_PUBLIC_YERELREHBER_URL || "",
    hotfrog: process.env.NEXT_PUBLIC_HOTFROG_URL || "",
    cylex: process.env.NEXT_PUBLIC_CYLEX_URL || "",
    wikimapia: process.env.NEXT_PUBLIC_WIKIMAPIA_URL || "",
  },
};

export const whatsappBase = `https://wa.me/${SITE.whatsappNumber}`;

export const whatsappLink = (message: string) => {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
};

const googleMapsSearchFallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name}, ${SITE.city}, Turkey`)}`;

export const googleBusinessProfileUrl =
  SITE.directories.googleMaps || SITE.directories.googleBusiness || SITE.googleReviewUrl;

export const googleBusinessMapUrl = SITE.directories.googleMaps || googleMapsSearchFallback;

export const googleBusinessEmbeds = [
  {
    title: "Google Isletme Konum Bulucu",
    description:
      "Kullanicilarin konumu ve hizmet noktasini daha hizli anlamasi icin Google tabanli isletme bulucu bileşeni.",
    src: "https://storage.googleapis.com/maps-solutions-uqtp8x8eyn/locator-plus/o4px/locator-plus.html",
  },
  {
    title: "Google Adres Secim Yardimcisi",
    description:
      "Alis ve teslimat adresi seciminde kullaniciya gorsel destek veren Google tabanli secim modulu.",
    src: "https://storage.googleapis.com/maps-solutions-uqtp8x8eyn/address-selection/isk1/address-selection.html",
  },
  {
    title: "Google Ulasim ve Yol Gosterimi",
    description:
      "Farkli bolgelerden erisim ve ulasim senaryolarini gosteren Google commute bileseni.",
    src: "https://storage.googleapis.com/maps-solutions-uqtp8x8eyn/commutes/ed0t/commutes.html",
  },
] as const;

export const googleBusinessSnapshot = {
  ratingValue: 4.8,
  reviewCount: 127,
  bestRating: 5,
} as const;

export type GalleryTimeSlot = "sabah" | "ogle" | "aksam" | "gece";

export const galleryTimeSlotLabels: Record<GalleryTimeSlot, string> = {
  sabah: "Sabah",
  ogle: "Oglen",
  aksam: "Aksam",
  gece: "Gece",
};

export const getGalleryTimeSlot = (date = new Date()): GalleryTimeSlot => {
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

export type RealBusinessPhoto = {
  id: string;
  title: string;
  category: "moto" | "vip" | "acil" | "hizmet";
  image: string;
  description: string;
  source: string;
  slots: GalleryTimeSlot[];
};

type GalleryAssetManifest = {
  usingRealPhotos: boolean;
  generatedAt: string;
  assets: Record<string, string>;
};

const galleryAssets = galleryAssetManifest as GalleryAssetManifest;

const resolveGalleryAsset = (key: string, fallback: string) => galleryAssets.assets[key] || fallback;

export const galleryUsesRealPhotos = galleryAssets.usingRealPhotos;

const rotateGalleryByClock = <T>(items: T[], date = new Date()) => {
  if (items.length <= 1) {
    return items;
  }

  const hour = date.getHours();
  const day = date.getDay();
  const start = (hour + day * 2) % items.length;

  return [...items.slice(start), ...items.slice(0, start)];
};

export const getDisplayBusinessPhotos = (
  photos: readonly RealBusinessPhoto[],
  timeSlot: GalleryTimeSlot,
  date = new Date(),
) => {
  const prioritized = photos.filter((photo) => photo.slots.includes(timeSlot));
  const fallback = photos.filter((photo) => !photo.slots.includes(timeSlot));

  return [...rotateGalleryByClock(prioritized, date), ...rotateGalleryByClock(fallback, date)];
};

/** Yerel /gallery/* dosyalari FileZilla ile yuklenir. SVG yerine gercek JPG/WEBP ekleyince sadece image yolunu degistirin. */
export const realBusinessPhotos: RealBusinessPhoto[] = [
  {
    id: "business-photo-1",
    title: "Istiklal ve vitrin ritmi",
    category: "moto",
    image: resolveGalleryAsset("photo-1", "/gallery/photo-1.svg"),
    description: "Istanbul'un yaya akisli alisveris caddelerinde hizli teslim hissini destekleyen sehir karesi.",
    source: "Istanbul sehir fotografi",
    slots: ["sabah", "ogle"],
  },
  {
    id: "business-photo-2",
    title: "AVM ve magaza girisi",
    category: "vip",
    image: resolveGalleryAsset("photo-2", "/gallery/photo-2.svg"),
    description: "Magaza, plaza ve AVM yogunlugunu anlatan temiz ve guven veren bir teslim atmosferi.",
    source: "Istanbul sehir fotografi",
    slots: ["ogle", "aksam"],
  },
  {
    id: "business-photo-3",
    title: "Galata ve sokak dukkanlari",
    category: "acil",
    image: resolveGalleryAsset("photo-3", "/gallery/photo-3.svg"),
    description: "Esnaf ve sokak magazalariyla yerel teslimat guvenini guclendiren Istanbul manzarasi.",
    source: "Istanbul sehir fotografi",
    slots: ["sabah", "aksam"],
  },
  {
    id: "business-photo-4",
    title: "Karakoy sahil ve ticaret akisi",
    category: "hizmet",
    image: resolveGalleryAsset("photo-4", "/gallery/photo-4.svg"),
    description: "Kurumsal gonderi ve gun ici erisim fikrini destekleyen ferah Istanbul gorunumu.",
    source: "Istanbul sehir fotografi",
    slots: ["ogle", "gece"],
  },
  {
    id: "business-photo-5",
    title: "Kediyle mahalle hissi",
    category: "hizmet",
    image: resolveGalleryAsset("photo-5", "/gallery/photo-5.svg"),
    description: "Istanbul'un mahalle karakterini yumusatan kedi detayli, sicak ve davetkar bir kare.",
    source: "Istanbul sehir fotografi",
    slots: ["sabah", "gece"],
  },
  {
    id: "business-photo-6",
    title: "Martili vapur ve kiyilar",
    category: "moto",
    image: resolveGalleryAsset("photo-6", "/gallery/photo-6.svg"),
    description: "Kuslu ve ferah Istanbul kiyisi, markanin sadece teslimat degil sehir aidiyeti hissi vermesini saglar.",
    source: "Istanbul sehir fotografi",
    slots: ["ogle", "aksam"],
  },
  {
    id: "business-photo-7",
    title: "Nisantasi dukkan aksami",
    category: "acil",
    image: resolveGalleryAsset("photo-7", "/gallery/photo-7.svg"),
    description: "Aksam saatlerinde acik vitrinler ve duzenli cadde ritmiyle premium teslim hissi.",
    source: "Istanbul sehir fotografi",
    slots: ["aksam", "gece"],
  },
  {
    id: "business-photo-8",
    title: "Avlu, kuslar ve sakin sehir",
    category: "vip",
    image: resolveGalleryAsset("photo-8", "/gallery/photo-8.svg"),
    description: "Kuslu ve sakin avlu dili, yerel ama duzenli hizmet algisini yumusak bir sekilde tamamlar.",
    source: "Istanbul sehir fotografi",
    slots: ["sabah", "gece"],
  },
] as const;

export const defaultOrderMessage =
  "Merhaba, kurye fiyat bilgisi almak istiyorum. Alış ve teslimat adresimi paylaşıyorum.";

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  bullets: string[];
  deliveryTime: string;
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "moto-kurye",
    title: "Moto Kurye",
    shortDescription:
      "İstanbul içi evrak, paket ve e-ticaret gönderileriniz için dengeli fiyatlı standart hızlı servis.",
    longDescription:
      "Moto Kurye servisi, trafiğin yoğun olduğu saatlerde bile gönderilerinizi hızlı şekilde teslim etmek için tasarlanmıştır. Evrak, numune, ürün, unutulan eşya ve hafif paket taşımalarında en çok tercih edilen çözümdür.",
    bullets: [
      "30-90 dakika arası hedef teslimat",
      "Tüm ilçelerde aktif saha ekibi",
      "Teslimat bilgisi ve süreç takibi",
      "Kurumsal ve bireysel gönderime uygun",
    ],
    deliveryTime: "30-90 dakika",
    seoTitle: "İstanbul Moto Kurye Hizmeti | 34 Moto Kurye İstanbul",
    seoDescription:
      "İstanbul moto kurye hizmeti ile evrak, paket ve e-ticaret gönderilerinizi 7/24 hızlı, güvenli ve aynı gün teslimat avantajıyla hemen ulaştırın, fiyat alın.",
  },
  {
    slug: "vip-kurye",
    title: "VIP Kurye",
    shortDescription:
      "Tek gönderi odaklı, beklemesiz, doğrudan alıcıya giden özel kurye hizmeti.",
    longDescription:
      "VIP Kurye hizmetinde sürücü sadece sizin gönderinizle ilgilenir. Kritik evraklar, sözleşmeler ve zaman hassasiyeti yüksek teslimatlar için en güvenli seçenektir.",
    bullets: [
      "Beklemesiz özel tahsisli kurye",
      "Araya farklı teslimat alınmaz",
      "Dakika bazlı bilgilendirme",
      "Yüksek gizlilik ve güvenlik",
    ],
    deliveryTime: "20-60 dakika",
    seoTitle: "VIP Kurye İstanbul | Özel Tahsisli Hizmet",
    seoDescription:
      "VIP kurye İstanbul hizmeti ile kritik gönderilerinizi beklemeden, doğrudan ve yüksek güvenlik standardıyla 7/24 profesyonel şekilde teslim edin, fiyat alın.",
  },
  {
    slug: "acil-kurye",
    title: "Acil Kurye",
    shortDescription:
      "Son dakika ve zaman kritik gönderiler için en hızlı yönlendirme modelimiz.",
    longDescription:
      "Acil Kurye modeli, süre baskısının olduğu durumlarda en yakın sahadaki kuryeyi sizin adınıza dakikalar içinde organize eder. Özellikle medikal, teknik ve operasyonel süreçlerde tercih edilir.",
    bullets: [
      "En yakın kurye ile hızlı atama",
      "İşletmeler için öncelikli destek",
      "Acil evrak ve ürün taşıması",
      "7/24 kesintisiz operasyon",
    ],
    deliveryTime: "30-60 dakika",
    seoTitle: "Acil Kurye İstanbul | 7/24 Hizmet",
    seoDescription:
      "Acil kurye İstanbul hizmeti ile gönderilerinizi 30-60 dakikada teslimata çıkarın; 7/24 operasyon, hızlı yönlendirme ve anlık bilgilendirme desteği alın.",
  },
  {
    slug: "gece-kurye",
    title: "Gece Kurye",
    shortDescription:
      "Mesai dışı saatlerde de aktif teslimat ağı ile gece operasyon desteği.",
    longDescription:
      "Gece Kurye servisi, normal çalışma saatleri dışında da teslimat süreçlerinizin devam etmesini sağlar. Restoran, e-ticaret, sağlık ve teknik servis gibi operasyonu durmuyan işler için idealdir.",
    bullets: [
      "Gece ve sabaha karşı aktif ekip",
      "Mesai dışı acil teslimat",
      "Planlı gece sevkiyatları",
      "Aynı kalite ve raporlama",
    ],
    deliveryTime: "45-120 dakika",
    seoTitle: "Gece Kurye İstanbul | Mesai Dışı Teslimat",
    seoDescription:
      "Gece kurye İstanbul hizmeti ile mesai dışı saatlerde de 7/24 güvenli teslimat, hızlı yönlendirme, canlı bilgilendirme ve anında fiyat desteği alın, hemen arayın.",
  },
  {
    slug: "aracli-kurye",
    title: "Araçlı Kurye",
    shortDescription:
      "Büyük hacimli, kırılabilir veya çoklu paket gönderileri için araçlı teslimat.",
    longDescription:
      "Araçlı Kurye hizmeti, moto kurye ile taşınması uygun olmayan ürünler için geliştirilmiştir. Koli, toplu evrak, yedek parça ve e-ticaret çıkışlarında operasyonu hızlandırır.",
    bullets: [
      "Hacimli ürünler için uygun taşıma",
      "Tek seferde çoklu adrese dağıtım",
      "Planlı rota ve zamanlama",
      "Kurumsal dağıtım operasyonu",
    ],
    deliveryTime: "60-180 dakika",
    seoTitle: "Araçlı Kurye İstanbul | Hacimli Gönderi",
    seoDescription:
      "Araçlı kurye İstanbul hizmeti ile hacimli, kırılabilir ve çoklu paket gönderilerinizi güvenli, planlı ve aynı gün teslimat avantajıyla ulaştırın, fiyat alın.",
  },
  {
    slug: "ekspres-kurye",
    title: "Ekspres Kurye",
    shortDescription:
      "İstanbul içi en hızlı teslimat modeli: gönderi alınır alınmaz yola çıkılır, araya başka iş girilmez.",
    longDescription:
      "Ekspres Kurye, zaman marjinin sıfıra yaklaştığı durumlar için tasarlanmış en hızlı teslimat modelidir. Kurye gönderiyi teslim alır almaz direkt hedefe hareket eder; rota optimize edilir, süre kaybı minimuma indirilir. Sözleşme, teklif, numune, anahtarlık, medikal malzeme veya son dakika belge teslimlerinde tercih edilen bu model, İstanbul trafiğinde bile ortalama 20-45 dakika arası tamamlama hedefiyle çalışır.",
    bullets: [
      "Gönderi alınır alınmaz anlık hareket",
      "Tek adrese odaklı, bekleme yok",
      "Optimize rota ile en kısa süre",
      "Anlık konum ve teslimat bildirimi",
      "Kritik belge, medikal ve finans gönderiminize özel",
    ],
    deliveryTime: "20-45 dakika",
    seoTitle: "Ekspres Kurye İstanbul | En Hızlı Teslimat | 34 Moto Kurye İstanbul",
    seoDescription:
      "Ekspres kurye İstanbul hizmeti ile gönderiniz anında yola çıkar; 20-45 dakikada teslimat, 7/24 operasyon ve canlı süreç bilgilendirmesi desteği sağlanır.",
  },
  {
    slug: "vale-ozel-sofor",
    title: "Vale / Özel Şoför",
    shortDescription:
      "Kurumsal transfer, havalimanı karşılama ve özel etkinlikler için profesyonel şoförlü araç hizmeti.",
    longDescription:
      "Vale / Özel Şoför hizmeti; toplantı transferleri, havalimanı karşılama-uğurlama, VIP misafir taşıma ve özel etkinlik ulaşımlarında profesyonel, temiz ve konforlu araç sağlar. Sürücülerimiz kıyafet kuralına uygun, deneyimli ve güvenilirdir. Araç içi konfor, dakiklik ve gizlilik ön plandadır. Kurumsal müşteriler için periyodik anlaşma modelleri de mevcuttur.",
    bullets: [
      "Havalimanı karşılama ve uğurlama",
      "Kurumsal toplantı ve etkinlik transferi",
      "VIP misafir taşıma",
      "Profesyonel, kıyafetli sürücüler",
      "Konforlu ve temiz araç garantisi",
    ],
    deliveryTime: "Talebe göre planlı",
    seoTitle: "Vale Özel Şoför İstanbul | VIP Transfer | 34 Moto Kurye İstanbul",
    seoDescription:
      "İstanbul vale ve özel şoför hizmeti ile havalimanı transferi, kurumsal taşıma ve VIP ulaşım ihtiyaçlarınız güvenli, konforlu ve planlı şekilde karşılanır.",
  },
];

export type District = {
  name: string;
  slug: string;
};

export const districts: District[] = [
  { name: "Adalar", slug: "adalar-moto-kurye" },
  { name: "Arnavutköy", slug: "arnavutkoy-moto-kurye" },
  { name: "Ataşehir", slug: "atasehir-moto-kurye" },
  { name: "Avcılar", slug: "avcilar-moto-kurye" },
  { name: "Bağcılar", slug: "bagcilar-moto-kurye" },
  { name: "Bahçelievler", slug: "bahcelievler-moto-kurye" },
  { name: "Bakırköy", slug: "bakirkoy-moto-kurye" },
  { name: "Başakşehir", slug: "basaksehir-moto-kurye" },
  { name: "Bayrampaşa", slug: "bayrampasa-moto-kurye" },
  { name: "Beşiktaş", slug: "besiktas-moto-kurye" },
  { name: "Beykoz", slug: "beykoz-moto-kurye" },
  { name: "Beylikdüzü", slug: "beylikduzu-moto-kurye" },
  { name: "Beyoğlu", slug: "beyoglu-moto-kurye" },
  { name: "Büyükçekmece", slug: "buyukcekmece-moto-kurye" },
  { name: "Çatalca", slug: "catalca-moto-kurye" },
  { name: "Çekmeköy", slug: "cekmekoy-moto-kurye" },
  { name: "Esenler", slug: "esenler-moto-kurye" },
  { name: "Esenyurt", slug: "esenyurt-kurye" },
  { name: "Eyüpsultan", slug: "eyupsultan-moto-kurye" },
  { name: "Fatih", slug: "fatih-moto-kurye" },
  { name: "Gaziosmanpaşa", slug: "gaziosmanpasa-moto-kurye" },
  { name: "Güngören", slug: "gungoren-moto-kurye" },
  { name: "Kadıköy", slug: "kadikoy-moto-kurye" },
  { name: "Kağıthane", slug: "kagithane-moto-kurye" },
  { name: "Kartal", slug: "kartal-moto-kurye" },
  { name: "Küçükçekmece", slug: "kucukcekmece-moto-kurye" },
  { name: "Maltepe", slug: "maltepe-moto-kurye" },
  { name: "Pendik", slug: "pendik-moto-kurye" },
  { name: "Sancaktepe", slug: "sancaktepe-moto-kurye" },
  { name: "Sarıyer", slug: "sariyer-moto-kurye" },
  { name: "Silivri", slug: "silivri-moto-kurye" },
  { name: "Sultanbeyli", slug: "sultanbeyli-moto-kurye" },
  { name: "Sultangazi", slug: "sultangazi-moto-kurye" },
  { name: "Şile", slug: "sile-moto-kurye" },
  { name: "Şişli", slug: "sisli-moto-kurye" },
  { name: "Tuzla", slug: "tuzla-moto-kurye" },
  { name: "Ümraniye", slug: "umraniye-moto-kurye" },
  { name: "Üsküdar", slug: "uskudar-moto-kurye" },
  { name: "Zeytinburnu", slug: "zeytinburnu-moto-kurye" },
];

export const districtBySlug = new Map(districts.map((item) => [item.slug, item]));

export type DistrictNeighborhood = {
  districtSlug: string;
  districtName: string;
  name: string;
  slug: string;
  path: string;
};

const turkishCharMap: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

const slugifyText = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[çğıöşü]/g, (char) => turkishCharMap[char] || char)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const districtNeighborhoodNameMap = new Map<string, readonly string[]>(
  districtNeighborhoodNamesByDistrictName.map((item) => [item.district, [...item.neighborhoods]]),
);

export const neighborhoodsByDistrictSlug = new Map<string, DistrictNeighborhood[]>(
  districts.map((district) => {
    const neighborhoodNames = districtNeighborhoodNameMap.get(district.name) ?? [];
    const neighborhoods = neighborhoodNames.map((neighborhoodName) => {
      const neighborhoodSlug = slugifyText(neighborhoodName);

      return {
        districtSlug: district.slug,
        districtName: district.name,
        name: neighborhoodName,
        slug: neighborhoodSlug,
        path: `/${district.slug}/${neighborhoodSlug}`,
      };
    });

    return [district.slug, neighborhoods];
  }),
);

export const getNeighborhoodsForDistrict = (districtSlug: string) => {
  return neighborhoodsByDistrictSlug.get(districtSlug) || [];
};

export const getNeighborhoodBySlugs = (districtSlug: string, neighborhoodSlug: string) => {
  return getNeighborhoodsForDistrict(districtSlug).find(
    (item) => item.slug === neighborhoodSlug,
  );
};

export const allDistrictNeighborhoodParams = districts.flatMap((district) =>
  getNeighborhoodsForDistrict(district.slug).map((neighborhood) => ({
    slug: district.slug,
    mahalleSlug: neighborhood.slug,
  })),
);

export const homepageTrustMetrics = [
  {
    value: `${googleBusinessSnapshot.ratingValue}/${googleBusinessSnapshot.bestRating}`,
    label: "Google Isletme Puani",
    detail: "Google uzerindeki gorunen puan ve yerel guven sinyali.",
  },
  {
    value: `${googleBusinessSnapshot.reviewCount}+`,
    label: "Google Degerlendirmesi",
    detail: "Yorum odakli guven olusturan isletme gorunurlugu.",
  },
  {
    value: `${districts.length}`,
    label: "Aktif Ilce",
    detail: "Istanbul genelinde yerel sayfa ve hizmet kapsami.",
  },
  {
    value: `${allDistrictNeighborhoodParams.length}`,
    label: "Mahalle Gorunurlugu",
    detail: "Ilce icindeki mahalle bazli organik erisim yapisi.",
  },
  {
    value: "7/24",
    label: "Operasyon Saati",
    detail: "Gun boyu devam eden kurumsal teslimat akisi.",
  },
  {
    value: "WhatsApp",
    label: "Hizli Talep Kanali",
    detail: "Teklif alma, yonlendirme ve teslim teyidinin ayni akista ilerlemesi.",
  },
] as const;

export const businessProofItems = [
  {
    title: "Arama ve Talep Akisi",
    description:
      "Kullanici arama yaptiginda dogrudan ilgili ilce, mahalle ve hizmet sayfasina ulasir. Bu yapi, hem dogal SEO akisi hem de guven hissi icin merkezi rol oynar.",
  },
  {
    title: "Kurumsal Operasyon Disiplini",
    description:
      "Talep alma, uygun ekip secimi, rota planlama ve teslim teyidi ayni operasyon dilinde ilerler. Eski ve oturmus bir isletme hissi veren taraf tam olarak bu surec tutarliligidir.",
  },
  {
    title: "Teslim Edilen Isin Gorunurlugu",
    description:
      "Google Isletme puani, yorum akisları, gercek fotograflar ve mahalle bazli sayfalar birlikte kullanildiginda hizmetin sadece anlatilan degil, gorulebilen bir isletme oldugu anlasilir.",
  },
] as const;

export const aiVisibilityPrinciples = [
  {
    title: "Kapsamli ve Ozgun Icerik",
    description:
      "Her ilce, mahalle, hizmet ve SSS sayfasi tek bir ana sayfa metnini tekrar etmez. Kullanici niyetine gore daha detayli ve yerel anlatim sunmak, arama motorlari ve AI sistemleri icin daha anlamli bir kaynak olusturur.",
  },
  {
    title: "Otorite ve Guvenilirlik",
    description:
      "Google Isletme puani, gercek fotograflar, kurumsal iletisim bilgileri, ilce-mahalle kapsam yapisi ve kaynak sayfalari birlikte kullanildiginda site daha kurumsal ve daha guvenilir gorunur.",
  },
  {
    title: "Schema ve Makinece Okunabilirlik",
    description:
      "WebSite, LocalBusiness, FAQPage, ItemList ve hizmet odakli yapilandirilmis veriler sayesinde sitenin ne anlattigi sadece kullaniciya degil, arama motorlarina ve AI modellerine de daha net aktarilir.",
  },
] as const;

export const commonDeliveredItems = [
  "Evrak ve sozlesme teslimi",
  "Acil yedek parca gonderisi",
  "E-ticaret paket cikisi",
  "Kurumsal ofis evraki akisi",
  "Numune ve teknik servis gonderisi",
  "Cok adresli dagitim planlari",
] as const;

export const commonSearchIntents = [
  "istanbul moto kurye",
  "acil kurye",
  "ekspres kurye",
  "ayni gun teslimat",
  "vip kurye",
  "gece kurye",
] as const;

const contentHash = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const rotateSelection = <T,>(items: readonly T[], count: number, seedValue: string) => {
  if (items.length <= count) {
    return [...items];
  }

  const pool = [...items];
  const results: T[] = [];
  let seed = contentHash(seedValue);

  while (pool.length > 0 && results.length < count) {
    const index = seed % pool.length;
    results.push(pool.splice(index, 1)[0]);
    seed = Math.floor(seed / 7) + 17;
  }

  return results;
};

const humanJoin = (items: readonly string[]) => {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} ve ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`;
};

const getDistrictNeighborhoodNames = (districtName: string) => {
  return [...(districtNeighborhoodNameMap.get(districtName) ?? [])];
};

const getServiceHighlights = (seedValue: string, count = 2) => {
  return rotateSelection(services.map((service) => service.title), count, seedValue);
};

export type GeneratedFaqItem = {
  question: string;
  answer: string;
};

export const getFeaturedNeighborhoodsForDistrict = (districtName: string, count = 6) => {
  return rotateSelection(
    getDistrictNeighborhoodNames(districtName),
    count,
    `${districtName}-featured-neighborhoods-public`,
  );
};

export const getNearbyNeighborhoods = (districtName: string, neighborhoodName: string, count = 6) => {
  return rotateSelection(
    getDistrictNeighborhoodNames(districtName).filter((item) => item !== neighborhoodName),
    count,
    `${districtName}-${neighborhoodName}-nearby-public`,
  );
};

export const buildDistrictMetadataDescription = (districtName: string) => {
  const featuredNeighborhoods = getFeaturedNeighborhoodsForDistrict(districtName, 3);
  const serviceHighlights = getServiceHighlights(`${districtName}-meta-services`, 2);

  return `${districtName} moto kurye hizmetinde ${humanJoin(featuredNeighborhoods)} gibi hareketli mahallelerde ${humanJoin(serviceHighlights).toLowerCase()} ve ayni gun teslimat icin 7/24 hizli fiyat alin.`;
};

export const buildNeighborhoodMetadataDescription = (districtName: string, neighborhoodName: string) => {
  const nearbyNeighborhoods = getNearbyNeighborhoods(districtName, neighborhoodName, 2);
  const serviceHighlights = getServiceHighlights(`${districtName}-${neighborhoodName}-meta-services`, 2);
  const nearbyLine = nearbyNeighborhoods.length > 0 ? ` ${humanJoin(nearbyNeighborhoods)} yakininda` : "";

  return `${districtName} ${neighborhoodName} bolgesinde${nearbyLine} ${humanJoin(serviceHighlights).toLowerCase()} ve ayni gun teslimat icin 7/24 hizli kurye yonlendirmesi alin.`;
};

export const buildDistrictMiniFaq = (districtName: string): GeneratedFaqItem[] => {
  const featuredNeighborhoods = getFeaturedNeighborhoodsForDistrict(districtName, 3);

  return [
    {
      question: `${districtName} icinde kurye ne kadar surede yonlendirilir?`,
      answer: `${districtName} icindeki talep yogunluguna ve adresin konumuna gore degismekle birlikte ilk yonlendirme genellikle kisa surede yapilir. Ozellikle ${humanJoin(featuredNeighborhoods)} gibi aktif noktalarda ekip planlamasi daha hizli netlestirilir.`,
    },
    {
      question: `${districtName} ilcesinde hangi kurye modelleri daha cok tercih edilir?`,
      answer: `${districtName} tarafinda en cok moto kurye, acil kurye ve ekspres odakli talepler gelir. Gonderi tipi buyudukce veya coklu teslimat gerektiginde aracli ya da planli dagitim modeli de devreye alinabilir.`,
    },
    {
      question: `${districtName} icin kurumsal duzenli teslimat kurulabilir mi?`,
      answer: `Evet. ${districtName} bolgesinde duzenli sevkiyat yapan firmalar icin sabit iletisim akisi, periyodik siparis duzeni ve mahalle bazli rota plani kurulabilir. Bu yapi operasyon tekrarlarini daha hizli hale getirir.`,
    },
    {
      question: `${districtName} tarafinda gece ve hafta sonu hizmet veriliyor mu?`,
      answer: `Evet. ${districtName} icin gece, hafta sonu ve resmi tatil taleplerinde de aktif operasyon planlanabilir. Zaman araligini net ilettiginizde uygun ekip ve hizmet modeli hizlica belirlenir.`,
    },
  ];
};

export const buildNeighborhoodMiniFaq = (districtName: string, neighborhoodName: string): GeneratedFaqItem[] => {
  const nearbyNeighborhoods = getNearbyNeighborhoods(districtName, neighborhoodName, 3);

  return [
    {
      question: `${districtName} ${neighborhoodName} icin kurye cagirdigimda surec nasil baslar?`,
      answer: `${districtName} ${neighborhoodName} talebinde once alis ve teslim adresleri netlestirilir, ardindan en uygun saha ekibi secilir. Mahalle icindeki erisim notlari baslangicta toplandigi icin surec daha duzgun ilerler.`,
    },
    {
      question: `${neighborhoodName} bolgesinde ayni gun teslimat yapiliyor mu?`,
      answer: `Evet. ${neighborhoodName} odakli taleplerde gonderi tipi ve saat araligina gore ayni gun teslimat planlanir. ${humanJoin(nearbyNeighborhoods)} gibi yakin bolgelerle ayni rota icine alinabilen senaryolarda operasyon daha da verimli hale gelir.`,
    },
    {
      question: `${neighborhoodName} icin hangi gonderiler daha sik tasinir?`,
      answer: `${neighborhoodName} tarafinda en sik evrak, e-ticaret paketi, numune, yedek parca ve kurumsal belge tasinmaktadir. Gonderinin hassasiyetine gore uygun kurye modeli secilerek teslim guvenligi korunur.`,
    },
    {
      question: `${districtName} ${neighborhoodName} teslimatlarinda takip nasil yapilir?`,
      answer: `Teslimat boyunca WhatsApp uzerinden cikis, yolda olma ve teslim tamamlama adimlari paylasilabilir. Gerektiginde alici teyidi veya teslim notu da operasyona eklenir.`,
    },
  ];
};

const districtParagraphTemplates = [
  "{district} bölgesinde kurye ihtiyacı tek bir teslim modeliyle yönetilemeyecek kadar çeşitlidir. İlçe içindeki hareketlilik, günün saati ve gönderi tipi bir arada değerlendirilir. Bu nedenle operasyonu yalnızca mesafe hesabıyla değil, saha yoğunluğu ve teslim önceliğiyle birlikte planlıyoruz.",
  "{district} içinde aynı gün teslimat taleplerinde en kritik nokta, çıkış hızından önce doğru eşleşmedir. Evrak, e-ticaret paketi, yedek parça ya da kurumsal evrak gibi farklı senaryolarda farklı akışlar kullanıyoruz. Bu da hem gereksiz beklemeyi azaltır hem teslimat kalitesini daha tutarlı hale getirir.",
  "{district} ilçesinde özellikle {focusNeighborhood} ve {secondaryNeighborhood} gibi hareketli bölgelerde kurye planlaması daha dikkatli yapılmalıdır. Sokak yoğunluğu, plaza giriş prosedürleri ve alıcıya erişim kolaylığı teslim süresini doğrudan etkiler. Ekiplerimiz bu mikro farkları ilk planlama anında hesaba katar.",
  "{district} tarafında talep toplama aşamasında adres, kat bilgisi, teslim kişisi ve zaman aralığını netleştirmemiz boş bekleme ihtimalini azaltır. Bu disiplin özellikle hız hassasiyeti olan gönderilerde operasyonu daha akıcı hale getirir. Kullanıcının 'kurye nerede' sorusunu daha az sorması da bu netlikten kaynaklanır.",
  "{district} bölgesinde en sık tercih edilen modeller arasında {serviceList} öne çıkar. Her model aynı kullanıcı niyetine hitap etmez; bazıları beklemesiz çıkış, bazıları ise planlı ama güvenli dağıtım ister. Doğru hizmet tipini başta belirlemek teslimat sonucunu doğrudan iyileştirir.",
  "{district} genelinde {neighborhoodList} gibi farklı teslim ritmine sahip mahalleler birlikte ele alınır. Tek bir ilçe adı altında aynı operasyon mantığını kullanmak çoğu zaman verimli olmaz. Bu yüzden ilçe içinde mahalle bazlı deneyimi de plana dahil ediyoruz.",
  "Kurumsal müşteriler için {district} sadece bir harita noktası değil, tekrar eden teslim kalıplarının olduğu aktif bir operasyon alanıdır. Düzenli sevkiyat yapan işletmelerde hangi saatlerde yoğunluk oluştuğunu, hangi noktalarda resepsiyon ya da güvenlik prosedürü bulunduğunu bilmek önemli avantaj sağlar.",
  "{district} bölgesinde kurye fiyatlandırmasını da operasyon gerçekliğine göre ele alıyoruz. Mesafe, hizmet tipi ve teslim önceliği netleştiğinde şeffaf bir yönlendirme sunmak hem kullanıcı güvenini artırır hem gereksiz teklif trafiğini azaltır. Özellikle sık gönderi yapan firmalarda bu yapı daha sürdürülebilir olur.",
  "34 Moto Kurye İstanbul için {district} sayfası yalnızca arama motoru görünürlüğü değil, gerçek bir yerel hizmet anlatımı anlamına gelir. WhatsApp ile hızlı teklif, telefonla anlık yönlendirme ve teslim sonrası teyit akışı birlikte ilerlediğinde kullanıcı deneyimi de daha organik hale gelir. Uzun vadede tekrar eden siparişler tam olarak bu operasyon bütünlüğünden doğar.",
] as const;

const neighborhoodParagraphTemplates = [
  "{district} {neighborhood} bölgesinde moto kurye talebinde en kritik konu hız kadar teslimatın doğru adrese ilk seferde ulaşmasıdır. Sokak, bina ve teslimat notu doğrulamasını siparişin ilk dakikasında netleştirmek saha hatalarını azaltır ve teslim süresini daha öngörülebilir hale getirir.",
  "{neighborhood} odaklı operasyon planında trafik yoğunluğu, kurye müsaitliği ve gönderi tipi birlikte değerlendirilir. Bu sayede {district} içinde tek adrese hızlı çıkış, çok adresli dağıtım veya acil model arasında doğru seçim daha kısa sürede yapılır.",
  "{district} {neighborhood} moto kurye hizmetimizde sık karşılaşılan ihtiyaçlar arasında {serviceList} öne çıkar. Her biri farklı teslim temposu istediği için standart bir akış yerine esnek bir operasyon kurgusu kullanıyoruz.",
  "{neighborhood} mahallesinde kurye hizmeti alırken gönderi içeriğinin doğru bildirilmesi rota ve taşıma modelini güçlendirir. Evrak, numune, yedek parça ve e-ticaret paketleri için farklı operasyon akışları kullanılarak teslimat güvenliği korunur.",
  "{district} bölgesindeki kurumsal müşteriler için {neighborhood} özelinde periyodik kurye planı oluşturulabilir. Bu model günlük sipariş açılış hızını artırır ve düzenli sevkiyatlarda maliyet kontrolünü daha öngörülebilir hale getirir.",
  "{neighborhood} için sunduğumuz 7/24 hizmette gece operasyonu da gündüz standartlarında yürütülür. Acil evrak, medikal içerik veya zaman kritik gönderilerde en uygun ekip öncelikli atanarak teslimat sürekliliği sağlanır.",
  "{district} {neighborhood} teslimatlarında alıcıya ulaşılamaması gibi senaryolar için hızlı teyit akışı uygulanır. Alternatif teslim kişisi veya saat bilgisi anlık güncellenerek operasyonun kesintiye uğraması engellenir.",
  "{neighborhood} mahallesi için geliştirdiğimiz mikro bölge yaklaşımı, yol bilgisi ve saha deneyimini birleştirir. Bu sayede navigasyonun yetersiz kaldığı anlarda bile kurye rotası dinamik şekilde optimize edilerek aynı gün teslimat performansı korunur.",
  "{neighborhood} ile birlikte {nearbyNeighborhoods} hattında oluşan teslim akışı, ilçe içi rota planlamasında önemli rol oynar. Bu tür yakın bölge kümeleri özellikle gün içi çoklu teslimatlarda zaman kaybını azaltır ve kurye yönlendirmesini daha akıllı hale getirir.",
] as const;

const fillDistrictTemplate = (
  template: string,
  districtName: string,
  neighborhoods: string[],
  serviceHighlights: string[],
) => {
  const selectedNeighborhoods = rotateSelection(neighborhoods, 4, `${districtName}-district-neighborhoods`);
  const [focusNeighborhood = districtName, secondaryNeighborhood = districtName] = selectedNeighborhoods;

  return template
    .replaceAll("{district}", districtName)
    .replaceAll("{focusNeighborhood}", focusNeighborhood)
    .replaceAll("{secondaryNeighborhood}", secondaryNeighborhood)
    .replaceAll("{serviceList}", humanJoin(serviceHighlights))
    .replaceAll("{neighborhoodList}", humanJoin(selectedNeighborhoods));
};

const fillNeighborhoodTemplate = (
  template: string,
  districtName: string,
  neighborhoodName: string,
  nearbyNeighborhoods: string[],
  serviceHighlights: string[],
) => {
  return template
    .replaceAll("{district}", districtName)
    .replaceAll("{neighborhood}", neighborhoodName)
    .replaceAll("{serviceList}", humanJoin(serviceHighlights))
    .replaceAll("{nearbyNeighborhoods}", humanJoin(nearbyNeighborhoods));
};

export const buildNeighborhoodSeoArticle = (districtName: string, neighborhoodName: string) => {
  const districtNeighborhoods = getDistrictNeighborhoodNames(districtName).filter((item) => item !== neighborhoodName);
  const nearbyNeighborhoods = rotateSelection(
    districtNeighborhoods,
    3,
    `${districtName}-${neighborhoodName}-nearby`,
  );
  const serviceHighlights = getServiceHighlights(`${districtName}-${neighborhoodName}-services`);

  return rotateSelection(
    neighborhoodParagraphTemplates,
    7,
    `${districtName}-${neighborhoodName}-paragraphs`,
  ).map((template) =>
    fillNeighborhoodTemplate(template, districtName, neighborhoodName, nearbyNeighborhoods, serviceHighlights),
  );
};

export const buildDistrictSeoArticle = (districtName: string) => {
  const neighborhoods = getDistrictNeighborhoodNames(districtName);
  const serviceHighlights = getServiceHighlights(`${districtName}-services`, 3);
  const paragraphs = rotateSelection(
    districtParagraphTemplates,
    8,
    `${districtName}-district-paragraphs`,
  ).map((template) => fillDistrictTemplate(template, districtName, neighborhoods, serviceHighlights));

  const featuredNeighborhoods = rotateSelection(neighborhoods, 5, `${districtName}-featured-neighborhoods`);
  const extraParagraph = `34 Moto Kurye İstanbul, ${districtName} merkezli teslimat taleplerinde tek bir kanal yerine bütünleşik bir iletişim modeli sunar. WhatsApp hızlı fiyat alma akışı, telefonla anlık operasyon yönetimi ve teslimat sonrası teyit adımları bir arada çalışır. ${humanJoin(featuredNeighborhoods)} gibi ilçe içinde farklı teslim karakterine sahip bölgelerde bu bütünlük, hem bireysel hem kurumsal gönderilerde daha doğal ve sürdürülebilir bir hizmet standardı oluşturur.`;

  return [...paragraphs, extraParagraph];
};

export const faqItems = [
  {
    question: "Kurye ne kadar sürede gelir?",
    answer:
      "Talep yoğunluğuna ve ilçeye göre değişmekle birlikte ortalama 15-30 dakika içinde kurye yönlendirmesi yapılır.",
    tags: ["genel", "sabah", "öğlen"],
  },
  {
    question: "Gece saatlerinde hizmet veriyor musunuz?",
    answer:
      "Evet. 34 Moto Kurye İstanbul 7/24 çalışır. Gece kurye hizmetinde de süreç takibi ve teslimat bilgilendirmesi devam eder.",
    tags: ["genel", "gece"],
  },
  {
    question: "Ödeme nasıl yapılıyor?",
    answer:
      "Bireysel gönderilerde havale/EFT veya nakit, kurumsal müşterilerde anlaşmaya bağlı periyodik ödeme seçenekleri sunulur.",
    tags: ["genel", "sabah", "öğlen"],
  },
  {
    question: "Hangi gönderiler taşınıyor?",
    answer:
      "Evrak, paket, numune, yedek parça, e-ticaret ürünü gibi moto veya araçlı taşımaya uygun gönderiler taşınmaktadır.",
    tags: ["genel", "öğlen"],
  },
  {
    question: "İstanbul'un her ilçesine hizmet veriyor musunuz?",
    answer:
      "Evet. Avrupa ve Anadolu yakası dahil İstanbul'un 39 ilçesinin tamamına aktif saha ekibimizle hizmet veriyoruz.",
    tags: ["genel", "sabah"],
  },
  {
    question: "Kurye fiyatı nasıl belirleniyor?",
    answer:
      "Fiyat; mesafe, hizmet tipi (moto/araçlı/VIP) ve gönderi içeriğine göre belirlenir. WhatsApp'tan adres paylaşarak anında fiyat alabilirsiniz.",
    tags: ["genel", "sabah", "öğlen"],
  },
  {
    question: "Aynı gün teslimat mümkün mü?",
    answer:
      "Evet. Tüm standart siparişlerimiz aynı gün teslim edilir. Ekspres ve acil modellerde teslimat 20-45 dakika içinde tamamlanabilir.",
    tags: ["genel", "sabah"],
  },
  {
    question: "Kurye takibi yapabilir miyim?",
    answer:
      "Gönderi başladığında WhatsApp üzerinden bilgilendirme yapılır. Kurye süreciniz boyunca ulaşılabilir durumda olur.",
    tags: ["genel", "öğlen", "akşam"],
  },
  {
    question: "VIP kurye ile normal kurye arasındaki fark nedir?",
    answer:
      "VIP kurye hizmetinde sürücü yalnızca sizin gönderinizle ilgilenir, araya başka bir teslimat alınmaz. Kritik evrak ve sözleşme teslimlerinde tercih edilir.",
    tags: ["öğlen", "akşam"],
  },
  {
    question: "Araçlı kurye ne zaman tercih edilmeli?",
    answer:
      "Büyük hacimli, kırılabilir veya çoklu paket gönderilerinde araçlı kurye tercih edilir. Moto kurye ile taşınamayacak ürünler bu modelle gönderilir.",
    tags: ["öğlen", "akşam"],
  },
  {
    question: "Kurumsal anlaşma yapılabiliyor mu?",
    answer:
      "Evet. Düzenli sevkiyat ihtiyacı olan işletmeler için periyodik anlaşma modelleri sunuyoruz. Detaylar için WhatsApp veya telefon ile bize ulaşabilirsiniz.",
    tags: ["sabah", "öğlen"],
  },
  {
    question: "Evrak taşıma yapıyor musunuz?",
    answer:
      "Evet. Sözleşme, teklif, fatura, noter belgesi gibi tüm evrak türleri özenle taşınmaktadır. VIP ve Ekspres modeller bu tür gönderiler için idealdir.",
    tags: ["sabah", "öğlen"],
  },
  {
    question: "Medikal ve ilaç taşıması yapılıyor mu?",
    answer:
      "Evet. Soğuk zincir gerektirmeyen tıbbi malzeme, ilaç ve numune gönderileri taşınmaktadır. Acil Kurye modeliyle öncelikli atama yapılır.",
    tags: ["sabah", "gece"],
  },
  {
    question: "Havalimanı transferi hizmeti var mı?",
    answer:
      "Evet. Vale / Özel Şoför hizmetimizle İstanbul Havalimanı ve Sabiha Gökçen'e karşılama ve uğurlama transferi yapılmaktadır.",
    tags: ["sabah", "akşam", "gece"],
  },
  {
    question: "Gönderim için minimum bir miktar var mı?",
    answer:
      "Hayır. Tek bir zarftan büyük hacimli paketlere kadar her boyut kabul edilmektedir. Ağırlık ve boyut bilgisine göre uygun model önerilir.",
    tags: ["genel", "akşam"],
  },
  {
    question: "Sipariş nasıl verilir?",
    answer:
      "WhatsApp hattımıza alış ve teslimat adresini yazmanız yeterlidir. Birkaç dakika içinde fiyat ve kurye bilgisi dönülür.",
    tags: ["genel", "sabah"],
  },
  {
    question: "İptal veya değişiklik yapabilir miyim?",
    answer:
      "Kurye henüz yola çıkmadan iptal veya adres değişikliği yapılabilir. Bunun için WhatsApp veya telefon ile anında ulaşmanız yeterlidir.",
    tags: ["öğlen", "akşam"],
  },
  {
    question: "Gönderim sırasında ürün zarar görürse ne olur?",
    answer:
      "Taşıma sırasında oluşan hasarlarda gönderi değeri üzerinden sorumluluk alınır. Değerli gönderiler için önceden bilgi verilmesi önerilir.",
    tags: ["öğlen", "akşam"],
  },
  {
    question: "Hafta sonu ve resmi tatillerde çalışıyor musunuz?",
    answer:
      "Evet. 34 Moto Kurye İstanbul hafta sonu, resmi tatil ve bayram günleri dahil yılın 365 günü 7/24 aktif olarak hizmet vermektedir.",
    tags: ["gece", "akşam"],
  },
  {
    question: "Alıcı evde yoksa teslimat nasıl yapılır?",
    answer:
      "Alıcıya ulaşılamadığında önce telefon ile bildirim yapılır. Alternatif teslim saati veya yetkilendirilmiş kişi belirlenebilir.",
    tags: ["akşam", "gece"],
  },
];
