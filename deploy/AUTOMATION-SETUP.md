# Icerik ve Google Isletme Otomasyonu

Bu proje su anda `next export` ile statik olarak uretiliyor ve son cikti `clean-upload/` klasorune aktariliyor.

## Mevcut Durum

- Blog icerigi uygulama icinde otomatik uretiliyor.
- SSS kartlari gunun saatine gore farkli kombinasyonlarla donuyor.
- Galeri artik gunun saatine gore farkli gercek gorselleri ustte gosterecek sekilde hazirlandi.
- Ancak cPanel veya FileZilla ile statik dosya yuklendikten sonra arka planda calisan Node sureci olmadigi icin blog veya Google isletme guncellemeleri kendi kendine calismaz.

## Statik Yayinla Neler Yapilabilir

- `public/gallery/` altina gercek JPG veya WEBP dosyalari yuklenebilir.
- Build oncesi `gallery:sync` otomatik calisir ve gercek gorselleri kendisi esler.
- Galeri sayfasi gun icindeki zaman dilimine gore bu fotograflari otomatik siralar.
- `UNSPLASH_ACCESS_KEY` varsa, build sirasinda galeri internetten otomatik gorsel cekmeyi dener.
- Unsplash erisimi basarisiz olursa sistem yerel fotograflara, onlar da yoksa SVG yedeklere doner.

## Gercek Fotograf Adlandirma Kurali

En temiz yol su sekildedir:

```text
public/gallery/photo-1.jpg
public/gallery/photo-2.jpg
...
public/gallery/photo-8.jpg
```

Ama zorunlu degil. Eger farkli dosya adlariyla JPG/PNG/WEBP yüklerseniz, sistem bunlari alfabetik sirayla `photo-1..photo-8` alanlarina otomatik baglar.

## Blog Otomasyonu Icin Gerekli Yapi

Tam otomatik blog icin asagidaki yollardan biri gerekir:

1. Node calisan bir VPS veya sunucu
2. GitHub Actions, cron-job.org veya benzeri zamanlayici
3. Windows Task Scheduler ile yerel bilgisayardan duzenli build alma

Calistirilacak komut akisi:

```powershell
npm install
npm run content:tick
npm run build
```

Ardindan yeni `out/` icerigi `clean-upload/` klasorune kopyalanir ve yeniden yuklenir.

Zorla yeni yazi uretmek icin:

```powershell
npm run content:force
```

## Google Isletme Tarafinda Gerekli API ve Erisimler

Google tarafinda satin alinacak bir API yok; Google Cloud uzerinden API etkinlestirme ve erisim onayi gerekir.

Gerekli parcalar:

1. Google Cloud Project
2. OAuth 2.0 Client ID ve Client Secret
3. Refresh Token
4. Google Business Profile API erisimi
5. Account ID ve Location ID

Google dokumantasyonuna gore kullanilacak ana servisler:

1. My Business Business Information API
   - lokasyon bilgisi ve temel profil verileri
2. Google My Business API v4 `accounts.locations.media`
   - fotograf yukleme ve medya yonetimi
3. Google My Business API v4 `accounts.locations.localPosts`
   - post yayinlama

Not:

- Dokumantasyonda, API etkinlestirildikten sonra kota `0` gorunurse Business Profile API access request yapilmasi gerektigi belirtiliyor.
- Bu entegrasyon statik export klasorunde degil, Node calisan bir entegrasyon katmaninda yapilmalidir.

## Bu Repoda Gerekli Ortam Degiskenleri

`.env.local` icine eklenecek alanlar:

```env
GOOGLE_BUSINESS_CLIENT_ID=
GOOGLE_BUSINESS_CLIENT_SECRET=
GOOGLE_BUSINESS_REFRESH_TOKEN=
GOOGLE_BUSINESS_ACCOUNT_ID=
GOOGLE_BUSINESS_LOCATION_ID=
```

## Onerilen Sonraki Faz

1. Gercek fotograflari `public/gallery/` altina yukleyin.
2. `src/lib/site-data.ts` icindeki SVG yollarini gercek dosya yollarina cevirin.
3. Isterseniz ikinci asamada size bir Node tabanli Google Business senkron araci ekleyebilirim.