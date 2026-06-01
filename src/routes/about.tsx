import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EduLeak" },
      { name: "description", content: "EduLeak is a free, hand-curated library of courses, videos, and notes for students from class 9 through college." },
      { property: "og:title", content: "About — EduLeak" },
      { property: "og:description", content: "A free, hand-curated library for students." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: () => (
    <div className="container-edit py-14 max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Colophon</p>
      <h1 className="mt-3 font-display text-5xl sm:text-7xl leading-[0.95]">A library, not a store.</h1>
      <div className="mt-8 space-y-5 text-base sm:text-lg text-ink/85 leading-relaxed">
        <p>EduLeak began with a simple frustration: most “edtech” platforms either lock the good stuff behind a paywall, or drown the free stuff in upsells and ads. Students deserve a calmer room than that.</p>
        <p>Every course here is hand-picked from across the web — YouTube playlists, PDFs from open sources, and lessons from independent educators. We don’t produce most of it ourselves. We just make it easier to find, organise, and study.</p>
        <p>If you’re a student in <em>class 9 through college</em>, you should never have to pay to read.</p>
      </div>
    </div>
  ),
});
