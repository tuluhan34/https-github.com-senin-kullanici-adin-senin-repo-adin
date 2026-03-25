# 34 Kurye

Uber, Banabikurye ve 34kurye referans hissini birlestiren; yuksek donusum odakli, mobil-first, SEO uyumlu kurumsal moto kurye sitesi.

## Ozellikler

- Next.js App Router altyapisi
- Tailwind CSS v4 ile mobil-first arayuz
- WhatsApp hizli siparis ve telefon CTA entegrasyonu
- 5 ayri hizmet detayi sayfasi
- Istanbul icin 39 ilceye ozel SEO sayfasi
- LocalBusiness schema, FAQ schema, robots ve sitemap
- Google Maps embed, yorumlar ve SSS alani

## Proje Yapisi

```text
web/
	public/
		hero-city.svg
	src/
		app/
			[slug]/page.tsx
			globals.css
			hizmetler/
				[slug]/page.tsx
				page.tsx
			layout.tsx
			page.tsx
			robots.ts
			sitemap.ts
		components/
			floating-actions.tsx
			quick-order-box.tsx
			site-footer.tsx
		lib/
			site-data.ts
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
