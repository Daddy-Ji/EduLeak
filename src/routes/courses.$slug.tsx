import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedCourseBySlug } from "@/lib/courses.functions";
import { youtubeEmbed } from "@/lib/seo";

const qo = (slug: string) =>
  queryOptions({
    queryKey: ["course", slug],
    queryFn: () => getPublishedCourseBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(qo(params.slug));
    if (!data.course) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const c = loaderData?.course;
    if (!c) return { meta: [{ title: "Course — EduLeak" }] };
    const title = c.seo_title || `${c.title} — Free course | EduLeak`;
    const desc = c.seo_description || c.description || `Free ${c.subject} course for ${c.level}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc.slice(0, 160) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 160) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/courses/${c.slug}` },
        ...(c.cover_url ? [{ property: "og:image", content: c.cover_url } as const] : []),
      ],
      links: [{ rel: "canonical", href: `/courses/${c.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: c.title,
            description: desc,
            provider: { "@type": "EducationalOrganization", name: "EduLeak" },
          }),
        },
      ],
    };
  },
  errorComponent: ({ error }) => <p className="container-edit py-16 text-sm">{error.message}</p>,
  notFoundComponent: () => (
    <div className="container-edit py-20 text-center">
      <p className="num-display text-6xl text-gold">404</p>
      <h1 className="mt-2 font-display text-3xl">Course not found</h1>
      <Link to="/courses" className="mt-6 inline-block border-b border-ink text-sm">Browse all courses</Link>
    </div>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { course, chapters } = Route.useLoaderData();
  if (!course) return null;
  return (
    <article className="container-edit py-10 sm:py-14">
      <Link to="/courses" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">← Library</Link>
      <header className="mt-4 grid gap-8 md:grid-cols-[1.6fr_1fr] items-start">
        <div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>{course.level}</span><span className="text-gold">●</span><span>{course.subject}</span>
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-[1.02]">{course.title}</h1>
          {course.description && <p className="mt-5 text-base sm:text-lg text-ink/80 max-w-2xl">{course.description}</p>}
          {course.redirect_url && (
            <a
              href={course.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-sm uppercase tracking-[0.18em]"
            >
              Open full course ↗
            </a>
          )}
        </div>
        {course.cover_url && (
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-mist">
            <img src={course.cover_url} alt={course.title} className="size-full object-cover" />
          </div>
        )}
      </header>

      {chapters.length > 0 && (
        <div className="mt-14 rule pt-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-6">Contents</p>
          <ol className="space-y-12">
            {chapters.map((ch, i) => (
              <li key={ch.id}>
                <div className="flex items-baseline gap-4">
                  <span className="num-display text-3xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-2xl sm:text-3xl">{ch.title}</h2>
                </div>
                <ul className="mt-5 space-y-8 sm:pl-12">
                  {ch.lessons.map((l) => {
                    const embed = youtubeEmbed(l.video_url);
                    return (
                      <li key={l.id} className="border-l border-border pl-5">
                        <h3 className="font-display text-lg">{l.title}</h3>
                        {embed && (
                          <div className="mt-3 aspect-video w-full overflow-hidden rounded-sm bg-ink">
                            <iframe
                              src={embed}
                              title={l.title}
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="size-full"
                            />
                          </div>
                        )}
                        {l.body && <p className="mt-3 text-sm text-ink/80 whitespace-pre-wrap">{l.body}</p>}
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] uppercase tracking-[0.18em]">
                          {l.pdf_url && <a href={l.pdf_url} target="_blank" rel="noopener noreferrer" className="text-ink hover:gold-underline">PDF notes ↓</a>}
                          {l.redirect_url && <a href={l.redirect_url} target="_blank" rel="noopener noreferrer" className="text-ink hover:gold-underline">External lesson ↗</a>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
