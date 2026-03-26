const fs = require("fs");
const path = require("path");

const addresses = require("../clean-upload/addresses.json");

const STORE_PATH = path.join(process.cwd(), "data", "blog", "seo-daily-posts.json");

const keywords = [
  "kurye",
  "aracli kurye",
  "acil kurye",
  "moto kurye",
  "hizli kurye",
  "ayni gun teslimat",
  "ekspres kurye",
  "sehir ici kurye",
  "guvenilir kurye",
  "kurye hizmeti",
  "kurye fiyatlari",
  "evrak kurye",
  "e-ticaret kurye",
  "vip kurye",
  "7/24 kurye",
  "Istanbul kurye",
  "araba kurye",
  "buyuk paket kurye",
  "kapidan kapiya kurye",
  "online kurye cagir",
  "aninda kurye",
  "profesyonel kurye",
  "kurye firmasi",
  "guvenli teslimat",
  "bireysel kurye",
  "gun ici teslimat",
  "ekspres teslimat",
  "hizli gonderi cozumleri",
  "profesyonel lojistik kurye",
];

const normalize = (value) =>
  String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const uniqueNeighborhoods = () => {
  const seen = new Set();
  const rows = [];
  addresses.forEach((item) => {
    if (!item.district || !item.neighborhood) return;
    const key = `${normalize(item.district)}__${normalize(item.neighborhood)}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push(item);
  });
  return rows;
};

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
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const pick = (list, rand) => list[Math.floor(rand() * list.length)];

const ensureStore = () => {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ posts: [] }, null, 2), "utf8");
  }
};

const readStore = () => {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
};

const writeStore = (data) => {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
};

const dateKey = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const pickNeighborhoodsForDate = (all, key, count) => {
  const seed = key.split("-").join("");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  const start = hash % all.length;
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(all[(start + i) % all.length]);
  }
  return out;
};

const buildDoc = ({ district, neighborhood, key, index, type }) => {
  const seed = hashCode(`${district}-${neighborhood}-${key}-${index}-${type}`);
  const rand = seeded(seed);
  const mainKeyword = pick(keywords, rand);
  const location = `${district} ${neighborhood}`.trim();
  const slug = `${normalize(location)}-${normalize(mainKeyword)}-${key}-${index}`;
  const h1 =
    type === "service"
      ? `Istanbul ${mainKeyword} Hizmeti: ${location} Bolgesinde Profesyonel Cozum`
      : `Istanbul ${mainKeyword} Rehberi: ${location} Icin Guvenli ve Hizli Teslimat`;
  const intro = `Istanbul ${mainKeyword} aramalarinda ${location} bolgesi icin dogru sonuc, hiz ve operasyon disiplinini birlikte yurutmektir. Bu icerik, kurye planlamasini guclendiren pratik adimlari, guvenli teslimat akisinin temel kurallarini ve donusum odakli kurye cagirma surecini adim adim anlatir. ${mainKeyword} ihtiyaci ortaya ciktiginda plansiz yonlendirme yerine bolgeye uygun rota, net adres teyidi ve surec bilgilendirmesi ile hareket etmek hem sureyi kisaltir hem de teslimat basarisini artirir.
\nKullanici tarafinda en kritik konu, siparis verildikten sonra surecin gorunur kalmasidir. Bu nedenle basarili bir ${mainKeyword} deneyimi; alinma zamani, tahmini varis suresi ve teslim teyidi adimlarinin acik sekilde iletilmesiyle tamamlanir. ${location} icindeki farkli mahalle giris cikis kosullari, trafik yogunlugu ve bina prosedurleri dikkate alindiginda operasyon kalitesi sadece hiz degil, dogru koordinasyonla olculur.`;
  const sectionBodies = [
    `${location} icinde ${mainKeyword} talebinde once adres teyidi, teslim kisi bilgisi ve gonderi tipi netlestirilmelidir. Dogru bilgi akisi, sahadaki gecikmeleri azaltir ve teslim surecini olculebilir hale getirir. Ofis, plaza, hastane veya site gibi farkli teslim noktalarinda giris prosedurleri degistigi icin operasyon baslangicinda bu notlarin toplanmasi kritik onemdedir.\n\nKurye hizmeti sadece paketi almak ve bir adrese birakmak degildir; dogru zamanlama ile dogru ekip yonlendirilmediginde en yakin mesafede bile beklenmedik gecikmeler olusabilir. Bu nedenle ${mainKeyword} modelinde cikis zamani, teslim saat araligi, aliciya ulasim kolayligi ve aciliyet seviyesi birlikte degerlendirilir.\n\nOzellikle acil gonderi, evrak kurye, e-ticaret kurye ve buyuk paket kurye taleplerinde tek tip operasyon yerine gonderi temelli yonetim uygulanir. Bu yaklasim, ${location} bolgesinde hem bireysel kurye hem de sirketler icin kurye operasyonlarinda daha guvenli ve hizli teslimat sonucunu destekler.\n\nSaha tarafinda sureklilik saglamak icin standart operasyon checklisti kullanmak gerekir. Alim saati, paket durumu, teslim kisi notu ve geri bildirim adimlari ayni formatta tutuldugunda ekip degisse bile hizmet kalitesi korunur ve tekrar eden operasyon hatalari belirgin sekilde azalir.`,
    `Istanbul trafigi saat bazli degistigi icin ${location} cikisli operasyonlarda alternatif rota planlamasi onemlidir. Acil kurye taleplerinde ekspres akis one cikarken, gun ici teslimat ve cok adresli dagitim senaryolarinda rota dagitimi daha verimli sonuc verir.\n\nAyni gun teslimat hedefi olan gonderilerde trafiğin yogun oldugu saatlerde dogru siralama yapilmazsa toplam sure gereksiz sekilde uzar. Bu nedenle kurye firmasi tarafinda mahalle bazli yol bilgisi ve trafik tecrubesi olan ekiplerle calismak, arama sonucundan siparis donusumune kadar tum sureci guclendirir.\n\n${mainKeyword} operasyonu planlanirken araba kurye, motorlu kurye veya aracli kurye seciminin gonderi hacmine gore yapilmasi gerekir. Agir yuk kurye veya buyuk paket kurye talepleri ile evrak kurye taleplerinin ayni operasyon disipliniyle yonetilmesi performansi dusurur; dogru model secimi ise maliyet ve sure dengesini optimize eder.\n\nRota kararinda sadece mesafe degil, park uygunlugu ve bina erisim hizi da degerlendirilmelidir. Bu detaylar operasyon basinda hesaplandiginda teslimata yakin noktada zaman kaybi azalir, ekip gun icinde daha fazla teslimati guvenli sekilde tamamlayabilir.`,
    `${mainKeyword} hizmetinde maliyet ve sure dengesi birlikte ele alinmalidir. Gonderi tipi, agirlik, saat araligi ve bolge yogunlugu operasyon modelini belirleyen temel kriterlerdir. Uygun fiyatli kurye ararken sadece rakama odaklanmak yerine teslimat garantisi, operasyon kalitesi ve iletisim hizina da dikkat etmek gerekir.\n\nKurye fiyatlari, talep edilen hizmetin niteligine gore farklilasir. Gece kurye, 7/24 kurye, ekspres teslimat veya sehirler arasi kurye talepleri ayni tarifede degerlendirilemez. Bu noktada net adres bilgisi ve gonderi icerigi paylasildiginda hem daha dogru teklif hem de daha hizli planlama saglanir.\n\n${location} bolgesinde online kurye cagir ve kurye siparisi ver surecinde kullanicinin en cok bekledigi sey, tahmini teslim saatinin gercek operasyonla uyumlu olmasidir. Profesyonel kurye sirketi yaklasimi, bu beklentiyi sadece vaatle degil, surec ici bilgilendirme ve rota esnekligi ile destekleyerek yerine getirir.\n\nFiyat dengesini korumanin en etkili yolu, hizmet tipini dogru secmektir. Acil olmayan gonderiyi planli dagitima almak veya cok adresli teslimati tek rota altinda birlestirmek hem birim maliyeti dusurur hem de operasyonel sureklilik acisindan daha saglikli bir yapi kurar.`,
    `${location} bolgesinde kurye operasyonunun guvenilir olmasi icin musteriye alim, yolda ve teslim bildirimi duzenli iletilmelidir. Bu seffaflik, musteri memnuniyetini ve teslim basarisini artirir. Kurye sirketi tarafinda duzenli bilgilendirme oldugunda hem bireysel kullanicilar hem de ticari kurye ihtiyaci olan markalar sureci daha rahat yonetir.\n\nGuvenli teslimat adimlarinda alici dogrulamasi, teslimat notu kontrolu ve gerekirse imza teyidi gibi detaylar devreye alinmalidir. Ozel kurye ve VIP kurye taleplerinde bu kontroller daha da onem kazanir; cunku gonderinin degeri arttikca operasyon hassasiyeti de artar.\n\nSon olarak, ${mainKeyword} operasyonunda donusum odakli yaklasim sadece SEO metniyle degil, sayfa icindeki net CTA ile tamamlanir. Kullanicinin bir sonraki adimi hemen atabilmesi icin WhatsApp destek ve arama butonlarinin gorunur, acik ve guven veren bir dilde sunulmasi gereklidir. Bu yapi, organik trafikten gercek siparise gecis oranini yukselten en guclu unsurdur.\n\nEk olarak teslimat sonu kisa memnuniyet geri bildirimi toplamak, operasyonu surekli iyilestirmek icin cok degerlidir. Hangi saatlerde gecikme oldugu, hangi mahallelerde ekstra not gerektigi ve hangi hizmet tipinin daha yuksek donusum getirdigi bu geri bildirimlerle netlesen verilerdir.`,
  ];

  const serviceDetails = [
      `${location} icin ${mainKeyword} hizmetinde adresten alim, rota planlama ve teslim teyidi tek bir operasyon akisinda yonetilir.`,
      "Acil kurye ve ekspres kurye talepleri onceliklendirilir; ayni gun teslimat icin sahadaki uygun ekip dogrudan yonlendirilir.",
      "Kurumsal gonderilerde gunluk ve haftalik planli dagitim modeli ile sirketler icin kurye sureci daha kontrollu hale getirilir.",
      "Evrak kurye, paket teslimati, e-ticaret kurye ve agir yuk kurye talepleri gonderi tipine uygun arac secimi ile tamamlanir.",
      "Gece kurye ve hafta sonu operasyonlarinda 7/24 kurye modeli ile kesintisiz hizmet sunulur.",
    ];

  const faqs = [
    {
      question: `${mainKeyword} ile ayni gun teslimat mumkun mu?`,
      answer: "Evet. Talebin saatine ve bolgesel yogunluga gore ayni gun teslimat planlanir.",
    },
    {
      question: "Kurye siparisi vermek icin hangi bilgiler gerekli?",
      answer: "Alis teslim adresleri, alici telefonu, gonderi tipi ve aciliyet bilgisi yeterlidir.",
    },
    {
      question: "Gece ve hafta sonu kurye var mi?",
      answer: "Evet, operasyon uygunluguna gore gece ve hafta sonu teslimat hizmeti sunulur.",
    },
    {
      question: "Kurye fiyatlari nasil hesaplanir?",
      answer: "Mesafe, gonderi tipi, aciliyet seviyesi ve saat araligi fiyatlandirma uzerinde etkilidir.",
    },
  ];

  const sectionTitles = [
    `${mainKeyword} operasyonunda planlama`,
    `Istanbul ${mainKeyword} akis modeli`,
    `${mainKeyword} hizmetinde hata onleme`,
    `Guvenli teslimat ve musteri bilgilendirmesi`,
  ];

  return {
    slug,
    type,
    dateKey: key,
    district,
    neighborhood,
    location,
    mainKeyword,
    h1,
    intro,
    sectionTitles,
    sectionBodies,
    serviceDetails,
    advantages: [
      "Hizli siparis ve net operasyon akisi",
      "Acil ve planli teslimat modellerinde esneklik",
      "Istanbul trafigine uygun rota planlamasi",
      "Kurumsal ve bireysel taleplerde guvenli teslimat",
      "Teslimat sonu dogrulama ve bilgilendirme",
    ],
    faqs,
    cta: "Hemen kurye cagirmak ve siparis olusturmak icin WhatsApp veya telefon hatti uzerinden iletisime gecin.",
    lsiKeywords: [
      `Istanbul ${mainKeyword}`,
      "kurye hizmeti",
      "acil gonderi",
      "hizli teslimat hizmeti",
      "kapidan kapiya kurye",
      "online kurye cagir",
    ],
    imageUrl: `https://source.unsplash.com/1600x900/?${encodeURIComponent(`istanbul courier delivery ${district} ${neighborhood}`)}`,
    wordCount: `${h1} ${intro} ${sectionTitles.join(" ")} ${sectionBodies.join(" ")} ${serviceDetails.join(" ")} ${faqs.map((f) => `${f.question} ${f.answer}`).join(" ")} ${mainKeyword} ${location}`
      .split(/\s+/)
      .filter(Boolean).length,
    createdAt: new Date().toISOString(),
  };
};

const run = () => {
  const targetCount = Number(process.argv[2] || 18);
  const key = dateKey();
  const store = readStore();
  const existing = new Set(store.posts.map((post) => post.slug));

  const allNeighborhoods = uniqueNeighborhoods();
  const selected = pickNeighborhoodsForDate(allNeighborhoods, key, targetCount);
  const generated = [];

  selected.forEach((item, index) => {
    const type = index % 2 === 0 ? "blog" : "service";
    const doc = buildDoc({
      district: item.district,
      neighborhood: item.neighborhood,
      key,
      index: index + 1,
      type,
    });

    if (!existing.has(doc.slug)) {
      store.posts.push(doc);
      generated.push(doc);
    }
  });

  store.posts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  writeStore(store);

  console.log(`date=${key}`);
  console.log(`generated=${generated.length}`);
  console.log(`total=${store.posts.length}`);
};

run();
