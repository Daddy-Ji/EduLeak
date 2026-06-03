import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { listPublishedCourses } from "@/lib/courses.functions";
import { CourseCard } from "@/components/course-card";
import { HeroIllustration } from "@/components/hero-illustration";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { INSTITUTES, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

const featuredQO = queryOptions({
  queryKey: ["courses", "featured"],
  queryFn: () => listPublishedCourses({ data: { limit: 6 } }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — Free courses, class 9 to college` },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: `${SITE_NAME} — Free courses, class 9 to college` },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredQO),
  errorComponent: ({ error }) => <p className="container-edit py-16 text-sm text-muted-foreground">Couldn't load: {error.message}</p>,
  notFoundComponent: () => <p className="container-edit py-16">Not found.</p>,
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(featuredQO);
  useScrollReveal();

  useEffect(() => {
    const addBackgroundParticles = () => {
      const bgElements = document.querySelectorAll('.bg-particles-container');
      bgElements.forEach((container) => {
        if (container.children.length === 0) {
          for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${(i % 5) + 1}`;
            particle.style.width = `${20 + Math.random() * 40}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.background = `oklch(0.74 0.12 80 / ${0.1 + Math.random() * 0.2})`;
            (container as HTMLElement).appendChild(particle);
          }
        }
      });
    };

    addBackgroundParticles();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-particles-container">
        <div className="blob bg-[#FFD1A8]/50 size-72 -top-20 -left-10 animate-blob" />
        <div className="blob bg-[#F4A85E]/40 size-80 top-40 -right-16 animate-blob" style={{ animationDelay: "3s" }} />
        <div className="blob bg-[#E8C05E]/30 size-96 bottom-0 -left-1/3 animate-float-drift" style={{ animationDelay: "5s" }} />
        <div className="container-edit relative pt-12 sm:pt-20 pb-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground animate-fade-up">
                № 001 · A reading room for students — EduLeak
              </p>
              <h1 className="mt-5 font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] text-ink animate-fade-up delay-100">
                Learn freely,
                <br />
                <span className="italic font-normal shimmer-text">without the paywall.</span>
              </h1>
              <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-6 items-end animate-fade-up delay-200">
                <p className="max-w-xl text-base sm:text-lg text-ink/80">
                  EduLeak is a hand-curated library of free courses, video lessons, and PDF notes from India's top coaching institutes.
                </p>
                <Link
                  to="/courses"
                  className="self-start sm:self-end inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-sm uppercase tracking-[0.18em] hover:gap-4 transition-all"
                >
                  Browse the library →
                </Link>
              </div>
            </div>
            <div className="order-first lg:order-none">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="container-edit py-12">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl sm:text-3xl scroll-reveal">Recent additions</h2>
            <Link to="/courses" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink">All →</Link>
          </div>
          {data.courses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10">No courses yet. The library is being assembled.</p>
          ) : (
            <div>
              {data.courses.map((c, i) => (
                <div key={c.id} className="scroll-reveal" style={{ animationDelay: `${i * 70}ms` }}>
                  <CourseCard course={c} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rule">
        <div className="container-edit py-12">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground scroll-reveal">By institute</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl text-ink scroll-reveal">Top coaching platforms</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {INSTITUTES.map((inst, i) => (
              <Link
                key={inst.slug}
                to="/levels/$level"
                params={{ level: inst.slug }}
                className="scroll-reveal group relative bg-background border border-border rounded-sm p-5 flex flex-col gap-3 hover:border-ink hover:shadow-md transition-all hover-lift"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-sm flex items-center justify-center shrink-0 overflow-hidden border border-border"
                    style={{ background: inst.color + "15" }}
                  >
                    <img
                      src={inst.logoUrl}
                      alt={`${inst.label} logo`}
                      className="size-7 object-contain"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.style.display = "none";
                        const fallback = el.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <span
                      className="hidden size-7 items-center justify-center font-display text-sm font-bold"
                      style={{ color: inst.color }}
                    >
                      {inst.shortLabel.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base leading-tight text-ink truncate">{inst.shortLabel}</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{inst.tagline}</p>
                <p className="mt-auto text-[10px] uppercase tracking-[0.18em] text-ink/50 group-hover:text-ink transition-colors">
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rule bg-mist/30">
        <div className="container-edit py-16">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground scroll-reveal">№ 002 · The team</p>
              <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1] text-ink scroll-reveal">
                The Masterminds <span className="italic font-normal">Behind EduLeak</span>
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-border max-w-xs" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {[
              { name: "Aarav Mehta", role: "Founder & Curator", bio: "Ex-IIT aspirant turned librarian. Believes every notebook deserves a second life.", tag: "01" },
              { name: "Saanvi Kapoor", role: "Head of Content", bio: "Maps syllabi by hand. Hunts the cleanest PDFs across the open web.", tag: "02" },
              { name: "Rohan Iyer", role: "JEE / NEET Lead", bio: "10+ years coaching. Picks problem sets the way sommeliers pick wine.", tag: "03" },
              { name: "Meera Joshi", role: "Design & Story", bio: "Treats every course page like a magazine spread. Hates clutter.", tag: "04" },
            ].map((m, i) => (
              <article
                key={m.name}
                className="bg-background p-6 sm:p-8 group hover:bg-paper transition-colors scroll-reveal"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="size-14 rounded-full bg-gradient-to-br from-gold to-gold-soft flex items-center justify-center font-display text-xl text-ink">
                    {m.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <span className="num-display text-xs text-gold">{m.tag}</span>
                </div>
                <h3 className="mt-5 font-display text-xl text-ink">{m.name}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{m.role}</p>
                <p className="mt-4 text-sm text-ink/75 leading-relaxed">{m.bio}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground italic scroll-reveal">Placeholder profiles — swap with the real team anytime.</p>
        </div>
      </section>
    </div>
  );
}
