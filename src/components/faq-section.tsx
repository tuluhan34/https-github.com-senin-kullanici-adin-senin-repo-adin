import { faqItems } from "@/lib/site-data";

export function FaqSection() {
  const items = faqItems.slice(0, 8);

  return (
    <div className="mt-6 grid gap-3">
      {items.map((item) => {
        return (
          <details
            key={item.question}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="text-sm font-semibold text-zinc-900">{item.question}</span>
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-transform duration-300 group-open:rotate-45">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-7 text-zinc-600">{item.answer}</p>
          </details>
        );
      })}
    </div>
  );
}
