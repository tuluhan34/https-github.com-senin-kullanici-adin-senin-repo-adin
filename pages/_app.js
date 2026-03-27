import "../styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const siteUrl = "https://www.34motokuryeistanbul.com";
  const currentPath = (router.asPath || "/").split("?")[0].split("#")[0] || "/";
  const normalizedPath = currentPath === "/" ? "/" : `${currentPath.replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}${normalizedPath}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "34 Moto Kurye Istanbul",
    url: siteUrl,
    image: `${siteUrl}/brand/34motokuryeistanbul-google-logo.svg`,
    telephone: "+90 530 321 90 04",
    areaServed: "Istanbul",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    sameAs: [
      "https://wa.me/905303219004",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "34 Moto Kurye Istanbul",
    url: siteUrl,
    inLanguage: "tr-TR",
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" key="viewport" />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" key="robots" />
        <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" key="googlebot" />
        <meta name="format-detection" content="telephone=yes" key="format-detection" />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <link rel="alternate" hrefLang="tr-TR" href={canonicalUrl} key="hreflang-tr" />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} key="hreflang-default" />

        <meta property="og:site_name" content="34 Moto Kurye Istanbul" key="og:site_name" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:locale" content="tr_TR" key="og:locale" />
        <meta property="og:url" content={canonicalUrl} key="og:url" />
        <meta property="og:image" content={`${siteUrl}/brand/34motokuryeistanbul-google-logo.svg`} key="og:image" />

        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content="34 Moto Kurye Istanbul" key="twitter:title" />
        <meta name="twitter:description" content="Istanbul genelinde 7/24 acil, ekspres, VIP ve aracli kurye hizmetleri." key="twitter:description" />
        <meta name="twitter:image" content={`${siteUrl}/brand/34motokuryeistanbul-google-logo.svg`} key="twitter:image" />

        <script
          type="application/ld+json"
          key="schema-organization"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          key="schema-website"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
