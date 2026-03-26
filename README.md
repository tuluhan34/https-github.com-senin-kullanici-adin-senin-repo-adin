# 34 Kurye

Uber, Banabikurye ve 34kurye referans hissini birlestiren; yuksek donusum odakli, mobil-first, SEO uyumlu kurumsal moto kurye sitesi.

## Ozellikler

- Next.js Pages Router altyapisi
- Tailwind CSS v4 ile mobil-first arayuz
- WhatsApp hizli siparis ve telefon CTA entegrasyonu
- 5 ayri hizmet detayi sayfasi
- Istanbul icin 39 ilceye ozel SEO sayfasi
- LocalBusiness schema, FAQ schema, robots ve sitemap
- Google Maps embed, yorumlar ve SSS alani

## Proje Yapisi

```text
web/
	components/
	lib/
	pages/
		_app.js
		index.js
		*-moto-kurye.js
	styles/
		globals.css
	public/
	.env.example
	package.json
```

## Kurulum

```bash
npm install
copy .env.example .env.local
npm run dev
```

Tarayicida `http://localhost:3000` adresini acin.

## Tek Komutla Calistirma

Bagimliliklar kuruluysa:

```bash
npm run dev
```

Sifirdan tek satir akisi icin Windows PowerShell:

```powershell
npm install; Copy-Item .env.example .env.local -Force; npm run dev
```

## Ortam Degiskenleri

`.env.example` dosyasini `.env.local` olarak kopyalayin.

```env
NEXT_PUBLIC_SITE_DOMAIN=www.34kurye.com
NEXT_PUBLIC_PHONE_DISPLAY=0530 321 90 04
NEXT_PUBLIC_PHONE_HREF=tel:+905303219004
NEXT_PUBLIC_WHATSAPP_NUMBER=905303219004
```

## Komutlar

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run gallery:sync
```

## Galeri Gercek Foto Modu

- `public/gallery/` klasorune `.jpg`, `.jpeg`, `.png` veya `.webp` dosyalari koyabilirsiniz.
- `npm run build` oncesinde `gallery:sync` otomatik calisir.
- `photo-1.jpg` ... `photo-8.jpg` adlandirmasi tavsiye edilir.
- Farkli isimli fotograflar da otomatik algilanir ve galeriye eslenir.

## Deploy

Vercel, Netlify veya Node.js destekli herhangi bir sunucuda deploy edilebilir.

Production build:

```bash
npm run build
npm run start
```

## Canli Kalici Yayin Akisi (Pages Router)

Bu repo artik canliya cikarken dogrudan kaynak koddan build alir.

KURAL (zorunlu): Canli yayin tunnel/temporary URL uzerinden yapilmaz. `localhost.run`, `ngrok`, `localtunnel`, `bore` gibi gecici tunnel cozumleri production kabul edilmez. Tek gecerli canli hedef cPanel uzerindeki gercek domaindir (`34motokuryeistanbul.com` / `www.34motokuryeistanbul.com`).
KURAL (zorunlu): `http://localhost:3000/` uzerindeki mevcut uygulama "tek kaynak" kabul edilir; canlida bunun birebir guncel hali bulunmalidir.
KURAL (zorunlu): Projede yapilan her ekleme/cikarma/degisiklik `main` branch'e push ile aninda canli deploy surecine girer; hedef gercek domainde calisan kalici yayin almaktir.

- Kaynak: `pages/`, `components/`, `styles/`, `lib/`
- Uretim cikisi: `out/`
- Canli deploy tetikleyici: `main` branch'e push

### Neden bu yapi?

- Burada yaptigin degisiklikler kalici olur.
- Sonradan kolayca degistirilebilir ve gelistirilebilir.
- `clean-upload` elle guncelleme zorunlulugu ortadan kalkar.

### Deploy Workflow Dosyalari

- `.github/workflows/deploy-cpanel.yml`

Iki workflow da su akisi kullanir:

1. `npm ci`
2. `npm run build`
3. `out/` klasorunu deploy et

### Gerekli GitHub Secrets (cPanel)

- `CPANEL_FTP_HOST`
- `CPANEL_FTP_USER`
- `CPANEL_FTP_PASSWORD`

### Onerilen Gelistirme Akisi

1. Ozelligi localde gelistir (`npm run dev`)
2. Build kontrolu yap (`npm run build`)
3. `main` branch'e push et
4. GitHub Actions otomatik canliya ciksin

Bu proje Pages Router ile devam eder; App Router kullanmak zorunlu degildir.
