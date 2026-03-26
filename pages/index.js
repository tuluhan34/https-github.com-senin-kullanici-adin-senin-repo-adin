import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { districts } from "../lib/district-data";

const courierServices = [
  {
    value: "Executive Moto Courier",
    title: "Executive Moto Courier",
    desc: "High-speed same-day dispatch with strict service precision for urban routes.",
  },
  {
    value: "Priority Express Courier",
    title: "Priority Express Courier",
    desc: "Priority routing for time-sensitive shipments with immediate operator assignment.",
  },
  {
    value: "Private VIP Courier",
    title: "Private VIP Courier",
    desc: "Dedicated premium lane with one-client focus and confidential handling.",
  },
  {
    value: "Executive Vehicle Courier",
    title: "Executive Vehicle Courier",
    desc: "Premium vehicle dispatch for larger packages and multi-stop missions.",
  },
];

const serviceFlow = [
  {
    no: "01",
    title: "Define Locations",
    text: "Enter pickup and destination details with precision in less than 10 seconds.",
  },
  {
    no: "02",
    title: "Select Service Tier",
    text: "Choose the level of speed, discretion, and vehicle profile your shipment requires.",
  },
  {
    no: "03",
    title: "Initiate Instantly",
    text: "Confirm once and your premium courier request is immediately initiated.",
  },
];

const faqs = [
  {
    q: "How quickly is a courier assigned?",
    a: "Most premium requests are assigned within minutes, based on route density and live availability.",
  },
  {
    q: "How is pricing determined?",
    a: "Pricing reflects distance, handling priority, service tier, and mission complexity.",
  },
  {
    q: "Is premium service available 24/7?",
    a: "Yes. Our operations team runs continuously for executive and urgent shipments.",
  },
];

const trackingTimeline = [
  {
    title: "Request Confirmed",
    detail: "Your courier request has been successfully initiated.",
    eta: "ETA 22 min",
  },
  {
    title: "Priority Assignment",
    detail: "Your shipment is being handled with priority and precision.",
    eta: "ETA 16 min",
  },
  {
    title: "In Secure Transit",
    detail: "Courier is on route with real-time precision monitoring enabled.",
    eta: "ETA 8 min",
  },
  {
    title: "Near Destination",
    detail: "Final approach initiated. Delivery confirmation will follow shortly.",
    eta: "ETA 3 min",
  },
];

const buildWhatsappUrl = (pickupAddress, dropoffAddress, courierType) => {
  const message = [
    "Good day, I would like to initiate a premium courier request.",
    `Pickup Location: ${pickupAddress || "To be confirmed"}`,
    `Destination: ${dropoffAddress || "To be confirmed"}`,
    `Service Tier: ${courierType}`,
    "Please proceed with priority handling and confirmation.",
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
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [courierType, setCourierType] = useState("Private VIP Courier");
  const [trackingStep, setTrackingStep] = useState(0);
  const [notificationState, setNotificationState] = useState("default");

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setTrackingStep((prev) => (prev + 1) % trackingTimeline.length);
    }, 6000);

    return () => window.clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationState(Notification.permission);
    }
  }, []);

  const requestPushPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      return;
    }

    try {
      await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      setNotificationState(permission);

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification("Priority Alert Enabled", {
          body: "Real-time premium courier status notifications are now active.",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          data: { url: "/" },
        });
      }
    } catch (_error) {
      setNotificationState("denied");
    }
  };

  const whatsappUrl = useMemo(() => {
    return buildWhatsappUrl(pickupAddress, dropoffAddress, courierType);
  }, [pickupAddress, dropoffAddress, courierType]);

  const trackingProgress = ((trackingStep + 1) / trackingTimeline.length) * 100;

  return (
    <>
      <Head>
        <title>34 Executive Courier | Premium Private Delivery</title>
        <meta
          name="description"
          content="A luxury courier experience designed for trust, speed, and exclusivity. Premium request initiation, elegant real-time tracking, and precise operational control."
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
            <span className="brand-text">Executive Courier Istanbul</span>
          </a>
          <div className="topbar-actions">
            <a className="mini-cta mini-cta-wa" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">WhatsApp Concierge</a>
            <a className="mini-cta" href="tel:05303219004">Priority Call</a>
          </div>
        </header>

        <section className="container hero hero-split" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Private-grade logistics for high-value missions</p>
            <h1>Premium Courier. Precision Without Compromise.</h1>
            <p className="lead">
              Built for executives, financial teams, and sensitive operations.
              Every shipment is handled with discreet priority, measurable speed, and
              elite operational discipline.
            </p>

            <div className="hero-form">
              <label className="field">
                <span>Pickup Location</span>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(event) => setPickupAddress(event.target.value)}
                  placeholder="e.g. Levent Financial District"
                />
              </label>

              <label className="field">
                <span>Destination</span>
                <input
                  type="text"
                  value={dropoffAddress}
                  onChange={(event) => setDropoffAddress(event.target.value)}
                  placeholder="e.g. Nisantasi Corporate Office"
                />
              </label>

              <label className="field">
                <span>Service Tier</span>
                <select value={courierType} onChange={(event) => setCourierType(event.target.value)}>
                  {courierServices.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="cta-row">
                <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <span className="btn-icon"><WhatsAppIcon /></span>
                  Initiate Premium Courier Request
                </a>
                <a className="btn btn-whatsapp" href="tel:05303219004">
                  <span className="btn-icon"><PhoneIcon /></span>
                  Contact Priority Desk
                </a>
              </div>

              <button
                type="button"
                className="btn btn-notify"
                onClick={requestPushPermission}
              >
                Enable Push Notifications
              </button>
              <p className="notify-status">
                Notification Access Status: <strong>{notificationState}</strong>
              </p>
            </div>

            <div className="trust-strip">
              <span>Priority Protected Handling</span>
              <span>Real-Time Precision Monitoring</span>
              <span>24/7 Executive Operations</span>
            </div>
          </div>

          <aside className="hero-visual" aria-hidden="true">
            <div className="map-card">
              <div className="map-grid" />
              <div className="route route-a" />
              <div className="route route-b" />
              <div className="dot dot-start" />
              <div className="dot dot-end" />
              <div className="token token-moto">Priority</div>
              <div className="token token-vip">Private</div>
              <div className="token token-acil">Secure</div>
            </div>
          </aside>
        </section>

        <section className="container section-block tracking-shell">
          <div className="section-head">
            <p className="eyebrow">Real-time tracking</p>
            <h2>Live Mission Status</h2>
          </div>
          <article className="tracking-card">
            <div className="tracking-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={trackingProgress}>
              <span style={{ width: `${trackingProgress}%` }} />
            </div>
            <h3>{trackingTimeline[trackingStep].title}</h3>
            <p>{trackingTimeline[trackingStep].detail}</p>
            <p className="tracking-eta">{trackingTimeline[trackingStep].eta}</p>
          </article>
        </section>

        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Service tiers</p>
            <h2>Select your operational confidence level</h2>
          </div>
          <div className="service-grid">
            {courierServices.map((service) => (
              <article key={service.value} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container section-block">
          <div className="section-head">
            <p className="eyebrow">Operating model</p>
            <h2>Three-step premium dispatch flow</h2>
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
          <h2>District Coverage</h2>
          <div className="district-grid">
            {districts.map((district) => (
              <Link key={district.slug} href={`/${district.slug}/`} className="district-card">
                <h3>{district.name} Executive Courier</h3>
                <p>{district.shortText}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-block faq-panel">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2>Answers for premium operations</h2>
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
        <a className="fab fab-wa" href="https://wa.me/905303219004" target="_blank" rel="noreferrer">
          <span className="btn-icon"><WhatsAppIcon /></span>
          WhatsApp Concierge
        </a>
        <a className="fab fab-call" href="tel:05303219004">
          <span className="btn-icon"><PhoneIcon /></span>
          Priority Call
        </a>
      </div>
    </>
  );
}
