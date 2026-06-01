import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPublishedCourses } from "@/lib/courses.functions";
import { CourseCard } from "@/components/course-card";
import { SUBJECTS } from "@/lib/seo";

const qo = (subject: string) =>
  queryOptions({ queryKey: ["courses", "subject", subject], queryFn: () => listPublishedCourses({ data: { subject } }) });

export const Route = createFileRoute("/subjects/$subject")({
  loader: ({ context, params }) => {
    const label = SUBJECTS.find((s) => s.toLowerCase().replace(/\s+/g, "-") === params.subject) ?? params.subject;
    return context.queryClient.ensureQueryData(qo(label as string)).then((d) => ({ ...d, label }));
  },
  head: ({ params, loaderData }) => {
    const label = loaderData?.label ?? params.subject;
    const title = `${label} courses — Free | EduLeak`;
    const desc = `Free ${label} courses, videos, and study material for students.`;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        { property: "og:url", content: `/subjects/${params.subject}` },
      ],
      links: [{ rel: "canonical", href: `/subjects/${params.subject}` }],
    };
  },
  errorComponent: ({ error }) => <p className="container-edit py-16 text-sm">{error.message}</p>,
  notFoundComponent: () => <p className="container-edit py-16">Not found.</p>,
  component: SubjectPage,
});

function SubjectPage() {
  const { courses, label } = Route.useLoaderData();
  return (
    <div className="container-edit py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Subject</p>
      <h1 className="mt-2 font-display text-4xl sm:text-6xl">{String(label)}</h1>
      <div className="mt-8">
        {courses.length === 0
          ? <p className="text-sm text-muted-foreground py-8">No courses in this subject yet.</p>
          : courses.map((c: any, i: number) => <CourseCard key={c.id} course={c} index={i} />)}
      </div>
    </div>
  );
}
