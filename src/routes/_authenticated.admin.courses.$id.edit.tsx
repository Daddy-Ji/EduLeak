import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getAdminCourse, updateCourse, createChapter, deleteChapter, createLesson, deleteLesson,
} from "@/lib/admin.functions";
import { LEVELS, SUBJECTS } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin/courses/$id/edit")({
  head: () => ({ meta: [{ title: "Edit course — Admin" }, { name: "robots", content: "noindex" }] }),
  component: EditCourse,
});

function EditCourse() {
  const { id } = Route.useParams();
  const get = useServerFn(getAdminCourse);
  const update = useServerFn(updateCourse);
  const addChapter = useServerFn(createChapter);
  const delChapter = useServerFn(deleteChapter);
  const addLesson = useServerFn(createLesson);
  const delLesson = useServerFn(deleteLesson);
  const qc = useQueryClient();

  const q = useQuery({ queryKey: ["admin", "course", id], queryFn: () => get({ data: { id } }) });
  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (q.data && !form) setForm(q.data.course); }, [q.data]);

  const updateM = useMutation({
    mutationFn: () => update({ data: { ...form, id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "course", id] }),
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ["admin", "course", id] });
  const addChM = useMutation({ mutationFn: (title: string) => addChapter({ data: { course_id: id, title, position: q.data?.chapters.length ?? 0 } }), onSuccess: refetch });
  const delChM = useMutation({ mutationFn: (cid: string) => delChapter({ data: { id: cid } }), onSuccess: refetch });
  const addLsM = useMutation({ mutationFn: (v: any) => addLesson({ data: v }), onSuccess: refetch });
  const delLsM = useMutation({ mutationFn: (lid: string) => delLesson({ data: { id: lid } }), onSuccess: refetch });

  if (q.isLoading || !form) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const chapters = q.data?.chapters ?? [];

  return (
    <div className="max-w-4xl">
      <Link to="/admin/courses" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">← All courses</Link>
      <h1 className="font-display text-4xl mt-3">Edit course</h1>

      <form onSubmit={(e) => { e.preventDefault(); updateM.mutate(); }} className="mt-6 space-y-5">
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
        <TextArea label="Description" value={form.description ?? ""} onChange={(v) => setForm({ ...form, description: v })} />
        <div className="grid sm:grid-cols-2 gap-5">
          <Select label="Level" value={form.level} onChange={(v) => setForm({ ...form, level: v })} options={LEVELS.map((l) => ({ value: l.slug, label: l.label }))} />
          <Select label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={SUBJECTS.map((s) => ({ value: s, label: s }))} />
        </div>
        <Input label="Cover image URL" value={form.cover_url ?? ""} onChange={(v) => setForm({ ...form, cover_url: v })} />
        <Input label="External redirect URL" value={form.redirect_url ?? ""} onChange={(v) => setForm({ ...form, redirect_url: v })} />
        <Input label="SEO title" value={form.seo_title ?? ""} onChange={(v) => setForm({ ...form, seo_title: v })} />
        <TextArea label="SEO description" value={form.seo_description ?? ""} onChange={(v) => setForm({ ...form, seo_description: v })} />
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <span>Published</span>
        </label>
        <button disabled={updateM.isPending} className="bg-ink text-paper px-6 py-3 text-sm uppercase tracking-[0.2em] disabled:opacity-50">
          {updateM.isPending ? "Saving…" : "Save changes"}
        </button>
        {updateM.error && <p className="text-sm text-destructive">{(updateM.error as Error).message}</p>}
      </form>

      <section className="mt-14 rule pt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl">Chapters</h2>
          <AddChapterButton onAdd={(t) => addChM.mutate(t)} />
        </div>
        <div className="mt-6 space-y-8">
          {chapters.map((ch: any, i: number) => (
            <div key={ch.id} className="border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl">
                  <span className="num-display text-gold mr-3">{String(i + 1).padStart(2, "0")}</span>{ch.title}
                </h3>
                <button onClick={() => { if (confirm("Delete chapter?")) delChM.mutate(ch.id); }} className="text-xs uppercase tracking-[0.18em] text-destructive">Delete</button>
              </div>
              <ul className="mt-4 space-y-2">
                {(ch.lessons ?? []).sort((a: any, b: any) => a.position - b.position).map((l: any) => (
                  <li key={l.id} className="flex justify-between items-center text-sm border-t border-border pt-2">
                    <span>{l.title}</span>
                    <button onClick={() => delLsM.mutate(l.id)} className="text-xs uppercase tracking-[0.18em] text-destructive">×</button>
                  </li>
                ))}
              </ul>
              <AddLessonForm onAdd={(v) => addLsM.mutate({ ...v, chapter_id: ch.id, position: (ch.lessons?.length ?? 0) })} />
            </div>
          ))}
          {chapters.length === 0 && <p className="text-sm text-muted-foreground">No chapters yet. Add one to get started.</p>}
        </div>
      </section>
    </div>
  );
}

function AddChapterButton({ onAdd }: { onAdd: (title: string) => void }) {
  const [t, setT] = useState("");
  return (
    <div className="flex gap-2">
      <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Chapter title" className="border-b border-ink bg-transparent text-sm py-1 outline-none focus:border-gold" />
      <button onClick={() => { if (t.trim()) { onAdd(t); setT(""); } }} className="bg-ink text-paper px-3 py-1.5 text-xs uppercase tracking-[0.18em]">Add</button>
    </div>
  );
}

function AddLessonForm({ onAdd }: { onAdd: (v: any) => void }) {
  const [v, setV] = useState({ title: "", video_url: "", pdf_url: "", redirect_url: "", body: "" });
  return (
    <div className="mt-4 border-t border-border pt-4 grid gap-2">
      <input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} placeholder="Lesson title" className="border-b border-border bg-transparent text-sm py-1 outline-none" />
      <input value={v.video_url} onChange={(e) => setV({ ...v, video_url: e.target.value })} placeholder="YouTube URL (optional)" className="border-b border-border bg-transparent text-xs py-1 outline-none" />
      <input value={v.pdf_url} onChange={(e) => setV({ ...v, pdf_url: e.target.value })} placeholder="PDF URL (optional)" className="border-b border-border bg-transparent text-xs py-1 outline-none" />
      <input value={v.redirect_url} onChange={(e) => setV({ ...v, redirect_url: e.target.value })} placeholder="External lesson URL (optional)" className="border-b border-border bg-transparent text-xs py-1 outline-none" />
      <button
        onClick={() => {
          if (!v.title.trim()) return;
          onAdd({
            title: v.title,
            video_url: v.video_url || null,
            pdf_url: v.pdf_url || null,
            redirect_url: v.redirect_url || null,
            body: v.body || null,
          });
          setV({ title: "", video_url: "", pdf_url: "", redirect_url: "", body: "" });
        }}
        className="justify-self-start mt-1 bg-mist text-ink px-3 py-1.5 text-xs uppercase tracking-[0.18em]"
      >+ Add lesson</button>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border-b border-ink bg-transparent py-2 outline-none focus:border-gold" />
    </div>
  );
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full border border-border bg-card px-3 py-2 outline-none focus:border-gold" />
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border-b border-ink bg-transparent py-2 outline-none focus:border-gold">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
