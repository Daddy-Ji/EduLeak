import { Link } from "@tanstack/react-router";
import { LEVELS, SITE_NAME } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="container-edit py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-ink">
            Edu<span className="italic font-normal">Leak</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            A free, hand-curated library of courses for students from class 9 through college.
            No paywalls, no fluff — just the material you need.
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Browse</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-ink">All courses</Link></li>
            {LEVELS.map((l) => (
              <li key={l.slug}>
                <Link to="/levels/$level" params={{ level: l.slug }} className="hover:text-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{SITE_NAME}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-ink">About</Link></li>
            <li><Link to="/contact" className="hover:text-ink">Contact</Link></li>
            <li><Link to="/login" className="hover:text-ink">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-edit pb-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {SITE_NAME}. Free for every learner.</p>
        <p className="italic">“Sapere aude.” — Dare to know.</p>
      </div>
    </footer>
  );
}
