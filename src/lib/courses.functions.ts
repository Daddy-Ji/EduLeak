import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listPublishedCourses = createServerFn({ method: "GET" })
  .inputValidator((input: { level?: string; subject?: string; limit?: number } | undefined) =>
    z
      .object({
        level: z.string().max(40).optional(),
        subject: z.string().max(60).optional(),
        limit: z.number().int().min(1).max(200).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("courses")
      .select("id, slug, title, description, level, subject, cover_url, redirect_url, updated_at")
      .eq("published", true)
      .order("updated_at", { ascending: false })
      .limit(data.limit ?? 60);
    if (data.level) q = q.eq("level", data.level);
    if (data.subject) q = q.eq("subject", data.subject);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { courses: rows ?? [] };
  });

export const getPublishedCourseBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: course, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!course) return { course: null, chapters: [] };
    const { data: chapters, error: chErr } = await supabaseAdmin
      .from("chapters")
      .select("id, title, position, lessons:lessons(id, title, video_url, pdf_url, redirect_url, body, position)")
      .eq("course_id", course.id)
      .order("position", { ascending: true });
    if (chErr) throw new Error(chErr.message);
    const sorted = (chapters ?? []).map((c) => ({
      ...c,
      lessons: [...(c.lessons ?? [])].sort((a, b) => a.position - b.position),
    }));
    return { course, chapters: sorted };
  });

export const listSitemapSlugs = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("slug, updated_at")
    .eq("published", true);
  if (error) throw new Error(error.message);
  return { slugs: data ?? [] };
});
