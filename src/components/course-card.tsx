import { Link } from "@tanstack/react-router";

type Props = {
  index?: number;
  course: {
    slug: string;
    title: string;
    description?: string | null;
    level: string;
    subject: string;
    cover_url?: string | null;
  };
};

export function CourseCard({ course, index }: Props) {
  return (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className="group block border-b border-border py-6 first:pt-0"
    >
      <div className="flex gap-5">
        {course.cover_url ? (
          <div className="hidden sm:block w-28 h-28 shrink-0 overflow-hidden rounded-sm bg-mist">
            <img
              src={course.cover_url}
              alt={course.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="hidden sm:flex w-28 h-28 shrink-0 items-center justify-center rounded-sm bg-mist num-display text-3xl text-ink/40">
            {(index ?? 0) + 1 < 10 ? `0${(index ?? 0) + 1}` : (index ?? 0) + 1}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>{course.level}</span>
            <span className="text-gold">●</span>
            <span>{course.subject}</span>
          </div>
          <h3 className="mt-1.5 font-display text-xl sm:text-2xl text-ink leading-tight">
            <span className="group-hover:gold-underline">{course.title}</span>
          </h3>
          {course.description && (
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
          )}
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink/60">Read course →</p>
        </div>
      </div>
    </Link>
  );
}
