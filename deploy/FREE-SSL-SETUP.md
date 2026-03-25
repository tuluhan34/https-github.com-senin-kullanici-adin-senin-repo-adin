# Ucretsiz SSL Kurulumu

Bu site icin ucretli SSL satin almak zorunda degilsiniz. SEO, Google Isletme ve kullanici guveni icin `https` kullanmaniz gerekir; ama bunu ucretsiz cozumlerle yapabilirsiniz.

## En Kolay Secenekler

### 1. Vercel / Netlify / Cloudflare Pages

- Siteyi bu platformlardan birine yayinlarsaniz SSL otomatik gelir.
- Alan adinizi bagladiginiz anda `https` aktif olur.
- Ek SSL ucreti odemeniz gerekmez.

### 2. Cloudflare Uzerinden Ucretsiz SSL

- Alan adinizi Cloudflare'e baglayin.
- DNS kayitlarini Cloudflare uzerinden yonetin.
- `SSL/TLS` ayarini `Full` veya `Full (strict)` yapin.
- `Always Use HTTPS` ayarini acin.
- Bu yol hem guvenlik hem hiz hem de temel koruma icin uygundur.

### 3. Kendi Sunucunuzda Caddy + Let's Encrypt

Eger siteyi kendi VPS ya da sunucunuzda calistiriyorsaniz en pratik yol `Caddy` kullanmaktir.

Ornek `Caddyfile`:

```txt
www.34kurye.com {
  encode gzip zstd
  reverse_proxy 127.0.0.1:3000
}
```

- Caddy alan adini gorunce otomatik `Let's Encrypt` SSL alir.
- Sertifika yenilemesini de otomatik yapar.
- Ayrica ucretli SSL satin almaniza gerek kalmaz.

## SEO Acisindan Neden Gerekli?

- Google `https` siteleri daha guvenli gorur.
- Tarayicida "guvenli degil" uyarisi cikmaz.
- Google Isletme profilinizde web site linki daha saglikli calisir.
- Formlar, WhatsApp gecisleri ve harita entegrasyonlari daha sorunsuz olur.

## Bu Projede Ne Yapildi?

- Site icindeki tum kurumsal baglantilar `https://www.34kurye.com` mantigina gore duzenlendi.
- Google Isletme, yorum ve harita baglantilari merkezi env degiskenlerine baglandi.
- SSL aktif oldugunda ek kod degisikligi gerekmeyecek sekilde yapi hazir hale getirildi.

## Son Yapmaniz Gereken

Su 3 bilgiyi netlestirin:

1. Hangi hostingde yayinlayacaksiniz?
2. Alan adinizin DNS yonetimi kimde?
3. Google Maps / Google Business profilinizin gercek paylasim linki nedir?

Bu 3 bilgi belli oldugunda SSL'i para odemeden dogru sekilde tamamlayabilirsiniz.
