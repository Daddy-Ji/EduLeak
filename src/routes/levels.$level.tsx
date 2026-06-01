import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPublishedCourses } from "@/lib/courses.functions";
import { CourseCard } from "@/components/course-card";
import { LEVELS } from "@/lib/seo";

const qo = (level: string) =>
  queryOptions({ queryKey: ["courses", "level", level], queryFn: () => listPublishedCourses({ data: { level } }) });

export const Route = createFileRoute("/levels/$level")({
  loader: async ({ context, params }) => {
    const match = LEVELS.find((l) => l.slug === params.level);
    if (!match) throw notFound();
    const data = await context.queryClient.ensureQueryData(qo(params.level));
    return { ...data, label: match.label };
  },
  head: ({ params, loaderData }) => {
    const label = loaderData?.label ?? params.level;
    const title = `${label} — Free courses | EduLeak`;
    const desc = `Free ${label} courses, videos, and notes. Hand-picked for Indian and international students.`;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        { property: "og:url", content: `/levels/${params.level}` },
      ],
      links: [{ rel: "canonical", href: `/levels/${params.level}` }],
    };
  },
  notFoundComponent: () => <p className="container-edit py-16">Level not found.</p>,
  errorComponent: ({ error }) => <p className="container-edit py-16 text-sm">{error.message}</p>,
  component: LevelPage,
});

function LevelPage() {
  const { courses, label } = Route.useLoaderData();
  return (
    <div className="container-edit py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Level</p>
      <h1 className="mt-2 font-display text-4xl sm:text-6xl">{label}</h1>
      <div className="mt-8">
        {courses.length === 0
          ? <p className="text-sm text-muted-foreground py-8">No courses for this level yet.</p>
          : courses.map((c: any, i: number) => <CourseCard key={c.id} course={c} index={i} />)}
      </div>
    </div>
  );
}
