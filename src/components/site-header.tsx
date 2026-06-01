import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Send } from "lucide-react";
import { SITE_NAME, TELEGRAM_URL } from "@/lib/seo";

const nav = [
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-edit flex items-center justify-between gap-4 py-3 sm:py-4">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl sm:text-3xl tracking-tight text-ink">
            Edu<span className="italic font-normal">Leak</span>
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-muted-foreground">est. 2026</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-ink/80 hover:text-ink transition-colors"
              activeProps={{ className: "text-ink gold-underline" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink"
          >
            Admin
          </Link>
        </nav>
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container-edit flex flex-col py-4 gap-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="py-1 text-base text-ink">
                {n.label}
              </Link>
            ))}
            <div className="rule-thin my-2" />
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ink"
            >
              <Send className="size-4 text-gold" /> Join Telegram channel
            </a>
            <Link to="/login" className="text-[11px] mt-2 uppercase tracking-[0.2em] text-muted-foreground">
              Admin sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
