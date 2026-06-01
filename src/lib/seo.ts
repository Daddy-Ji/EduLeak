export const SITE_NAME = "EduLeak";
export const SITE_TAGLINE = "Free courses for class 9 through college";
export const SITE_DESCRIPTION =
  "Free, hand-picked study material, video lessons, and notes for students from class 9 to college — across maths, science, commerce, and computing.";

export const LEVELS = [
  { slug: "class-9", label: "Class 9" },
  { slug: "class-10", label: "Class 10" },
  { slug: "class-11", label: "Class 11" },
  { slug: "class-12", label: "Class 12" },
  { slug: "jee", label: "JEE" },
  { slug: "neet", label: "NEET" },
  { slug: "college", label: "College" },
] as const;

// Official Telegram channel — replace with your real invite link
export const TELEGRAM_URL = "https://t.me/eduleak";

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "Economics",
  "Accountancy",
  "Business Studies",
  "History",
  "Geography",
  "Political Science",
] as const;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function youtubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
    }
    return url;
  } catch {
    return null;
  }
}
