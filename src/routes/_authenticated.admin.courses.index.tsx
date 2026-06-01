import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCourse, listAllCourses } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/courses/")({
  head: () => ({ meta: [{ title: "Courses — Admin" }, { name: "robots", content: "noindex" }] }),
  component: CoursesAdmin,
});

function CoursesAdmin() {
  const list = useServerFn(listAllCourses);
  const del = useServerFn(deleteCourse);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "courses"], queryFn: () => list() });
  const delM = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Courses</h1>
        <Link to="/admin/courses/new" className="bg-ink text-paper px-4 py-2 text-sm uppercase tracking-[0.18em]">New</Link>
      </div>
      <div className="mt-8">
        {q.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {q.data?.courses.map((c) => (
          <div key={c.id} className="border-b border-border py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link to="/admin/courses/$id/edit" params={{ id: c.id }} className="font-display text-lg hover:gold-underline">{c.title}</Link>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                {c.level} · {c.subject} · {c.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Link to="/admin/courses/$id/edit" params={{ id: c.id }} className="text-ink hover:gold-underline uppercase tracking-[0.18em]">Edit</Link>
              <button
                onClick={() => { if (confirm(`Delete "${c.title}"?`)) delM.mutate(c.id); }}
                className="text-destructive uppercase tracking-[0.18em]"
              >Delete</button>
            </div>
          </div>
        ))}
        {q.data?.courses.length === 0 && <p className="text-sm text-muted-foreground py-6">No courses yet.</p>}
      </div>
    </div>
  );
}
