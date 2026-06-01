import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createCourse, importCourseFromUrl } from "@/lib/admin.functions";
import { LEVELS, SUBJECTS, slugify } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin/courses/new")({
  head: () => ({ meta: [{ title: "New course — Admin" }, { name: "robots", content: "noindex" }] }),
  component: NewCourse,
});

function NewCourse() {
  const create = useServerFn(createCourse);
  const importFn = useServerFn(importCourseFromUrl);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"manual" | "import">("manual");
  const [form, setForm] = useState({
    title: "", slug: "", description: "", level: LEVELS[0].slug, subject: SUBJECTS[0],
    cover_url: "", seo_title: "", seo_description: "", redirect_url: "", source_type: "manual" as const,
    published: false,
  });
  const [importUrl, setImportUrl] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const createM = useMutation({
    mutationFn: () => create({ data: { ...form, source_type: form.redirect_url ? "redirect" : "manual" } }),
    onSuccess: (r) => navigate({ to: "/admin/courses/$id/edit", params: { id: r.id } }),
    onError: (e: Error) => setErr(e.message),
  });
  const importM = useMutation({
    mutationFn: () => importFn({ data: { url: importUrl } }),
    onSuccess: (r) => navigate({ to: "/admin/courses/$id/edit", params: { id: r.id } }),
    onError: (e: Error) => setErr(e.message),
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v, ...(k === "title" && !f.slug ? { slug: slugify(v as string) } : {}) }));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">New course</h1>
      <div className="mt-4 flex gap-2 text-[11px] uppercase tracking-[0.18em]">
        <button onClick={() => setMode("manual")} className={`px-3 py-1.5 border ${mode === "manual" ? "bg-ink text-paper border-ink" : "border-border"}`}>Manual</button>
        <button onClick={() => setMode("import")} className={`px-3 py-1.5 border ${mode === "import" ? "bg-ink text-paper border-ink" : "border-border"}`}>Import via API</button>
      </div>

      {err && <p className="mt-4 text-sm text-destructive">{err}</p>}

      {mode === "manual" ? (
        <form
          onSubmit={(e) => { e.preventDefault(); setErr(null); createM.mutate(); }}
          className="mt-6 space-y-5"
        >
          <Field label="Title" required value={form.title} onChange={(v) => set("title", v)} />
          <Field label="Slug" required value={form.slug} onChange={(v) => set("slug", v)} hint="lowercase, hyphens" />
          <Textarea label="Description" value={form.description} onChange={(v) => set("description", v)} />
          <div className="grid sm:grid-cols-2 gap-5">
            <Select label="Level" value={form.level} options={LEVELS.map((l) => ({ value: l.slug, label: l.label }))} onChange={(v) => set("level", v)} />
            <Select label="Subject" value={form.subject} options={SUBJECTS.map((s) => ({ value: s, label: s }))} onChange={(v) => set("subject", v)} />
          </div>
          <Field label="Cover image URL" value={form.cover_url} onChange={(v) => set("cover_url", v)} hint="https://… (or paste from gallery later)" />
          <Field label="External redirect URL" value={form.redirect_url} onChange={(v) => set("redirect_url", v)} hint="Optional — link course to another site" />
          <Field label="SEO title" value={form.seo_title} onChange={(v) => set("seo_title", v)} />
          <Textarea label="SEO description" value={form.seo_description} onChange={(v) => set("seo_description", v)} />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
            <span>Publish immediately</span>
          </label>
          <button disabled={createM.isPending} className="bg-ink text-paper px-6 py-3 text-sm uppercase tracking-[0.2em] disabled:opacity-50">
            {createM.isPending ? "Creating…" : "Create course"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setErr(null); importM.mutate(); }}
          className="mt-6 space-y-4"
        >
          <Field label="JSON URL" required value={importUrl} onChange={setImportUrl} hint='Expects { slug, title, level, subject, chapters: [{ title, lessons: [...] }] }' />
          <button disabled={importM.isPending} className="bg-ink text-paper px-6 py-3 text-sm uppercase tracking-[0.2em] disabled:opacity-50">
            {importM.isPending ? "Importing…" : "Import course"}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required, hint }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; hint?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</label>
      <input value={value} required={required} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border-b border-ink bg-transparent py-2 outline-none focus:border-gold" />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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
