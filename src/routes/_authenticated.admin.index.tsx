import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { isCurrentUserAdmin, claimFirstAdmin, listAllCourses } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — EduLeak" }, { name: "robots", content: "noindex" }] }),
  component: AdminHome,
});

function AdminHome() {
  const check = useServerFn(isCurrentUserAdmin);
  const claim = useServerFn(claimFirstAdmin);
  const list = useServerFn(listAllCourses);

  const adminQ = useQuery({ queryKey: ["isAdmin"], queryFn: () => check() });
  const claimM = useMutation({ mutationFn: () => claim(), onSuccess: () => adminQ.refetch() });

  if (adminQ.isLoading) return <p className="text-sm text-muted-foreground">Checking permissions…</p>;
  if (!adminQ.data?.isAdmin) {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-3xl">Claim admin</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You're signed in but you don't have admin access yet. If no admin exists, you can claim it now.
        </p>
        <button
          onClick={() => claimM.mutate()}
          disabled={claimM.isPending}
          className="mt-5 bg-ink text-paper px-5 py-2.5 text-sm uppercase tracking-[0.18em] disabled:opacity-50"
        >
          {claimM.isPending ? "Claiming…" : "Become admin"}
        </button>
        {claimM.data && !claimM.data.claimed && (
          <p className="mt-3 text-sm text-destructive">{claimM.data.reason}</p>
        )}
        {claimM.error && <p className="mt-3 text-sm text-destructive">{(claimM.error as Error).message}</p>}
      </div>
    );
  }

  return <AdminDashboard list={list} />;
}

function AdminDashboard({ list }: { list: ReturnType<typeof useServerFn<typeof listAllCourses>> }) {
  const q = useQuery({ queryKey: ["admin", "courses"], queryFn: () => list() });
  const courses = q.data?.courses ?? [];
  const published = courses.filter((c) => c.published).length;
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Dashboard</p>
          <h1 className="font-display text-4xl mt-1">Course manager</h1>
        </div>
        <Link to="/admin/courses/new" className="bg-ink text-paper px-5 py-2.5 text-sm uppercase tracking-[0.18em]">New course</Link>
      </div>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
        <Stat label="Total courses" value={courses.length} />
        <Stat label="Published" value={published} />
        <Stat label="Drafts" value={courses.length - published} />
      </div>
      <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Recent</p>
      <ul>
        {courses.slice(0, 8).map((c) => (
          <li key={c.id} className="border-b border-border py-3 flex justify-between gap-4">
            <Link to="/admin/courses/$id/edit" params={{ id: c.id }} className="font-display text-lg hover:gold-underline">{c.title}</Link>
            <span className="text-xs text-muted-foreground">{c.published ? "Published" : "Draft"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="num-display text-4xl mt-2 text-ink">{value}</p>
    </div>
  );
}
