import { createFileRoute } from "@tanstack/react-router";
import { listSitemapSlugs } from "@/lib/courses.functions";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { slugs } = await listSitemapSlugs();
        const staticPaths = ["/", "/courses", "/about", "/contact",
          "/levels/class-9", "/levels/class-10", "/levels/class-11", "/levels/class-12", "/levels/college"];
        const urls = [
          ...staticPaths.map((p) => `<url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`),
          ...slugs.map((s) => `<url><loc>${BASE_URL}/courses/${s.slug}</loc><lastmod>${new Date(s.updated_at).toISOString()}</lastmod><changefreq>weekly</changefreq></url>`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
