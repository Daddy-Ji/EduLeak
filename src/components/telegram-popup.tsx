import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import { TELEGRAM_URL, SITE_NAME } from "@/lib/seo";

const KEY = "eduleak.telegram.dismissed.v1";

export function TelegramPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(KEY)) return;
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    try { window.localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tg-pop-title"
    >
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        onClick={dismiss}
      />
      <div className="relative w-full max-w-md rounded-md bg-card border border-border shadow-2xl overflow-hidden animate-scale-in">
        <div className="absolute -top-16 -right-16 size-44 rounded-full bg-gold/40 blur-3xl pointer-events-none" />
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 p-1.5 text-ink/60 hover:text-ink"
        >
          <X className="size-4" />
        </button>
        <div className="p-6 sm:p-8 relative">
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-gold/20 text-ink ring-1 ring-gold/40">
            <Send className="size-5" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            № 002 · Stay in the loop
          </p>
          <h2 id="tg-pop-title" className="mt-2 font-display text-2xl sm:text-3xl leading-tight">
            Join the official <span className="italic">{SITE_NAME}</span> Telegram channel
          </h2>
          <p className="mt-3 text-sm text-ink/75">
            New courses, PDF notes, JEE & NEET drops — delivered the moment they go live. Free, no spam.
          </p>
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center gap-3">
            <button
              onClick={dismiss}
              className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink"
            >
              Maybe later
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              onClick={dismiss}
              className="sm:ml-auto inline-flex items-center justify-center gap-2 bg-ink text-paper px-5 py-3 text-sm uppercase tracking-[0.18em] hover-lift"
            >
              <Send className="size-4" /> Join channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
