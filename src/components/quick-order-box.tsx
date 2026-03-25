"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { defaultOrderMessage, whatsappLink } from "@/lib/site-data";

declare global {
  interface Window {
    google?: any;
    __googleMapsLoaderPromise__?: Promise<any>;
  }
}

const packageTypes = ["Evrak", "Paket", "Numune", "Yedek Parça", "Diğer"];

const serviceTypes = [
  "Normal Gönderi",
  "Ekspres Gönderi",
  "VIP Gönderi",
  "Vale / Özel Şoför",
];

const buildMapSearchUrl = (address: string, detail: string) => {
  const query = [address.trim(), detail.trim()].filter(Boolean).join(", ");

  if (!query) {
    return "";
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const buildDirectionsUrl = (origin: string, destination: string) => {
  if (!origin.trim() || !destination.trim()) {
    return "";
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
};

const buildRouteAddress = (address: string, detail: string) => {
  const combined = [address.trim(), detail.trim()].filter(Boolean).join(", ");

  if (!combined) {
    return "";
  }

  return combined.toLowerCase().includes("istanbul") ? combined : `${combined}, Istanbul, Turkiye`;
};

type Coordinates = {
  lat: number;
  lon: number;
};

type RoutePoint = {
  lat: number;
  lon: number;
};

type RouteEstimate = {
  distanceKm: number;
  points: RoutePoint[];
};

type GoogleRouteEstimate = {
  distanceKm: number;
  directions: any;
};

type AddressSuggestion = {
  placeId: string;
  description: string;
};

const loadGoogleMaps = (apiKey: string) => {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API anahtari yok."));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (window.__googleMapsLoaderPromise__) {
    return window.__googleMapsLoaderPromise__;
  }

  window.__googleMapsLoaderPromise__ = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-google-maps-loader="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google?.maps));
      existingScript.addEventListener("error", () => reject(new Error("Google Maps yuklenemedi.")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=tr&region=TR&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }

      reject(new Error("Google Maps nesnesi olusmadi."));
    };
    script.onerror = () => reject(new Error("Google Maps yuklenemedi."));
    document.head.appendChild(script);
  });

  return window.__googleMapsLoaderPromise__;
};

const getAddressSuggestions = async (
  apiKey: string,
  input: string,
): Promise<AddressSuggestion[]> => {
  if (!apiKey || input.trim().length < 3) {
    return [];
  }

  const maps = await loadGoogleMaps(apiKey);

  if (!maps?.places?.AutocompleteService) {
    return [];
  }

  return new Promise((resolve) => {
    const autocompleteService = new maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "tr" },
        types: ["geocode"],
      },
      (predictions: any[] | null, status: string) => {
        if (status !== maps.places.PlacesServiceStatus.OK || !predictions?.length) {
          resolve([]);
          return;
        }

        resolve(
          predictions.slice(0, 5).map((prediction) => ({
            placeId: prediction.place_id,
            description: prediction.description,
          })),
        );
      },
    );
  });
};

type AddressAutocompleteFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  suggestions: AddressSuggestion[];
  onSelectSuggestion: (suggestion: AddressSuggestion) => void;
  helperText?: string;
};

function AddressAutocompleteField({
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  suggestions,
  onSelectSuggestion,
  helperText,
}: AddressAutocompleteFieldProps) {
  return (
    <label className="grid gap-1 text-sm text-zinc-200">
      {label}
      <div className="relative">
        <input
          className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="off"
        />

        {suggestions.length ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/40">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.placeId}
                type="button"
                className="flex w-full items-start justify-start border-b border-zinc-800 px-4 py-3 text-left text-sm text-zinc-200 transition last:border-b-0 hover:bg-zinc-900 hover:text-white"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onSelectSuggestion(suggestion);
                }}
              >
                {suggestion.description}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {helperText ? <span className="text-xs leading-5 text-zinc-400">{helperText}</span> : null}
    </label>
  );
}

const geocodeAddress = async (address: string, signal: AbortSignal): Promise<Coordinates | null> => {
  const normalizedAddress = address.toLowerCase().includes("istanbul")
    ? address.trim()
    : `${address.trim()}, Istanbul, Turkiye`;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tr&q=${encodeURIComponent(normalizedAddress)}`,
    { signal },
  );

  if (!response.ok) {
    return null;
  }

  const results = (await response.json()) as Array<{ lat: string; lon: string }>;
  if (!results.length) {
    return null;
  }

  const lat = Number(results[0].lat);
  const lon = Number(results[0].lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return { lat, lon };
};

const estimateRoute = async (
  origin: string,
  destination: string,
  signal: AbortSignal,
): Promise<RouteEstimate | null> => {
  const [originCoords, destinationCoords] = await Promise.all([
    geocodeAddress(origin, signal),
    geocodeAddress(destination, signal),
  ]);

  if (!originCoords || !destinationCoords) {
    return null;
  }

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destinationCoords.lon},${destinationCoords.lat}?alternatives=true&overview=full&geometries=geojson&steps=false`,
    { signal },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    routes?: Array<{
      distance: number;
      duration: number;
      geometry?: {
        coordinates?: Array<[number, number]>;
      };
    }>;
  };

  const route = [...(data.routes || [])].sort((left, right) => left.distance - right.distance)[0];
  if (!route) {
    return null;
  }

  const distanceKm = Number((route.distance / 1000).toFixed(1));
  const points = (route.geometry?.coordinates || [])
    .map(([lon, lat]) => ({ lat, lon }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));

  if (!points.length) {
    return null;
  }

  return {
    distanceKm,
    points,
  };
};

const getShortestGoogleRoute = async (
  apiKey: string,
  origin: string,
  destination: string,
): Promise<GoogleRouteEstimate | null> => {
  const maps = await loadGoogleMaps(apiKey);

  return new Promise((resolve) => {
    const directionsService = new maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        region: "TR",
      },
      (result: any, status: string) => {
        if (status !== "OK" || !result?.routes?.length) {
          resolve(null);
          return;
        }

        const shortestRoute = [...result.routes]
          .map((route: any) => ({
            route,
            distanceMeters: (route.legs || []).reduce(
              (sum: number, leg: any) => sum + (leg.distance?.value || 0),
              0,
            ),
          }))
          .sort((left: any, right: any) => left.distanceMeters - right.distanceMeters)[0];

        if (!shortestRoute?.route || !Number.isFinite(shortestRoute.distanceMeters)) {
          resolve(null);
          return;
        }

        resolve({
          distanceKm: Number((shortestRoute.distanceMeters / 1000).toFixed(1)),
          directions: {
            ...result,
            routes: [shortestRoute.route],
          },
        });
      },
    );
  });
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error("timeout")), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
};

export function QuickOrderBox() {
  const [pickup, setPickup] = useState("");
  const [pickupDetail, setPickupDetail] = useState("");
  const [pickupContactName, setPickupContactName] = useState("");
  const [pickupContactPhone, setPickupContactPhone] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [dropoffDetail, setDropoffDetail] = useState("");
  const [dropoffContactName, setDropoffContactName] = useState("");
  const [dropoffContactPhone, setDropoffContactPhone] = useState("");
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [packageType, setPackageType] = useState(packageTypes[0]);
  const [routeEstimate, setRouteEstimate] = useState<RouteEstimate | null>(null);
  const [isEstimatingRoute, setIsEstimatingRoute] = useState(false);
  const [routeEstimateError, setRouteEstimateError] = useState("");
  const [isGoogleRouteActive, setIsGoogleRouteActive] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<AddressSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<AddressSuggestion[]>([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState<"pickup" | "dropoff" | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  const canPreviewRoute = pickup.trim().length > 2 && dropoff.trim().length > 2;
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const pickupRouteAddress = useMemo(() => buildRouteAddress(pickup, pickupDetail), [pickup, pickupDetail]);
  const dropoffRouteAddress = useMemo(() => buildRouteAddress(dropoff, dropoffDetail), [dropoff, dropoffDetail]);

  const pickupMapsUrl = useMemo(() => buildMapSearchUrl(pickup, pickupDetail), [pickup, pickupDetail]);
  const dropoffMapsUrl = useMemo(
    () => buildMapSearchUrl(dropoff, dropoffDetail),
    [dropoff, dropoffDetail],
  );
  const routeMapsUrl = useMemo(
    () => buildDirectionsUrl(pickupRouteAddress || pickup, dropoffRouteAddress || dropoff),
    [pickupRouteAddress, dropoffRouteAddress, pickup, dropoff],
  );

  const publicDirectionsEmbedSrc = useMemo(() => {
    if (!canPreviewRoute) {
      return "";
    }

    const qPickup = encodeURIComponent(pickupRouteAddress || pickup);
    const qDropoff = encodeURIComponent(dropoffRouteAddress || dropoff);
    return `https://www.google.com/maps?saddr=${qPickup}&daddr=${qDropoff}&hl=tr&output=embed`;
  }, [pickupRouteAddress, dropoffRouteAddress, pickup, dropoff, canPreviewRoute]);

  const routePreview = useMemo(() => {
    if (!routeEstimate?.points.length) {
      return null;
    }

    const width = 100;
    const height = 100;
    const padding = 10;
    const lats = routeEstimate.points.map((point) => point.lat);
    const lons = routeEstimate.points.map((point) => point.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const lonSpan = Math.max(maxLon - minLon, 0.001);
    const latSpan = Math.max(maxLat - minLat, 0.001);

    const project = (point: RoutePoint) => {
      const x = padding + ((point.lon - minLon) / lonSpan) * (width - padding * 2);
      const y = height - padding - ((point.lat - minLat) / latSpan) * (height - padding * 2);
      return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
    };

    const projectedPoints = routeEstimate.points.map(project);
    const polyline = projectedPoints.map((point) => `${point.x},${point.y}`).join(" ");

    return {
      polyline,
      start: projectedPoints[0],
      end: projectedPoints[projectedPoints.length - 1],
    };
  }, [routeEstimate]);

  useEffect(() => {
    if (!mapsApiKey || pickup.trim().length < 3) {
      setPickupSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const suggestions = await getAddressSuggestions(mapsApiKey, pickup);

        if (!cancelled) {
          setPickupSuggestions(suggestions);
        }
      } catch {
        if (!cancelled) {
          setPickupSuggestions([]);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pickup, mapsApiKey]);

  useEffect(() => {
    if (!mapsApiKey || dropoff.trim().length < 3) {
      setDropoffSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const suggestions = await getAddressSuggestions(mapsApiKey, dropoff);

        if (!cancelled) {
          setDropoffSuggestions(suggestions);
        }
      } catch {
        if (!cancelled) {
          setDropoffSuggestions([]);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [dropoff, mapsApiKey]);

  useEffect(() => {
    if (!canPreviewRoute) {
      setRouteEstimate(null);
      setIsEstimatingRoute(false);
      setRouteEstimateError("");
      setIsGoogleRouteActive(false);
      return;
    }

    if (typeof window !== "undefined" && window.location.protocol === "file:") {
      setRouteEstimate(null);
      setIsEstimatingRoute(false);
      setIsGoogleRouteActive(false);
      setRouteEstimateError("Bu bolum tarayicida dosya olarak acilinca calismaz. Siteyi sunucu uzerinden acin.");
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setIsEstimatingRoute(true);
      setRouteEstimateError("");
      setIsGoogleRouteActive(false);

      try {
        // Km bilgisini her durumda gostermek icin once bagimsiz rota hesabini dene.
        const result = await estimateRoute(pickupRouteAddress || pickup, dropoffRouteAddress || dropoff, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        if (!result) {
          setRouteEstimate(null);
          setRouteEstimateError("Mesafe ve rota hesaplanamadi. Adresleri biraz daha net yazin veya Google Maps baglantisini kullanin.");
        } else {
          setRouteEstimate(result);
          setRouteEstimateError("");
        }

        // Diger Google Maps entegrasyonlari sorun cikarsa bile kutu calismaya devam etsin.
        if (mapsApiKey && pickupRouteAddress && dropoffRouteAddress && mapContainerRef.current) {
          try {
            const googleRoute = await withTimeout(
              getShortestGoogleRoute(mapsApiKey, pickupRouteAddress, dropoffRouteAddress),
              2400,
            );

            if (controller.signal.aborted || !googleRoute || !window.google?.maps || !mapContainerRef.current) {
              return;
            }

            if (!googleMapRef.current) {
              googleMapRef.current = new window.google.maps.Map(mapContainerRef.current, {
                zoom: 11,
                center: { lat: 41.0082, lng: 28.9784 },
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
              });
            }

            if (!directionsRendererRef.current) {
              directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
                map: googleMapRef.current,
                suppressMarkers: false,
                preserveViewport: false,
                polylineOptions: {
                  strokeColor: "#facc15",
                  strokeOpacity: 0.95,
                  strokeWeight: 6,
                },
              });
            }

            directionsRendererRef.current.setMap(googleMapRef.current);
            directionsRendererRef.current.setDirections(googleRoute.directions);
            setRouteEstimate((previous) => ({
              distanceKm: googleRoute.distanceKm,
              points: previous?.points || [],
            }));
            setIsGoogleRouteActive(true);
          } catch {
            setIsGoogleRouteActive(false);
          }
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setRouteEstimate(null);
        setRouteEstimateError("Mesafe ve rota hesaplanamadi. Adresleri biraz daha net yazin veya Google Maps baglantisini kullanin.");
        setIsGoogleRouteActive(false);
      } finally {
        if (!controller.signal.aborted) {
          setIsEstimatingRoute(false);
        }
      }
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [pickup, dropoff, pickupRouteAddress, dropoffRouteAddress, canPreviewRoute, mapsApiKey]);

  useEffect(() => {
    if (!canPreviewRoute && directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
      googleMapRef.current = null;
    }
  }, [canPreviewRoute]);

  const waHref = useMemo(() => {
    const message = [
      "Merhaba, kurye fiyat bilgisi almak istiyorum.",
      "",
      "ALIŞ BİLGİLERİ",
      `Adres: ${pickup || "Belirtilecek"}`,
      pickupDetail ? `Adres detayı: ${pickupDetail}` : null,
      pickupContactName ? `Kişi / kurum: ${pickupContactName}` : null,
      pickupContactPhone ? `Telefon: ${pickupContactPhone}` : null,
      pickupMapsUrl ? `Google Maps alış konumu: ${pickupMapsUrl}` : null,
      "",
      "TESLİMAT BİLGİLERİ",
      `Adres: ${dropoff || "Belirtilecek"}`,
      dropoffDetail ? `Teslimat adres detayı: ${dropoffDetail}` : null,
      dropoffContactName ? `Kişi / kurum: ${dropoffContactName}` : null,
      dropoffContactPhone ? `Telefon: ${dropoffContactPhone}` : null,
      dropoffMapsUrl ? `Google Maps teslimat konumu: ${dropoffMapsUrl}` : null,
      "",
      "ROTA",
      routeEstimate
        ? `Tahmini mesafe: ${routeEstimate.distanceKm} km.`
        : "Tahmini mesafe: Google Maps rota baglantisinda gorulebilir.",
      routeMapsUrl ? `Google Maps rota: ${routeMapsUrl}` : null,
      "",
      "GÖNDERİ",
      `Gönderi seçeneği: ${serviceType}`,
      `Gönderi içeriği: ${packageType}`,
      "Mümkünse en hızlı yönlendirme için dönüş rica ederim.",
    ]
      .filter((item) => item !== null)
      .join("\n");

    return whatsappLink(message || defaultOrderMessage);
  }, [
    pickup,
    pickupDetail,
    pickupContactName,
    pickupContactPhone,
    pickupMapsUrl,
    dropoff,
    dropoffDetail,
    dropoffContactName,
    dropoffContactPhone,
    dropoffMapsUrl,
    routeEstimate,
    routeMapsUrl,
    serviceType,
    packageType,
  ]);

  return (
    <section
      id="hizli-fiyat"
      className="w-full min-w-0 rounded-3xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl shadow-yellow-400/10 sm:p-5 md:p-7"
      aria-label="Hızlı sipariş kutusu"
    >
      <h2 className="font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
        1 Dakikada Fiyat Al
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-300">
        Alış ve teslimat noktalarını yazın, adres önerilerinden seçim yapın, en kısa rota
        bilgisini görün ve detayları doğrudan WhatsApp&apos;ta bize iletin.
      </p>

      <form className="mt-5 grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-4 md:grid-cols-2 md:items-start">
          <div className="grid min-w-0 gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
              Alış Noktası
            </p>

          <AddressAutocompleteField
            label="Nereden alınacak?"
            placeholder="Örnek: Şişli, Mecidiyeköy"
            value={pickup}
            onChange={setPickup}
            onFocus={() => setActiveSuggestionField("pickup")}
            onBlur={() => window.setTimeout(() => setActiveSuggestionField((current) => (current === "pickup" ? null : current)), 120)}
            suggestions={activeSuggestionField === "pickup" ? pickupSuggestions : []}
            onSelectSuggestion={(suggestion) => {
              setPickup(suggestion.description);
              setPickupSuggestions([]);
              setActiveSuggestionField(null);
            }}
            helperText={mapsApiKey ? "Google adres onerileriyle hizli secim yapabilirsiniz." : "Adresi ilce, mahalle ve sokak bilgisiyle net yazin."}
          />

          <label className="grid gap-1 text-sm text-zinc-200">
            Alış adres detayı
            <input
              className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
              placeholder="Bina adı, kat, kapı no, daire no"
              value={pickupDetail}
              onChange={(event) => setPickupDetail(event.target.value)}
            />
          </label>

          <label className="grid gap-1 text-sm text-zinc-200">
            Alınacak kişi / kurum adı
            <input
              className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
              placeholder="Ad soyad veya kurum adı"
              value={pickupContactName}
              onChange={(event) => setPickupContactName(event.target.value)}
            />
          </label>

            <label className="grid gap-1 text-sm text-zinc-200">
              Alınacak kişi / kurum telefonu
              <input
                className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
                placeholder="05xx xxx xx xx"
                value={pickupContactPhone}
                onChange={(event) => setPickupContactPhone(event.target.value)}
                inputMode="tel"
              />
            </label>
          </div>

          <div className="grid min-w-0 gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
              Teslimat Noktası
            </p>

            <AddressAutocompleteField
              label="Nereye teslim?"
              placeholder="Örnek: Kadıköy, Fenerbahçe"
              value={dropoff}
              onChange={setDropoff}
              onFocus={() => setActiveSuggestionField("dropoff")}
              onBlur={() => window.setTimeout(() => setActiveSuggestionField((current) => (current === "dropoff" ? null : current)), 120)}
              suggestions={activeSuggestionField === "dropoff" ? dropoffSuggestions : []}
              onSelectSuggestion={(suggestion) => {
                setDropoff(suggestion.description);
                setDropoffSuggestions([]);
                setActiveSuggestionField(null);
              }}
              helperText={mapsApiKey ? "Google adres onerileriyle hizli secim yapabilirsiniz." : "Adresi ilce, mahalle ve sokak bilgisiyle net yazin."}
            />

            <label className="grid gap-1 text-sm text-zinc-200">
              Teslimat adres detayı
              <input
                className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
                placeholder="Bina adı, kat, kapı no, daire no"
                value={dropoffDetail}
                onChange={(event) => setDropoffDetail(event.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm text-zinc-200">
              Teslim edilecek kişi / kurum adı
              <input
                className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
                placeholder="Alıcı adı veya kurum adı"
                value={dropoffContactName}
                onChange={(event) => setDropoffContactName(event.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm text-zinc-200">
              Teslim edilecek kişi / kurum telefonu
              <input
                className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
                placeholder="05xx xxx xx xx"
                value={dropoffContactPhone}
                onChange={(event) => setDropoffContactPhone(event.target.value)}
                inputMode="tel"
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-200">
          <p className="font-semibold text-zinc-100">Tahmini Rota Bilgisi</p>
          {canPreviewRoute ? (
            <>
              {isEstimatingRoute ? (
                <p className="mt-1 text-zinc-300">Mesafe hesaplanıyor...</p>
              ) : null}

              {!isEstimatingRoute && routeEstimate ? (
                <p className="mt-1 text-zinc-300">
                  Tahmini mesafe: <span className="font-semibold text-zinc-100">{routeEstimate.distanceKm} km</span>
                </p>
              ) : null}

              {!isEstimatingRoute && !routeEstimate && routeEstimateError ? (
                <p className="mt-1 text-zinc-300">{routeEstimateError}</p>
              ) : null}

              <p className="mt-1 text-zinc-400">
                {routeEstimate
                  ? "En kisa surus rotasi secildi ve onizleme asagida gosteriliyor."
                  : "Rota onizlemesi hazir oldugunda burada en kisa surus bilgisi gosterilir."}
              </p>
            </>
          ) : (
            <p className="mt-1 text-zinc-400">
              Alış ve teslimat adreslerini girdikten sonra rota önizlemesi burada gösterilir.
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/70">
          {canPreviewRoute ? (
            <div className="relative h-64 w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.16),_transparent_28%),linear-gradient(135deg,_rgba(24,24,27,0.98),_rgba(39,39,42,0.95))]">
              <div
                ref={mapContainerRef}
                className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                  isGoogleRouteActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              />
              <div className={`absolute inset-0 transition-opacity ${isGoogleRouteActive ? "pointer-events-none opacity-0" : "opacity-30"}`} style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              {!isGoogleRouteActive && routePreview ? (
                <>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <polyline
                      points={routePreview.polyline}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx={routePreview.start.x} cy={routePreview.start.y} r="3.8" fill="#22c55e" />
                    <circle cx={routePreview.end.x} cy={routePreview.end.y} r="3.8" fill="#ef4444" />
                  </svg>
                  <div className="absolute left-4 top-4 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    Alis
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-200">
                    Teslim
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-white">En kisa surus rotasi onizlemesi</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-300">
                      {routeEstimate?.distanceKm} km • Google Maps butonu ile disarida da acabilirsiniz.
                    </p>
                  </div>
                </>
              ) : !isGoogleRouteActive && publicDirectionsEmbedSrc ? (
                <iframe
                  title="Google Maps rota onizlemesi"
                  src={publicDirectionsEmbedSrc}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : !isGoogleRouteActive ? (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-zinc-300">
                  {isEstimatingRoute
                    ? "En kisa rota ciziliyor..."
                    : "Adresler netlesince burada en kisa surus rotasi cizilecek."}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center px-6 text-center text-sm leading-6 text-zinc-400">
              Alış ve teslimat adreslerini girdikten sonra rota önizlemesi burada gösterilir.
            </div>
          )}
        </div>

        {routeMapsUrl ? (
          <a
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-300"
            href={routeMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Maps&apos;te Rotayı Aç
          </a>
        ) : null}

        <label className="grid gap-1 text-sm text-zinc-200">
          Gönderi seçeneği
          <select
            className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-zinc-200">
          Gönderi içeriği
          <select
            className="h-12 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition focus:border-yellow-400"
            value={packageType}
            onChange={(event) => setPackageType(event.target.value)}
          >
            {packageTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <a
          className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-yellow-300"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp&apos;tan Fiyat Al
        </a>
      </form>
    </section>
  );
}