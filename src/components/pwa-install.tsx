"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

type InstallButtonProps = {
  className?: string;
  label?: string;
  compact?: boolean;
};

type NotificationButtonProps = {
  className?: string;
  label?: string;
};

type ReminderSlot = {
  id: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

const INSTALL_NUDGE_STORAGE_KEY = "pwa-install-nudge-dismissed";
const NOTIFICATION_NUDGE_STORAGE_KEY = "pwa-notification-nudge-dismissed";
const NOTIFICATION_SENT_PREFIX = "pwa-notification-sent";

const isStandaloneMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as NavigatorWithStandalone).standalone === true;
};

const isIosDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

const notificationsSupported = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return "Notification" in window && "serviceWorker" in navigator;
};

const getDayToken = (date: Date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const getReminderSlots = (date: Date): ReminderSlot[] => {
  const offset = date.getDate() % 9;

  return [
    {
      id: "morning",
      hour: 9,
      minute: 35 + (offset % 8),
      title: "34 Moto Kurye operasyonu hazir",
      body: "Sabah teslimatlariniz icin kurye planlamanizi dakikalar icinde olusturabilirsiniz.",
    },
    {
      id: "midday",
      hour: 13,
      minute: 10 + (offset % 7),
      title: "Gun ortasi operasyon hatirlatmasi",
      body: "Oglen yogunlugu artmadan once kurye talebinizi hizli sekilde planlayabilirsiniz.",
    },
    {
      id: "evening",
      hour: 18,
      minute: 5 + (offset % 11),
      title: "Aksam teslimat planlamasi",
      body: "Aksam cikislariniz icin 34 Moto Kurye 7/24 operasyonuna hemen ulasabilirsiniz.",
    },
  ];
};

const buildSentKey = (slotId: string, date: Date) => `${NOTIFICATION_SENT_PREFIX}:${slotId}:${getDayToken(date)}`;

async function showGentleNotification(slot: ReminderSlot) {
  if (!notificationsSupported() || Notification.permission !== "granted") {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(slot.title, {
    body: slot.body,
    icon: "/brand/34motokuryeistanbul-google-logo.svg",
    badge: "/favicon.ico",
    tag: `kurye-${slot.id}`,
    data: { url: "/#hizli-fiyat" },
  });
}

function useNotificationState() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (!notificationsSupported()) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!notificationsSupported()) {
      setPermission("unsupported");
      return "unsupported" as const;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      await showGentleNotification({
        id: "welcome",
        hour: 0,
        minute: 0,
        title: "Bildirim tercihiniz kaydedildi",
        body: "Gun icinde en fazla 3 kisa operasyon hatirlatmasi gonderilecektir.",
      });
      window.localStorage.removeItem(NOTIFICATION_NUDGE_STORAGE_KEY);
    }

    return result;
  };

  return {
    permission,
    supported: permission !== "unsupported",
    granted: permission === "granted",
    denied: permission === "denied",
    requestPermission,
  };
}

function usePwaInstallState() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showManualHint, setShowManualHint] = useState(false);

  useEffect(() => {
    setIsStandalone(isStandaloneMode());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowManualHint(false);
      window.localStorage.setItem(INSTALL_NUDGE_STORAGE_KEY, "1");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canInstall = Boolean(deferredPrompt) && !isStandalone;
  const isiOS = isIosDevice() && !isStandalone;

  const install = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setIsStandalone(true);
      }

      return;
    }

    setShowManualHint(true);
  };

  return {
    canInstall,
    install,
    isStandalone,
    isiOS,
    showManualHint,
    setShowManualHint,
  };
}

export function PwaInstallButton({
  className = "inline-flex h-11 items-center rounded-full border border-zinc-600 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300",
  label = "Uygulamayi Indir",
  compact = false,
}: InstallButtonProps) {
  const { canInstall, install, isStandalone, isiOS, showManualHint, setShowManualHint } = usePwaInstallState();

  if (isStandalone) {
    return null;
  }

  return (
    <div className={compact ? "" : "relative"}>
      <button type="button" className={className} onClick={() => void install()}>
        {label}
      </button>
      {showManualHint ? (
        <div className="mt-2 max-w-xs rounded-2xl border border-zinc-700 bg-zinc-950/95 p-3 text-xs leading-6 text-zinc-300 shadow-xl">
          {canInstall ? (
            <p>Kurulum penceresi acildiginda onay vererek uygulamayi cihaziniza ekleyebilirsiniz.</p>
          ) : isiOS ? (
            <p>iPhone ve iPad cihazlarda Safari icindeki Paylas menusu uzerinden Ana Ekrana Ekle adimini kullanabilirsiniz.</p>
          ) : (
            <p>Chrome veya Edge menusunda yer alan uygulama yukleme secenegi ile kurulum yapabilirsiniz. Bu ozellik HTTPS ortaminda calisir.</p>
          )}
          <button
            type="button"
            className="mt-2 text-yellow-300 underline underline-offset-4"
            onClick={() => setShowManualHint(false)}
          >
            Kapat
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PwaNotificationButton({
  className = "inline-flex h-11 items-center justify-center rounded-full border border-zinc-700 px-4 text-sm font-semibold text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-300",
  label = "Bildirim Izinlerini Ac",
}: NotificationButtonProps) {
  const { supported, granted, denied, requestPermission } = useNotificationState();
  const [showHint, setShowHint] = useState(false);

  if (!supported || granted) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={className}
        onClick={() => {
          void requestPermission();
          setShowHint(true);
        }}
      >
        {label}
      </button>
      {showHint ? (
        <div className="mt-2 max-w-xs rounded-2xl border border-zinc-700 bg-zinc-950/95 p-3 text-xs leading-6 text-zinc-300 shadow-xl">
          {denied ? (
            <p>Tarayici bildirim izni su an kapali. Ayarlardan izin verdiginizde gun icinde en fazla 3 kisa operasyon bildirimi ile bilgilendirme yapilir.</p>
          ) : (
            <p>Bildirim izni verildiginde sabah, oglen ve aksam saatlerinde sinirli sayida, kisa ve profesyonel operasyon hatirlatmalari gonderilir.</p>
          )}
          <button
            type="button"
            className="mt-2 text-yellow-300 underline underline-offset-4"
            onClick={() => setShowHint(false)}
          >
            Kapat
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PwaInstallNudge() {
  const { canInstall, install, isStandalone, isiOS } = usePwaInstallState();
  const { supported, granted, requestPermission } = useNotificationState();
  const [installDismissed, setInstallDismissed] = useState(true);
  const [notificationDismissed, setNotificationDismissed] = useState(true);

  useEffect(() => {
    const wasDismissed = window.localStorage.getItem(INSTALL_NUDGE_STORAGE_KEY) === "1";
    setInstallDismissed(wasDismissed);
    const notificationWasDismissed = window.localStorage.getItem(NOTIFICATION_NUDGE_STORAGE_KEY) === "1";
    setNotificationDismissed(notificationWasDismissed);
  }, []);

  const shouldShowInstall = useMemo(
    () => !installDismissed && !isStandalone && (canInstall || isiOS),
    [canInstall, installDismissed, isStandalone, isiOS],
  );
  const shouldShowNotification = useMemo(
    () => !notificationDismissed && supported && !granted,
    [granted, notificationDismissed, supported],
  );
  const shouldShow = shouldShowInstall || shouldShowNotification;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const wasDismissed = window.localStorage.getItem(INSTALL_NUDGE_STORAGE_KEY) === "1";
    if (!wasDismissed) {
      const timer = window.setTimeout(() => setInstallDismissed(false), 900);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const wasDismissed = window.localStorage.getItem(NOTIFICATION_NUDGE_STORAGE_KEY) === "1";
    if (!wasDismissed) {
      const timer = window.setTimeout(() => setNotificationDismissed(false), 1200);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-2xl overflow-hidden rounded-[2rem] border border-zinc-800 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.18),_transparent_28%),linear-gradient(135deg,_rgba(9,9,11,0.98),_rgba(24,24,27,0.96))] p-5 text-white shadow-[0_26px_70px_rgba(0,0,0,0.42)] backdrop-blur">
      <div className="absolute -right-10 top-4 h-32 w-32 rounded-full border border-white/10 bg-white/5 blur-2xl" />
      <div className="relative grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300">Cepte Uygulama Modu</p>
          <h3 className="mt-2 font-display text-3xl uppercase tracking-wide">Uygulamayi indirin, hizli erisim saglayin</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            34 Moto Kurye'yi ana ekraniniza ekleyerek tek dokunusla erisebilir, bildirim izni verirseniz gun icinde sinirli sayida operasyon bilgilendirmesi alabilirsiniz.
          </p>
        </div>

        <div className="grid gap-3">
          {shouldShowInstall ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Uygulama Kurulumu</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">Android, masaustu Chrome ve uyumlu tarayicilarda hizli kurulum desteklenir. iPhone tarafinda Ana Ekrana Ekle akisi kullanilir.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void install()}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-bold text-zinc-950 transition hover:bg-yellow-300"
                >
                  Uygulamayi Indir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInstallDismissed(true);
                    window.localStorage.setItem(INSTALL_NUDGE_STORAGE_KEY, "1");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-700 px-4 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          ) : null}

          {shouldShowNotification ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Bildirim</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">Izin verirseniz gun icinde en fazla 3 adet kisa ve olculu operasyon bildirimi gonderilir. Saatler dogal kullanim akisini bozmayacak sekilde dagitilir.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void requestPermission()}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-300/10 px-5 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-300/20"
                >
                  Bildirim Izinlerini Ac
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationDismissed(true);
                    window.localStorage.setItem(NOTIFICATION_NUDGE_STORAGE_KEY, "1");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-700 px-4 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                >
                  Kapat
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PwaNotificationBridge() {
  const { granted, supported } = useNotificationState();

  useEffect(() => {
    if (!supported || !granted) {
      return;
    }

    const now = new Date();
    const slots = getReminderSlots(now);
    const timers: number[] = [];

    const queueSlot = (slot: ReminderSlot) => {
      const trigger = new Date(now);
      trigger.setHours(slot.hour, slot.minute, 0, 0);

      const sentKey = buildSentKey(slot.id, now);
      const diff = trigger.getTime() - Date.now();

      if (window.localStorage.getItem(sentKey) === "1") {
        return;
      }

      if (diff <= 0 && Math.abs(diff) < 45 * 60 * 1000) {
        void showGentleNotification(slot).then(() => window.localStorage.setItem(sentKey, "1"));
        return;
      }

      if (diff > 0) {
        const timer = window.setTimeout(() => {
          void showGentleNotification(slot).then(() => window.localStorage.setItem(sentKey, "1"));
        }, diff);
        timers.push(timer);
      }
    };

    slots.forEach(queueSlot);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [granted, supported]);

  return null;
}

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // Local gelistirmede service worker stale cache uretebildigi icin tamamen kapat.
    if (isLocalhost) {
      const clearLocalSw = async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));

          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
          }
        } catch {
          // Local temizlik sessiz gecsin.
        }
      };

      void clearLocalSw();
      return;
    }

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        // Kurulum denemesi sessiz kalsin.
      }
    };

    void register();
  }, []);

  return null;
}