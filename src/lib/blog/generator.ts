import { defaultOrderMessage, districts, services, SITE, whatsappLink } from "@/lib/site-data";
import { type BlogGenerationResult } from "@/lib/blog/types";
import { type UnsplashHeroImage } from "@/lib/blog/unsplash";
import {
  createSeededRandom,
  getWordCount,
  hashString,
  pickMany,
  pickOne,
  slugify,
  truncateAtWordBoundary,
} from "@/lib/blog/utils";

type BlogGeneratorOptions = {
  keyword: string;
  publishedAt: Date;
  sequence: number;
};

const titleTemplates = [
  "{keyword} rehberi: Istanbul icinde teslimati hizlandirmanin yollari",
  "Istanbul'da {keyword} kullanirken dikkat edilmesi gerekenler",
  "{keyword} ile ayni gun teslimat operasyonu nasil guclenir?",
  "{keyword} seciminde isletmelerin gozden kacirdigi detaylar",
  "{keyword} ile planli ve guvenli gonderi yonetimi",
  "{keyword} hizmetinde dogru partner nasil secilir?",
  "Istanbul'da {keyword} icin bilmeniz gereken kritik detaylar",
  "{keyword} operasyonunu daha verimli hale getiren pratik ipuclari",
] as const;

const introTemplates = [
  "{keyword} ihtiyaci Istanbul gibi yogun bir sehirde sadece hiz meselesi degildir; ayni zamanda planlama, saha hakimiyeti ve dogru hizmet modelinin secilmesi anlamina gelir. Gonderi alis noktasindan teslim anina kadar gecen surede her dakikanin onemli oldugu durumlarda, sureci dogru kurgulamak operasyon verimini belirler. 34 Moto Kurye İstanbul olarak gun icinde degisen trafik yogunlugunu, is merkezi teslim protokollerini ve alici tarafindaki teslim kosullarini birlikte degerlendirerek hareket ediyoruz. Tek seferlik acil gonderi veya haftalik duzenli partnerlik taleplerinde ekibimiz, gonderi tipine ozgu planlama yaparak sahadaki beklenmedik gecikmeler icin onceden alternatif rotalar belirler.",
  "{keyword} arayisinda olan isletmeler ve bireysel musteriler icin en kritik konu, yalnizca kuryenin ne kadar cabuk yola ciktigi degil; rotanin ne kadar dogru planlandigidir. Istanbul'da her ilce farkli bir teslim ritmine sahiptir. Bu nedenle sahada yerel deneyimi olan, surec bilgilendirmesini net yapan ve farkli hizmet modellerini ayni anda yonetebilen bir ekip ile calismak teslimat kalitesini dogrudan etkiler. Sabah saatlerinden gece operasyonlarina kadar uzanan genis zaman diliminde esnek hareket edebilmek, toplam hizmet kalitesini belirleyen en kritik faktorlerden biridir.",
  "{keyword} cozumleri ozellikle son dakika belge, numune, e ticaret paketi ve kurumsal evrak gonderilerinde daha fazla on plana cikiyor. Ancak hizli gorunen her model gercekte verimli olmayabilir. Gonderi tipine uygun olmayan kurye secimi, gereksiz rota uzamasi ve eksik bilgilendirme teslimat surelerini uzatabilir. Bu nedenle dogru operasyon mantigiyla kurgulanmis bir hizmet, tek basina hizdan daha degerlidir. 34 Moto Kurye İstanbul bu denklemi her gonderi tipinde ayri ayri degerlendirerek en isabetli cozumu uretir.",
  "{keyword} ihtiyaci ile karsilasan isletmeler cogunlukla en hizli vaat eden servisi tercih eder; ancak gercek aksaklik teslimat oncesi hazirlik ve koordinasyon eksikliginde gizlidir. Istanbul gibi metropolde yol bilgisi, bina giris protokolleri ve alicinin musaitlik koridoru one gecen degiskenlerdir. 34 Moto Kurye İstanbul gonderi kabulunde bu detaylari sistematik bicimde netlestirerek sahaya eksik bilgi ile cikilmamasini operasyonun temel kurali olarak benimser. Bu disiplin bekleme surelerini ve yeniden teslimat riskini ciddi bicimde azaltir; kurumsal veya bireysel her gonderi talebinde hizmet kalitesini belirleyen temel etkendir.",
  "{keyword} hizmetinde rekabet avantaji saglamak, sehrin yeni dinamiklerini anlayan bir partner secmekle dogrudan iliskilidir. Istanbul'da metro hatlari yakinindaki bloklar, kopru gecisine yakin is merkezleri ve dakika kritik hastane lojistigi birbirinden cok farkli operasyon mantigi gerektirir. Her segmentte ayni sablonu uygulamak hizi yukseltemez; aksine operasyonu karmaya sokar. 34 Moto Kurye İstanbul bu farkliligi ilk adimdan itibaren taniyor, gonderi tipine ozgu rota ve iletisim protokolu belirliyor. Tek seferlik acil gonderi de haftalik kurumsal sevkiyat da ayni guven ortaminda yurutuluyor; uzun vadede musteriye saglanan deneyim istikrarini koruyor.",
] as const;

const supportParagraphTemplates = [
  "Gunun erken saatlerinde baslayan yogunluk, ogle arasi artis gosteren teslimatlar ve aksamustu sikisan trafik gibi dinamikler, ayni gonderi icin farkli saatlerde farkli planlama gerektirir. Bu noktada sadece mesafeye bakarak sure vermek yerine, cikis noktasi, teslim kat bilgisi, aliciya ulasma kolayligi ve alternatif guzergah ihtimali birlikte degerlendirilmelidir. Bu disiplin sayesinde teslimatlar daha ongorulebilir hale gelir ve isletmeler gunluk akisini daha kontrollu yonetir.",
  "Kurumsal tarafta surec yonetiminin zorlugu, gonderinin teslim edilmesinden once baslar. Evrak hazir mi, urun paketlemesi uygun mu, alici kisi teyit edildi mi ve bina giris kurallari net mi gibi sorular teslimat performansini dogrudan etkiler. 34 Moto Kurye İstanbul ekibi bu detaylari operasyonun basinda netlestirerek gereksiz beklemeleri azaltir. Sonuc olarak gonderi sadece hizli degil, daha az riskle ilerleyen bir surece dahil olur.",
  "Ozellikle ayni gun teslimat beklentisinde, musterinin en cok ihtiyac duydugu sey belirsizligin azaltilmasidir. Kurye ne zaman cikti, rota hangi asamada, teslimat oncesi ek not gerekiyor mu gibi sorulara hizli cevap vermek, hizmet algisini ciddi bicimde guclendirir. Bu nedenle bilgilendirme zinciri ve saha iletisim kalitesi, teslimat hizi kadar onemli bir metrik olarak ele alinmalidir.",
  "Saatlik trafik dinamikleri Istanbul'un her ilcesinde farkli sekillenir; bu durum ayni rota uzerindeki teslimat surelerini gun icinde buyuk farklarla degistirebilir. Sabah 08:00-10:00 ile ogle 12:00-14:00 dilimleri en yogun pencerelerdir. 34 Moto Kurye İstanbul sahada edinilen guncel deneyimle hangi zaman dilimlerinde alternatif rotanin etkin sekilde devreye girecegini bilir ve buna gore esnek planlama yapar. Bu bilgi birikimi, tahmini teslimat surelerinin gercekci sunulmasinda dogrudan fark yaratir.",
  "Gonderi takibinde farkli iletisim kanallarinin birlikte kullanilmasi, hem gonderen hem alici icin operasyonel bilgiyi zenginlestirir. WhatsApp anlık bildirim ve kritik durumlarda sesli iletisim kombinasyonu; ozellikle cok noktalı dagitim operasyonlarinda hizmet kalitesini olcumlenebilir kilmaktadir. Bu yapi yardımcı veya muhasebe personelinin de gonderiyi merkezi izleyebilmesine imkan tanir; su an nerede sorusunu aninda cevaplayarak saha ile ofis koordinasyonunu guclendirir.",
] as const;

const sectionHeadingTemplates = [
  "{keyword} neden bugun daha stratejik bir ihtiyac?",
  "Dogru kurye modelini secmek teslimat sonucunu nasil etkiler?",
  "Istanbul icinde operasyonu guclendiren planlama adimlari",
  "Teslimat surecinde sureklilik ve guven nasil korunur?",
  "E-ticaret ve son mil teslimatinda dikkat edilmesi gerekenler",
  "{keyword} hizmetinde musteri deneyimini yuksek tutan faktorler",
  "Istanbul ilceleri arasinda operasyonu koordine etmek icin ipuclari",
  "Gonderi guvenligini saglamak icin alinmasi gereken onlemler",
] as const;

const sectionParagraphTemplates = [
  "Istanbul icinde teslimat planlarken her gonderi ayni mantikla ele alinmaz. Ornegin <a href=\"/hizmetler/{serviceSlug1}\">{serviceTitle1}</a> modeli ile tek adrese oncelikli cikis gereken bir senaryo farkli yonetilirken, <a href=\"/hizmetler/{serviceSlug2}\">{serviceTitle2}</a> ihtiyacinda rota esnekligi ve paket hacmi daha belirleyici olur. Benzer sekilde <a href=\"/{districtSlug1}\">{districtName1}</a> ile <a href=\"/{districtSlug2}\">{districtName2}</a> tarafinda saha kosullari ayni degildir. Bu farklari onceden dikkate almak, teslim surelerinin daha gercekci verilmesini saglar.",
  "Dogru hizmet modelini secmek maliyetten once zamanin nasil kullanilacagini belirler. Beklemesiz cikmasi gereken gonderiler icin daha dogrudan bir akis gerekirken, gun icinde birden fazla adrese dagitim yapilacaksa rota mantigi daha farkli kurulur. Burada onemli olan, talebi tek tip kaliba sokmak yerine gercek operasyon ihtiyacina gore eslestirmektir. Bu yaklasim, hem gonderen hem alici tarafinda gereksiz beklenti yonetimi problemlerini azaltir.",
  "Teslimat surecinde saha ekiplerinin mahalli deneyimi ciddi avantaj saglar. Is merkezleri, site guvenlikleri, resepsiyon uygulamalari ve hastane benzeri kontrollu alanlar farkli teslim prosedurleri dogurur. Ekip bu detaylara hakim oldugunda, gonderi vardiginda yasanan gecikmeler minimuma iner. Bu da ilk cikistan teslim teyidine kadar daha duzgun bir hizmet cizgisi olusturur.",
  "Planli iletisim ve anlik durum paylasimi, hizli kurye operasyonunun sessiz ama kritik bilesenidir. Müşteri hangi asamada olundugunu bildiginde, ic ekipleriyle daha rahat koordinasyon kurar. Ozellikle kurumsal ekipler icin bu bilgi akisinin duzenli olmasi, gunluk operasyonun saglikli ilerlemesini saglar ve gonderi kaynakli telefon trafigini azaltir.",
  "Gonderi iceriginin dogru tanimlanmasi da teslimat kalitesini etkiler. Evrak, numune, yedek parca, hassas urun ya da e ticaret paketi gibi farkli tipler farkli tasima hassasiyeti ister. Baslangicta yapilan dogru siniflandirma hem rota secimini hem de gerekli ekipman planlamasini etkiler. Bu sayede hizli teslimat hedeflenirken guvenlik veya uygunluk tarafinda gereksiz taviz verilmez.",
  "Sehir ici teslimatta sureklilik icin yalnizca bugunku operasyonu degil, tekrar eden gonderi modelini de dusunmek gerekir. Ayni bolgelerde sik sevkiyat yapan firmalar icin tekrarli akislari analiz etmek, saha planlamasini zamanla daha guclu hale getirir. Bu da hem operasyon verimini hem de hizmetin ongorulebilirligini artirir. Uzun vadede dogru kurye partneriyle calismak, lojistik stresi azaltan stratejik bir avantaj haline gelir.",
  "Istanbul'da sehir ici lojistikte mesafe her zaman dogrusal belirleyici degildir; trafik yonetimi, rota secimi ve bekleme surelerinin minimize edilmesi cok daha kritik rolle gundeme gelir. Ozellikle <a href=\"/{districtSlug1}\">{districtName1}</a> ve <a href=\"/{districtSlug2}\">{districtName2}</a> gibi yogun noktalarda dakiklik, sahada surekli guncellenen rota analiziyle korunabilir. Gecmis trafik verisini bilen ve Istanbul yollarini adim adim taniyan kurye ekipleri, sure tahmininde gercekci beklenti yonetimi saglar. Sehrin bu karmasik yapisini bilen partner secimi, isletmelerin teslimat planlamasini cok daha saglam temele oturtmaya imkan tanir.",
  "E-ticaret paketlerinin son mil teslimatinda en buyuk zorluk, alicinin tam adrese ulasim belirsizligidir. Bu risk, teslim oncesi bildirim ve saat araligi paylasimi ile buyuk olcude azaltilabilir. <a href=\"/hizmetler/{serviceSlug1}\">{serviceTitle1}</a> kapsamindaki teslim oncesi iletisim altyapisi basari oranini yukseltirken iade maliyetini dusurur. Sahada gecirilen bos bekleme suresi azalir; alici tarafindaki saat kaygilamasi da ortadan kalkar. Bu tur bildirim akisi aktif oldugunda musteri memnuniyet puani dogrudan yukselir.",
  "Hukuk burosu, noterlik ve mali musavirlik gibi mesleki alanlarda gonderi yonetimi hem hizli hem gizlilik ve belgeleme odakli olmalidir. Evrak tasimak sadece fiziksel yer degistirme degil; dogru kisi teyidi ve imzali teslim protokolunu da kapsar. Bu segmentte <a href=\"/hizmetler/{serviceSlug2}\">{serviceTitle2}</a> hizmeti, gecikme ve yanlis teslim riskini minimize eden butunlesik cozum sunar. Mesleki alanda calisan isletmeler icin zaman damgali teslim kaydi; musteri iliskileri ve yasal uyumluluk acisindan dogrudan katki saglar.",
  "Teknik servis, cihaz tamiri ve yedek parca dagitiminda zaman hassasiyeti son derece yuksektir. Teknisyen beklerken geciken bir parca hem musteri memnuniyetini hem de saatlik isgucu maliyetini olumsuz etkiler. <a href=\"/{districtSlug1}\">{districtName1}</a> ve <a href=\"/{districtSlug2}\">{districtName2}</a> bolgelerindeki sanayi akslarinda rota onceliklendirmesi belirleyici rol oynar. Ekibimiz bu tip gonderilerde eksik adres veya bina giris bilgisi kalmamasini garantileyerek sahaya cikiyor; bu disiplin zaman kayiplarinin onune gecer.",
  "Medikal gonderi ve numune tasimaciligi ozel hassasiyet gerektiren bir kategoridir. Soguk zinciri, steril ambalaj gereklilikleri ve teslim alici teyidi bu alanda standart uygulamalar arasindadir. <a href=\"/hizmetler/{serviceSlug1}\">{serviceTitle1}</a> kapsamindaki saglik lojistigi hizmetinde kurye, gonderi bilgilerini ve teslim protokolunu sahaya cikmadan once tam olarak ogrenir. Hastane ve klinik alanlarda guvenlik, giris proseduru ve teslim noktasi yonlendirmesi konusunda tecrubeli ekibimiz, zaman kritik saglik gonderilerini en emniyetli sekilde ulas tirir.",
  "Kurumsal hesaplar ve duzenli gonderi hacimleri sozu konusu oldugunda, tek seferlik hizmet aliminin otesine gecmek hem maliyet hem operasyon verimliligi acisindan avantajlidir. <a href=\"/{districtSlug1}\">{districtName1}</a> bolgesinde faaliyet gosteren isletmeler icin haftalik ya da aylik gonderi hacmine gore ozel oncelikli yonlendirme mumkundur. Iletisim kanallarinin basitlestirilmesi ve tek noktadan siparis yonetimi saglanan verimlilik artisini ileri tasir. Surdurulebilir partner iliskileri, teslimat performansini zaman icinde optimize ederek lojistik maliyetini dusurur.",
] as const;

const bulletTemplates = [
  "Talebi olustururken cikis ve teslim noktalarini net paylasin.",
  "Paket icerigini ve varsa hassasiyet bilgisini bastan belirtin.",
  "Tek adrese acil cikis ile cok adresli dagitimi ayri planlayin.",
  "Alici telefonunu ve teslimat notunu guncel tutun.",
  "Mesai disi saatler icin gece operasyon ihtiyacini onceden bildirin.",
  "Plaza, rezidans ve hastane gibi kontrollu noktalarda bina kurallarini ekleyin.",
  "Teslimat gerceklesmezse veya teslim alinamazsa alternatif kisi bilgisi hazirlayin.",
  "Tekrarlayan gonderiler icin haftalik ya da gunluk operasyon planini onceden paylasin.",
  "Alicinin kat ve daire numarasini eksiksiz belirtin, blok bilgisini unutmayin.",
  "Paket birden fazla parcadan olusuyorsa parca sayisini ve toplam agirligini bildirin.",
] as const;

const conclusionTemplates = [
  "Sonuc olarak {keyword} hizmeti, Istanbul icinde yalnizca hizli bir motor yonlendirmekten ibaret degildir. Dogru kategori secimi, sahaya uygun rota planlamasi, guclu iletisim ve guvenli teslim proseduru birlikte calistiginda gercek anlamda verimli bir sonuc ortaya cikar. 34 Moto Kurye İstanbul, gunluk operasyon baskisi altinda olan markalar ve bireysel musteriler icin bu sureci sade, hizli ve takip edilebilir hale getirmeyi hedefler.",
  "Ozetle {keyword} ihtiyacinda en iyi sonuc, hiz vaadi ile operasyon disiplininin bir araya gelmesiyle alinir. Gonderinin niteligine uygun kurye modeli secildiginde, ilce bazli saha bilgisi dogru kullanildiginda ve musteri bilgilendirmesi aksatilmadiginda teslimatlar daha stabil ilerler. 34 Moto Kurye İstanbul bu dengeyi koruyarak Istanbul genelinde surekli ve guven veren bir hizmet sunar.",
  "{keyword} konusunda Istanbul'da dogru karari vermek, yalnizca fiyat karsilastirmasiyla degil operasyon kalitesini ve saha deneyimini tartarak mumkun olur. Gonderi tipine uygun hizmet modeli, mahalli bilgiye dayali rota planlamasi ve surecin her asamasinda net iletisim; teslimat performansinin temel direklerini olusturur. 34 Moto Kurye İstanbul bu direkleri her gonderi icin ayni ozenle kurar ve Istanbul genelinde tutarli bir hizmet deneyimi sunar.",
  "{keyword} ihtiyacinda kalici cozum; hizli bir yanit vermekten cok surdurulebilir operasyon yapisi kurmakla ilgilidir. Dogru ortak secimi zamanla maliyet optimizasyonu ve azalan yeniden-teslimat orani saglar. 34 Moto Kurye İstanbul bu cercevede sizi yalnizca bugunku gonderiniz icin degil; operasyonunuzun buyudugu her asamada destekleyecek kapasiteye sahiptir.",
] as const;

const faqTemplates = [
  {
    q: "Ayni gun teslimat icin en gec saat kacta siparis verebilir miyim?",
    a: "{keyword} konusunda 34 Moto Kurye İstanbul olarak gunun 24 saati hizmetinizdeyiz. Gece 23:59'a kadar verilen talepler ayni gun kapsaminda degerlendirilmekte olup gece ekibimiz ozel ivedi senaryolarda 7 gun esnek operasyon yurutmektedir. Sabah erken saatten gelen talepler standart operasyonumuzda oncelikli siraya alinir. Tam zaman dogrulamasi icin WhatsApp hattimizdan anlik bilgi alabilirsiniz. Hafta sonu ve resmi tatil operasyonlarimiz da aktif oldugundan hicbir teslimat penceresi kacmaz.",
  },
  {
    q: "Birden fazla adrese tek siparisle teslimat yapilabilir mi?",
    a: "Evet, cok adresli rota taleplerinizi tek siparis altinda raporlayabilirsiniz. Ayni gun birden fazla teslim noktasi olan kurumsal gonderilerde adresleri planlama sirasinda siralamak hem hizi hem de maliyet optimizasyonunu saglar. Bu operasyonlarda adresleri, yetkili kisi adini ve teslim notunu onceden iletmenizi oneririz; saha ekibimiz bina protokollerine gore en verimli rotayi belirler. Detayli bilgi icin WhatsApp uzerinden ulasin.",
  },
  {
    q: "Gonderi hassas veya yuksek degerli malzeme iceriyorsa ne yapmaliyim?",
    a: "{keyword} talebinizde medikal numune, kuyumculuk urunleri, elektronik ekipman veya ozel evrak gibi hassas icerikler varsa bunu siparis notunda belirtmeniz yeterlidir. Ekibimiz bu kategorilerin tasima protokolunu bilmektedir; uygun paketleme saglanamiyorsa gonderi oncesinde sizi bilgilendiririz. Ekstra koruma veya ozel ambalaj gerektiren durumlarda destek ekibimiz devreye girer ve sureci guvence altina alir.",
  },
  {
    q: "Kurye nerede? Teslimat sirasinda takip nasil yapilir?",
    a: "Kurye yola ciktiktan sonra WhatsApp hattimiz uzerinden anlik durum guncellemesi talep edebilirsiniz. Ekibimiz cikis teyidi, yoldayim bildirimi ve teslimat onayini sizinle paylasmaktadir. Kurumsal musteriler icin gunluk gonderi hacmine gore bildirim sikligini ayarlamaniza imkan tanıyan ozel kanal mevcuttur. Teslimat sonrasi onay fotografi talebini siparis notunda belirtmeniz yeterlidir.",
  },
  {
    q: "Gece teslimat hizmeti hangi saatler arasinda sunulmaktadir?",
    a: "Gece teslimat hizmetimiz 22:00 ile 06:00 arasindaki talepleri kapsamakta; ozel ivedi durumlarda bu pencere disinda da operasyon yurutebilmekteyiz. Gece tarifesi gunduz fiyatindan farklilasabilmekle birlikte Istanbul trafikinin bu saatlerde daha akiskan olmasi sayesinde teslim sureleri genellikle daha kisadir. 7 gun 24 saat ulasim icin WhatsApp hattimiz her zaman aktiftir.",
  },
] as const;

const buildSlug = (keyword: string, publishedAt: Date, sequence: number) => {
  const dateLabel = publishedAt.toISOString().slice(0, 10);
  return slugify(`${keyword}-${dateLabel}-${sequence}`);
};

const fillDynamicTemplate = (
  template: string,
  keyword: string,
  service1: (typeof services)[number],
  service2: (typeof services)[number],
  district1: (typeof districts)[number],
  district2: (typeof districts)[number],
) => {
  return template
    .replaceAll("{keyword}", keyword)
    .replaceAll("{serviceSlug1}", service1.slug)
    .replaceAll("{serviceTitle1}", service1.title)
    .replaceAll("{serviceSlug2}", service2.slug)
    .replaceAll("{serviceTitle2}", service2.title)
    .replaceAll("{districtSlug1}", district1.slug)
    .replaceAll("{districtName1}", district1.name)
    .replaceAll("{districtSlug2}", district2.slug)
    .replaceAll("{districtName2}", district2.name);
};

const buildMetaTitle = (title: string) => {
  const suffix = ` | ${SITE.name}`;
  const maxTitleLength = Math.max(20, 68 - suffix.length);
  return `${truncateAtWordBoundary(title, maxTitleLength)}${suffix}`;
};

const buildMetaDescription = (keyword: string, service: (typeof services)[number], district: (typeof districts)[number]) => {
  const description = `${keyword} konusunda ${district.name} ve Istanbul genelinde teslimat hizi, operasyon planlamasi ve uygun ${service.title.toLowerCase()} modeliyle ilgili en kritik noktalari anlattik.`;
  return truncateAtWordBoundary(description, 158);
};

export const generateBlogPost = ({ keyword, publishedAt, sequence }: BlogGeneratorOptions): BlogGenerationResult => {
  const seed = hashString(`${keyword}-${publishedAt.toISOString()}-${sequence}`);
  const random = createSeededRandom(seed);
  const [service1, service2] = pickMany(services, 2, random);
  const [district1, district2] = pickMany(districts, 2, random);
  const chosenTitle = pickOne(titleTemplates, random).replace("{keyword}", keyword);
  const intro = pickOne(introTemplates, random).replaceAll("{keyword}", keyword);
  const supportParagraphs = pickMany(supportParagraphTemplates, 2, random);
  const headings = pickMany(sectionHeadingTemplates, 3, random).map((heading) =>
    heading.replaceAll("{keyword}", keyword),
  );
  const bodyParagraphs = pickMany(sectionParagraphTemplates, 6, random).map((paragraph) =>
    fillDynamicTemplate(paragraph, keyword, service1, service2, district1, district2),
  );
  const reserveParagraphs = pickMany(
    sectionParagraphTemplates.filter(
      (paragraph) => !bodyParagraphs.includes(fillDynamicTemplate(paragraph, keyword, service1, service2, district1, district2)),
    ),
    2,
    random,
  ).map((paragraph) => fillDynamicTemplate(paragraph, keyword, service1, service2, district1, district2));
  const bullets = pickMany(bulletTemplates, 5, random);
  const selectedFaqs = pickMany(faqTemplates, 4, random).map((faq) => ({
    q: faq.q,
    a: faq.a.replaceAll("{keyword}", keyword),
  }));
  const conclusion = pickOne(conclusionTemplates, random).replaceAll("{keyword}", keyword);
  const slug = buildSlug(keyword, publishedAt, sequence);
  const dateIso = publishedAt.toISOString();

  const contentParts = [
    `<p>${intro}</p>`,
    ...supportParagraphs.map((paragraph) => `<p>${paragraph}</p>`),
    `<h2>${headings[0]}</h2>`,
    `<p>${bodyParagraphs[0]}</p>`,
    `<p>${bodyParagraphs[1]}</p>`,
    `<h2>${headings[1]}</h2>`,
    `<p>${bodyParagraphs[2]}</p>`,
    `<p>${bodyParagraphs[3]}</p>`,
    `<h2>${headings[2]}</h2>`,
    `<p>${bodyParagraphs[4]}</p>`,
    `<p>${bodyParagraphs[5]}</p>`,
    "<h2>Ozet Kontrol Listesi</h2>",
    "<ul>",
    ...bullets.map((bullet) => `<li>${bullet}</li>`),
    "</ul>",
    `<p>${conclusion}</p>`,
    "<h2>Sikca Sorulan Sorular</h2>",
    ...selectedFaqs.map((faq) => `<details><summary>${faq.q}</summary><p>${faq.a}</p></details>`),
    `<div class=\"blog-cta\">`,
    "<h2>Hizli Iletisim</h2>",
    "<p>Operasyonunuza uygun kurye modelini birlikte planlayalim. Fiyat vermeden once sureci ve uygun hizmet tipini netlestirelim.</p>",
    `<p><a href=\"${whatsappLink(defaultOrderMessage)}\" target=\"_blank\" rel=\"noopener noreferrer\">WhatsApp'tan yazin</a></p>`,
    `<p><a href=\"${SITE.phoneHref}\">Hemen arayin</a></p>`,
    "</div>",
  ];

  let content = contentParts.join("\n");
  let wordCount = getWordCount(content);

  if (wordCount < 950 && reserveParagraphs.length > 0) {
    const extraMarkup = reserveParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n");
    content = content.replace("<div class=\"blog-cta\">", `${extraMarkup}\n<div class=\"blog-cta\">`);
    wordCount = getWordCount(content);
  }

  const metaTitle = buildMetaTitle(chosenTitle);
  const metaDescription = buildMetaDescription(keyword, service1, district1);

  return {
    keyword,
    wordCount,
    post: {
      title: chosenTitle,
      slug,
      content,
      metaTitle,
      metaDescription,
      createdAt: dateIso,
      publishedAt: dateIso,
    },
  };
};

export const injectHeroImageIntoContent = (content: string, hero: UnsplashHeroImage | null) => {
  if (!hero?.imageUrl) {
    return content;
  }

  const heroMarkup = [
    `<figure class="blog-hero">`,
    `<img src="${hero.imageUrl}" alt="${hero.alt}" loading="lazy" decoding="async" />`,
    `<figcaption>`,
    `Fotograf: <a href="${hero.authorUrl}" target="_blank" rel="noopener noreferrer">${hero.authorName}</a> / Unsplash`,
    `</figcaption>`,
    `</figure>`,
  ].join("");

  const firstParagraphEnd = content.indexOf("</p>");

  if (firstParagraphEnd === -1) {
    return `${heroMarkup}\n${content}`;
  }

  const insertIndex = firstParagraphEnd + 4;
  return `${content.slice(0, insertIndex)}\n${heroMarkup}\n${content.slice(insertIndex)}`;
};