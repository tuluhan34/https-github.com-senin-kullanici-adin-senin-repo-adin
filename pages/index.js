import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { districts } from "../lib/district-data";
import { servicesCatalog } from "../lib/services-catalog";

const courierServices = servicesCatalog;

const shipmentTypes = [
  "Evrak Kurye",
  "Koli / Paket Kurye",
  "Protez Diş Kurye",
  "Vize Evrak Kurye",
  "Numune Kurye",
  "Sözleşme / Dosya Kurye",
  "Diğer",
];

const deliverySpeeds = ["Acil", "Hemen", "1 Saat", "2 Saat", "3 Saat", "4 Saat", "Süre Belirle"];

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const loadGoogleMapsScript = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (window.__gmapsPromise) {
    return window.__gmapsPromise;
  }

  window.__gmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google?.maps || null);
    script.onerror = () => reject(new Error("Google Maps script could not be loaded."));
    document.head.appendChild(script);
  });

  return window.__gmapsPromise;
};

const serviceFlow = [
  {
    no: "01",
    title: "Konumları Belirleyin",
    text: "Alış ve teslimat adresini girin, gönderi detayını net olarak paylaşın.",
  },
  {
    no: "02",
    title: "Hizmet Seviyesini Seçin",
    text: "Normal, Express veya VIP seçeneklerinden hız ihtiyacınıza uygun olanı seçin.",
  },
  {
    no: "03",
    title: "Anında Başlatın",
    text: "Talebi onaylayın, kurye dakikalar içinde adrese yönlendirilsin.",
  },
];

const faqs = [
  {
    q: "Kurye ne kadar sürede atanıyor?",
    a: "Çoğu talep rota yoğunluğuna göre dakikalar içinde atanır; Express ve VIP talepler önceliklendirilir.",
  },
  {
    q: "Fiyatlandırma nasıl belirleniyor?",
    a: "Fiyatlar mesafe, teslimat hızı, yaka geçişi ve gönderi türüne göre şeffaf şekilde hesaplanır.",
  },
  {
    q: "Premium hizmet 7/24 aktif mi?",
    a: "Evet. İstanbul genelinde 7/24 operasyon ile acil ve planlı gönderilere kesintisiz hizmet verilir.",
  },
];

const buildWhatsappUrl = (
  pickupAddress,
  senderName,
  senderPhone,
  dropoffAddress,
  recipientName,
  recipientPhone,
  courierType,
  shipmentType,
  deliverySpeed,
  customDuration,
  weightSize,
  photoName,
  routeKm,
  mapsDirectionUrl,
) => {
  const message = [
    "Merhaba, acil moto kurye talebi oluşturmak istiyorum.",
    "",
    "ALIS NOKTASI",
    `Adres: ${pickupAddress || "Belirtilecektir"}`,
    `Gonderen Ad Soyad: ${senderName || "Belirtilecektir"}`,
    `Gonderen Telefon: ${senderPhone || "Belirtilecektir"}`,
    "",
    "TESLIM NOKTASI",
    `Adres: ${dropoffAddress || "Belirtilecektir"}`,
    `Alici Ad Soyad: ${recipientName || "Belirtilecektir"}`,
    `Alici Telefon: ${recipientPhone || "Belirtilecektir"}`,
    "",
    `Gonderilecek Urun: ${shipmentType}`,
    `Hizmet Seviyesi: ${courierType}`,
    `Teslimat Suresi: ${deliverySpeed}`,
    `Musteri Belirttigi Sure: ${customDuration || "Belirtilmedi"}`,
    `Agirlik / Ebat: ${weightSize || "Belirtilmedi"}`,
    `Fotograf: ${photoName || "Yok"}`,
    "",
    "ROTA OZETI",
    `Google Maps En Kisa Surus Mesafesi: ${routeKm && routeKm !== "-" ? routeKm : "Hesaplanamadi"}`,
    `Google Maps Linki: ${mapsDirectionUrl || "Hazir degil"}`,
    "Müsait kurye ve fiyat bilgisi ile dönüş rica ederim.",
  ].join("\n");

  return `https://wa.me/905303219004?text=${encodeURIComponent(message)}`;
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .12 5.35.12 11.94c0 2.1.55 4.14 1.59 5.93L0 24l6.28-1.64a11.92 11.92 0 0 0 5.78 1.47h.01c6.57 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.18-3.49-8.41ZM12.07 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97 1-3.63-.23-.37a9.9 9.9 0 0 1-1.52-5.25C2.2 6.46 6.58 2.08 12.07 2.08c2.64 0 5.12 1.03 6.98 2.89a9.8 9.8 0 0 1 2.9 6.98c0 5.49-4.38 9.86-9.88 9.86Zm5.42-7.4c-.3-.15-1.8-.9-2.08-1-.28-.1-.48-.15-.68.15-.2.3-.78 1-.96 1.2-.18.2-.36.23-.66.08-.3-.15-1.27-.47-2.42-1.5a9.04 9.04 0 0 1-1.68-2.1c-.18-.3-.02-.46.14-.61.14-.14.3-.36.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.24-.24-.57-.49-.49-.68-.49h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5s1.08 2.9 1.23 3.1c.15.2 2.11 3.24 5.1 4.54.71.3 1.26.48 1.7.62.71.22 1.36.19 1.87.12.57-.08 1.8-.74 2.05-1.46.25-.72.25-1.33.18-1.46-.07-.13-.27-.2-.57-.35Z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.29.57 3.53.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.42.57 3.53a1 1 0 0 1-.24 1.01l-2.2 2.25Z"
    />
  </svg>
);

export default function Home() {
  const [pickupAddress, setPickupAddress] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [courierType, setCourierType] = useState("Özel VIP Kurye");
  const [shipmentType, setShipmentType] = useState("Evrak Kurye");
  const [deliverySpeed, setDeliverySpeed] = useState("Acil");
  const [customDuration, setCustomDuration] = useState("");
  const [weightSize, setWeightSize] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [routeKm, setRouteKm] = useState("-");
  const [routeInfo, setRouteInfo] = useState("Alış ve teslimat adresini girin, en kısa rota ve km bilgisi burada gösterilsin.");
  const mapCanvasRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const mapsDirectionUrl = useMemo(() => {
    if (!pickupAddress || !dropoffAddress) {
      return "https://www.google.com/maps";
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickupAddress)}&destination=${encodeURIComponent(dropoffAddress)}&travelmode=driving`;
  }, [pickupAddress, dropoffAddress]);

  const whatsappUrl = useMemo(() => {
    return buildWhatsappUrl(
      pickupAddress,
      senderName,
      senderPhone,
      dropoffAddress,
      recipientName,
      recipientPhone,
      courierType,
      shipmentType,
      deliverySpeed,
      customDuration,
      weightSize,
      photoName,
      routeKm,
      mapsDirectionUrl,
    );
  }, [pickupAddress, senderName, senderPhone, dropoffAddress, recipientName, recipientPhone, courierType, shipmentType, deliverySpeed, customDuration, weightSize, photoName, routeKm, mapsDirectionUrl]);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setRouteInfo("Google Maps için NEXT_PUBLIC_GOOGLE_MAPS_API_KEY tanımlanmalı.");
      return;
    }

    let active = true;

    loadGoogleMapsScript()
      .then((maps) => {
        if (!active || !maps || !mapCanvasRef.current || mapRef.current) {
          return;
        }

        mapRef.current = new maps.Map(mapCanvasRef.current, {
          center: { lat: 41.015137, lng: 28.97953 },
          zoom: 11,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        directionsRendererRef.current = new maps.DirectionsRenderer({
          map: mapRef.current,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#2B7BFF",
            strokeOpacity: 0.95,
            strokeWeight: 6,
          },
        });
      })
      .catch(() => {
        setRouteInfo("Google Maps yüklenemedi. API ayarlarını kontrol edin.");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!pickupAddress || !dropoffAddress || !window.google?.maps || !mapRef.current || !directionsRendererRef.current) {
      return;
    }

    const maps = window.google.maps;
    const directionsService = new maps.DirectionsService();

    directionsService.route(
      {
        origin: pickupAddress,
        destination: dropoffAddress,
        travelMode: maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status !== "OK" || !result?.routes?.length) {
          setRouteKm("-");
          setRouteInfo("Rota hesaplanamadı. Adresleri daha açık yazınız.");
          return;
        }

        let bestIndex = 0;
        let bestDistance = Number.POSITIVE_INFINITY;

        result.routes.forEach((route, index) => {
          const distance = route.legs?.[0]?.distance?.value || Number.POSITIVE_INFINITY;
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
          }
        });

        directionsRendererRef.current.setDirections(result);
        directionsRendererRef.current.setRouteIndex(bestIndex);

        if (Number.isFinite(bestDistance)) {
          setRouteKm(`${(bestDistance / 1000).toFixed(1)} KM`);
          setRouteInfo("Google Maps üzerinde en kısa rota canlı olarak gösteriliyor.");
        }
      },
    );
  }, [pickupAddress, dropoffAddress]);

  return (
    <>
      <Head>
        <title>34 Moto Kurye İstanbul | Acil, Express ve VIP Kurye</title>
        <meta
          name="description"
          content="İstanbul moto kurye hizmeti: evrak kurye, koli kurye, protez diş kurye ve vize evrak kurye seçenekleriyle acil, express ve VIP teslimat."
        />
        <meta name="theme-color" content="#0B0B0C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <main className="home-shell">
        <header className="topbar container">
          <a href="#top" className="brand">
            <span className="brand-mark">34</span>
            <span className="brand-text">34 Moto Kurye İstanbul</span>
          </a>
          <div className="topbar-actions">
            <Link className="mini-cta" href="/hizmetlerimiz">Hizmet Sayfaları</Link>
            <Link className="mini-cta" href="/seo-icerikler">Blog</Link>
            <a className="mini-cta mini-cta-wa" href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp Destek</a>
            <a className="mini-cta" href="tel:05303219004">Arama Yap</a>
          </div>
        </header>

        <section className="container hero hero-split" id="top">
          <div className="hero-copy">
            <p className="eyebrow">1 Dakikada En Yakın Kuryeyi Çağır</p>
            <h1>1 Dakikada En Yakın Kuryeyi Çağır.</h1>
            <p className="lead">
              Hızlı Kurye. Güvenli Teslimat. Anlık Durum Bilgisi.
            </p>
            <p className="lead">
              Evrak, paket, numune ve değerli gönderilerinizi İstanbul trafiğine takılmadan
              adresten adrese taşıyoruz. Aynı gün teslimat, şeffaf süreç ve güçlü operasyon
              takibi ile süreci sizin için kolaylaştırıyoruz.
            </p>

            <div className="hero-form">
              <div className="location-split">
                <section className="location-card">
                  <h3>Alış Noktası</h3>
                  <label className="field">
                    <span>Adres</span>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(event) => setPickupAddress(event.target.value)}
                      placeholder="Örn. Levent Finans Merkezi"
                    />
                  </label>
                  <label className="field">
                    <span>Gönderen Ad Soyad</span>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(event) => setSenderName(event.target.value)}
                      placeholder="Örn. Ahmet Yılmaz"
                    />
                  </label>
                  <label className="field">
                    <span>Gönderen Telefon</span>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(event) => setSenderPhone(event.target.value)}
                      placeholder="Örn. 05xx xxx xx xx"
                    />
                  </label>
                </section>

                <section className="location-card">
                  <h3>Teslim Noktası</h3>
                  <label className="field">
                    <span>Adres</span>
                    <input
                      type="text"
                      value={dropoffAddress}
                      onChange={(event) => setDropoffAddress(event.target.value)}
                      placeholder="Örn. Nişantaşı Kurumsal Ofis"
                    />
                  </label>
                  <label className="field">
                    <span>Alıcı Ad Soyad</span>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(event) => setRecipientName(event.target.value)}
                      placeholder="Örn. Elif Kaya"
                    />
                  </label>
                  <label className="field">
                    <span>Alıcı Telefon</span>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(event) => setRecipientPhone(event.target.value)}
                      placeholder="Örn. 05xx xxx xx xx"
                    />
                  </label>
                </section>
              </div>

              <label className="field">
                <span>Hizmet Seviyesi</span>
                <select value={courierType} onChange={(event) => setCourierType(event.target.value)}>
                  {courierServices.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Gönderilecek Ürün / İşlem Türü</span>
                <select value={shipmentType} onChange={(event) => setShipmentType(event.target.value)}>
                  {shipmentTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <div className="time-split">
                <label className="field">
                  <span>Teslimat Süresi</span>
                  <select value={deliverySpeed} onChange={(event) => setDeliverySpeed(event.target.value)}>
                    {deliverySpeeds.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Süre Belirle (Müşteri Girişi)</span>
                  <input
                    type="text"
                    value={customDuration}
                    onChange={(event) => setCustomDuration(event.target.value)}
                    placeholder="Örn. 90 dk / 2.5 saat"
                  />
                </label>
              </div>

              <div className="time-split">
                <label className="field">
                  <span>Ağırlık / Ebat</span>
                  <input
                    type="text"
                    value={weightSize}
                    onChange={(event) => setWeightSize(event.target.value)}
                    placeholder="Örn. 3 kg / 40x30x20 cm"
                  />
                </label>

                <label className="field">
                  <span>Fotoğraf Yükle (İsteğe Bağlı)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setPhotoName(file ? file.name : "");
                    }}
                  />
                </label>
              </div>

              <p className="form-note">
                Evrak kurye, koli kurye, protez diş kurye ve vize evrak kurye talepleriniz için
                süre ve operasyon planlaması bu formdan hızlıca yapılır.
              </p>

              <div className="route-live-wrap">
                <div className="route-km-panel" role="status" aria-live="polite">
                  <strong>{routeKm}</strong>
                  <span>Google Maps En Kısa Sürüş Mesafesi</span>
                </div>
                <p className="route-info">{routeInfo}</p>
                <div ref={mapCanvasRef} className="route-map-canvas" />
                <a className="btn btn-whatsapp route-map-button" href={mapsDirectionUrl} target="_blank" rel="noreferrer">
                  Google Maps'ten Bakabilirsiniz
                </a>
                <div className="cta-row route-cta-row">
                  <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                    <span className="btn-icon"><WhatsAppIcon /></span>
                    WhatsApp
                  </a>
                  <a className="btn btn-whatsapp" href="tel:05303219004">
                    <span className="btn-icon"><PhoneIcon /></span>
                    Arama Yap
                  </a>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Hizmet seviyeleri</p>
            <h2>Gönderinize uygun kurye hizmetini seçin</h2>
          </div>
          <div className="service-grid">
            {courierServices.map((service) => (
              <Link key={service.slug} href={`/hizmetler/${service.slug}`} className="service-card-link">
                <article className="service-card">
                  <img className="service-card-media" src={service.image} alt={service.imageAlt} loading="lazy" />
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Operasyon modeli</p>
            <h2>3 adımda kurye çağırma süreci</h2>
          </div>
          <div className="steps-grid">
            {serviceFlow.map((step) => (
              <article key={step.no} className="step-card">
                <span className="step-no">{step.no}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container section-block">
          <h2>Hizmet Verilen İlçeler</h2>
          <div className="district-grid">
            {districts.map((district) => (
              <Link key={district.slug} href={`/${district.slug}/`} className="district-card">
                <h3>{district.name} Moto Kurye</h3>
                <p>{district.name} ilçesinde evrak, paket ve kurumsal gönderiler için planlı ve hızlı moto kurye hizmeti.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-block faq-panel">
          <div className="section-head">
            <p className="eyebrow">Sık Sorulan Sorular</p>
            <h2>Moto kurye hizmeti hakkında merak edilenler</h2>
          </div>
          <div className="faq-grid">
            {faqs.map((item) => (
              <article key={item.q} className="faq-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <div className="floating-actions" aria-label="Iletisim">
        <a className="fab fab-wa" href={whatsappUrl} target="_blank" rel="noreferrer">
          <span className="btn-icon"><WhatsAppIcon /></span>
          WhatsApp Destek
        </a>
        <a className="fab fab-call" href="tel:05303219004">
          <span className="btn-icon"><PhoneIcon /></span>
          Arama Yap
        </a>
      </div>
    </>
  );
}
