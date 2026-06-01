import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addMediaUrl, listMedia } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/media")({
  head: () => ({ meta: [{ title: "Media gallery — Admin" }, { name: "robots", content: "noindex" }] }),
  component: MediaPage,
});

function MediaPage() {
  const list = useServerFn(listMedia);
  const add = useServerFn(addMediaUrl);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "media"], queryFn: () => list() });
  const [url, setUrl] = useState(""); const [label, setLabel] = useState("");
  const addM = useMutation({
    mutationFn: () => add({ data: { url, label, kind: "image" } }),
    onSuccess: () => { setUrl(""); setLabel(""); qc.invalidateQueries({ queryKey: ["admin", "media"] }); },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Media gallery</h1>
      <p className="mt-2 text-sm text-muted-foreground">Paste a downloadable image URL to add it to the gallery.</p>
      <form onSubmit={(e) => { e.preventDefault(); addM.mutate(); }} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
        <input value={url} required onChange={(e) => setUrl(e.target.value)} placeholder="https://…/cover.jpg" className="flex-1 border-b border-ink bg-transparent py-2 outline-none focus:border-gold" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional)" className="sm:w-48 border-b border-border bg-transparent py-2 outline-none" />
        <button disabled={addM.isPending} className="bg-ink text-paper px-5 py-2 text-sm uppercase tracking-[0.18em] disabled:opacity-50">Add</button>
      </form>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {q.data?.media.map((m) => (
          <div key={m.id} className="group">
            <div className="aspect-square overflow-hidden bg-mist">
              <img src={m.url} alt={m.label ?? ""} loading="lazy" className="size-full object-cover" />
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(m.url); }}
              className="mt-2 w-full text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink truncate"
              title={m.url}
            >Copy URL</button>
          </div>
        ))}
      </div>
      {q.data?.media.length === 0 && <p className="mt-10 text-sm text-muted-foreground">Gallery is empty.</p>}
    </div>
  );
}
