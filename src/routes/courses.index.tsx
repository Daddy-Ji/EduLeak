import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPublishedCourses } from "@/lib/courses.functions";
import { CourseCard } from "@/components/course-card";
import { LEVELS, SUBJECTS } from "@/lib/seo";

const qo = queryOptions({
  queryKey: ["courses", "all"],
  queryFn: () => listPublishedCourses({ data: {} }),
});

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "All free courses — EduLeak" },
      { name: "description", content: "Browse every free course on EduLeak — videos, notes, and PDFs for class 9 to college." },
      { property: "og:title", content: "All free courses — EduLeak" },
      { property: "og:description", content: "Browse every free course on EduLeak." },
      { property: "og:url", content: "/courses" },
    ],
    links: [{ rel: "canonical", href: "/courses" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  errorComponent: ({ error }) => <p className="container-edit py-16 text-sm">{error.message}</p>,
  notFoundComponent: () => <p className="container-edit py-16">Not found.</p>,
  component: CoursesPage,
});

function CoursesPage() {
  const { data } = useSuspenseQuery(qo);
  return (
    <div className="container-edit py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">The Library</p>
      <h1 className="mt-3 font-display text-4xl sm:text-6xl">All courses</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr]">
        <aside className="md:border-r md:border-border md:pr-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Levels</p>
          <ul className="space-y-1.5 text-sm">
            {LEVELS.map((l) => (
              <li key={l.slug}>
                <Link to="/levels/$level" params={{ level: l.slug }} className="hover:text-ink text-ink/75">{l.label}</Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Subjects</p>
          <ul className="space-y-1.5 text-sm">
            {SUBJECTS.map((s) => (
              <li key={s}>
                <Link to="/subjects/$subject" params={{ subject: s.toLowerCase().replace(/\s+/g, "-") }} className="hover:text-ink text-ink/75">{s}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <div>
          {data.courses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10">No courses published yet.</p>
          ) : (
            data.courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)
          )}
        </div>
      </div>
    </div>
  );
}
