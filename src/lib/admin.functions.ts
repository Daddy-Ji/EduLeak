import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const isCurrentUserAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

// First-run claim: if there are zero admins yet, the calling user becomes the admin.
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { claimed: false, reason: "Admin already exists." };
    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insErr) throw new Error(insErr.message);
    return { claimed: true };
  });

export const listAllCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("id, slug, title, level, subject, published, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { courses: data ?? [] };
  });

const CourseInput = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  level: z.string().min(1).max(40),
  subject: z.string().min(1).max(60),
  cover_url: z.string().url().max(2048).optional().nullable().or(z.literal("").transform(() => null)),
  seo_title: z.string().max(120).optional().nullable(),
  seo_description: z.string().max(300).optional().nullable(),
  redirect_url: z.string().url().max(2048).optional().nullable().or(z.literal("").transform(() => null)),
  source_type: z.enum(["manual", "redirect", "api"]).default("manual"),
  published: z.boolean().default(false),
});

export const createCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => CourseInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("courses")
      .insert({ ...data, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).merge(CourseInput).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin.from("courses").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAdminCourse = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: course, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    const { data: chapters } = await supabaseAdmin
      .from("chapters")
      .select("id, title, position, lessons:lessons(id, title, video_url, pdf_url, redirect_url, body, position)")
      .eq("course_id", data.id)
      .order("position");
    return { course, chapters: chapters ?? [] };
  });

const ChapterInput = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  position: z.number().int().min(0).max(999).default(0),
});

export const createChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ChapterInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin.from("chapters").insert(data).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("chapters").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const LessonInput = z.object({
  chapter_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  video_url: z.string().url().max(2048).optional().nullable().or(z.literal("").transform(() => null)),
  pdf_url: z.string().url().max(2048).optional().nullable().or(z.literal("").transform(() => null)),
  redirect_url: z.string().url().max(2048).optional().nullable().or(z.literal("").transform(() => null)),
  body: z.string().max(8000).optional().nullable(),
  position: z.number().int().min(0).max(999).default(0),
});

export const createLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => LessonInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("lessons").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("lessons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Import course from a JSON URL. Expected shape:
// { slug, title, description?, level, subject, cover_url?, chapters: [{ title, lessons: [{ title, video_url?, pdf_url?, redirect_url?, body? }] }] }
const ImportInput = z.object({ url: z.string().url() });

export const importCourseFromUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ImportInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const res = await fetch(data.url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    const parsed = z
      .object({
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        level: z.string(),
        subject: z.string(),
        cover_url: z.string().url().optional(),
        chapters: z
          .array(
            z.object({
              title: z.string(),
              lessons: z
                .array(
                  z.object({
                    title: z.string(),
                    video_url: z.string().url().optional(),
                    pdf_url: z.string().url().optional(),
                    redirect_url: z.string().url().optional(),
                    body: z.string().optional(),
                  }),
                )
                .default([]),
            }),
          )
          .default([]),
      })
      .parse(json);

    const { data: course, error: cErr } = await supabaseAdmin
      .from("courses")
      .insert({
        slug: parsed.slug,
        title: parsed.title,
        description: parsed.description ?? null,
        level: parsed.level,
        subject: parsed.subject,
        cover_url: parsed.cover_url ?? null,
        source_type: "api",
        published: false,
        created_by: context.userId,
      })
      .select("id")
      .single();
    if (cErr) throw new Error(cErr.message);

    for (const [ci, ch] of parsed.chapters.entries()) {
      const { data: chRow, error: chErr } = await supabaseAdmin
        .from("chapters")
        .insert({ course_id: course.id, title: ch.title, position: ci })
        .select("id")
        .single();
      if (chErr) throw new Error(chErr.message);
      for (const [li, l] of ch.lessons.entries()) {
        await supabaseAdmin.from("lessons").insert({
          chapter_id: chRow.id,
          title: l.title,
          video_url: l.video_url ?? null,
          pdf_url: l.pdf_url ?? null,
          redirect_url: l.redirect_url ?? null,
          body: l.body ?? null,
          position: li,
        });
      }
    }
    return { id: course.id };
  });

export const listMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { media: data ?? [] };
  });

export const addMediaUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({ url: z.string().url().max(2048), label: z.string().max(120).optional(), kind: z.string().max(20).default("image") })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("media_assets")
      .insert({ url: data.url, label: data.label ?? null, kind: data.kind, uploaded_by: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
