import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — EduLeak" },
      { name: "description", content: "Get in touch with EduLeak. Suggest a course, report a broken link, or just say hi." },
      { property: "og:title", content: "Contact — EduLeak" },
      { property: "og:description", content: "Get in touch with EduLeak." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <div className="container-edit py-14 max-w-2xl">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Correspondence</p>
      <h1 className="mt-3 font-display text-5xl">Get in touch</h1>
      <p className="mt-5 text-lg text-ink/85">
        Suggest a course, report a broken lesson, or just say hello.
      </p>
      <p className="mt-8 text-base">
        Write to us at <a className="gold-underline" href="mailto:hello@eduleak.example">hello@eduleak.example</a>.
      </p>
    </div>
  ),
});
