import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPublishedCourses } from "@/lib/courses.functions";
import { CourseCard } from "@/components/course-card";
import { LEVELS, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

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
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="blob bg-gold/40 size-72 -top-20 -left-10 animate-blob" />
        <div className="blob bg-gold-soft/60 size-80 top-40 -right-16 animate-blob" style={{ animationDelay: "3s" }} />
        <div className="container-edit relative pt-12 sm:pt-24 pb-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground animate-fade-up">
            № 001 · A reading room for students
          </p>
          <h1 className="mt-5 font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] text-ink animate-fade-up delay-100">
            Learn freely,
            <br />
            <span className="italic font-normal shimmer-text">without the paywall.</span>
          </h1>
          <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-6 items-end animate-fade-up delay-200">
            <p className="max-w-xl text-base sm:text-lg text-ink/80">
              EduLeak is a hand-curated library of free courses, video lessons, and PDF notes for
              students from <em>class 9 through college</em> — plus dedicated tracks for <strong>JEE</strong> and <strong>NEET</strong>.
            </p>
            <Link
              to="/courses"
              className="self-start sm:self-end inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-sm uppercase tracking-[0.18em] hover:gap-4 transition-all"
            >
              Browse the library →
            </Link>
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="container-edit py-12">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl sm:text-3xl">Recent additions</h2>
            <Link to="/courses" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink">All →</Link>
          </div>
          {data.courses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10">No courses yet. The library is being assembled.</p>
          ) : (
            <div>
              {data.courses.map((c, i) => (
                <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                  <CourseCard course={c} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rule">
        <div className="container-edit py-12">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">By level</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-border">
            {LEVELS.map((l, i) => (
              <Link
                key={l.slug}
                to="/levels/$level"
                params={{ level: l.slug }}
                className="bg-background p-5 group hover:bg-mist transition-all hover-lift animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p className="num-display text-2xl text-gold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-display text-lg">{l.label}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
