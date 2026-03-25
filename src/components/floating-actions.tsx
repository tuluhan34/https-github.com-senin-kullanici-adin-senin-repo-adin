import Link from "next/link";
import { SITE, defaultOrderMessage, whatsappLink } from "@/lib/site-data";

export function FloatingActions() {
  return (
    <>
      <Link
        href="/"
        aria-label="Ana sayfa"
        title="Ana sayfa"
        className="fixed bottom-4 left-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-900 shadow-lg transition hover:bg-zinc-100 active:scale-95"
      >
        <span className="sr-only">Ana sayfa</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M12 3l9 8h-3v10h-5v-6H11v6H6V11H3l9-8z" />
        </svg>
      </Link>
      <div className="fixed bottom-4 right-4 z-50 grid gap-2">
      <a
        href={whatsappLink(defaultOrderMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp ile yaz"
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition hover:bg-[#1fbd59] active:scale-95"
      >
        <span className="sr-only">WhatsApp</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.14 1.6 5.94L0 24l6.34-1.66a11.87 11.87 0 0 0 5.67 1.45h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.17-3.39-8.41zm-8.5 18.31h-.01a9.84 9.84 0 0 1-5-1.37l-.36-.22-3.76.98 1-3.67-.24-.37a9.83 9.83 0 0 1-1.5-5.23c0-5.44 4.43-9.87 9.9-9.87 2.64 0 5.13 1.02 7 2.89a9.8 9.8 0 0 1 2.9 6.98c0 5.44-4.44 9.88-9.93 9.88zm5.42-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.45.13-.6.13-.12.3-.32.45-.47.15-.15.2-.25.3-.42.1-.17.05-.32-.02-.47-.08-.15-.66-1.6-.9-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.51.07-.77.37-.27.3-1.02 1-1.02 2.45 0 1.45 1.05 2.85 1.2 3.05.15.2 2.05 3.13 4.95 4.39.69.3 1.23.48 1.66.62.7.22 1.34.19 1.84.11.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z" />
        </svg>
      </a>
      <a
        href={SITE.phoneHref}
        aria-label="Ara"
        title="Hemen ara"
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-900 shadow-lg transition hover:bg-zinc-100 active:scale-95"
      >
        <span className="sr-only">Ara</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </a>
      </div>
    </>
  );
}
