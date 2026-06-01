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
      <section className="container-edit pt-10 sm:pt-20 pb-16">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          № 001 · A reading room for students
        </p>
        <h1 className="mt-5 font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] text-ink">
          Learn freely,
          <br />
          <span className="italic font-normal">without the paywall.</span>
        </h1>
        <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
          <p className="max-w-xl text-base sm:text-lg text-ink/80">
            EduLeak is a hand-curated library of free courses, video lessons, and PDF notes for
            students from <em>class 9 through college</em> — across the sciences, commerce, and the humanities.
          </p>
          <Link
            to="/courses"
            className="self-start sm:self-end inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-sm uppercase tracking-[0.18em]"
          >
            Browse the library →
          </Link>
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
              {data.courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <section className="rule">
        <div className="container-edit py-12">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">By level</p>
          <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-5 gap-px bg-border">
            {LEVELS.map((l, i) => (
              <Link
                key={l.slug}
                to="/levels/$level"
                params={{ level: l.slug }}
                className="bg-background p-6 group hover:bg-mist transition-colors"
              >
                <p className="num-display text-3xl text-gold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-display text-xl">{l.label}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
