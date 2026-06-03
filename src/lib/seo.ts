export const SITE_NAME = "EduLeak";
export const SITE_TAGLINE = "Free courses for class 9 through college";
export const SITE_DESCRIPTION =
  "Free, hand-picked study material, video lessons, and notes for students from class 9 to college — across maths, science, commerce, and computing.";

export const LEVELS = [
  { slug: "allen", label: "Allen" },
  { slug: "career-launcher", label: "Career Launcher" },
  { slug: "physics-wallah", label: "Physics Wallah" },
  { slug: "unacademy", label: "Unacademy" },
  { slug: "apni-kaksha", label: "Apni Kaksha" },
  { slug: "vedantu", label: "Vedantu" },
  { slug: "motion-iit", label: "Motion IIT" },
  { slug: "fiitjee", label: "FIITJEE" },
] as const;

export const INSTITUTES = [
  {
    slug: "allen",
    label: "Allen Career Institute",
    shortLabel: "Allen",
    tagline: "India's leading coaching for JEE & NEET",
    logoUrl: "https://www.allen.ac.in/favicon.ico",
    color: "#003DA5",
    website: "https://www.allen.ac.in",
  },
  {
    slug: "career-launcher",
    label: "Career Launcher",
    shortLabel: "Career Launcher",
    tagline: "Top prep for MBA, Law, JEE & more",
    logoUrl: "https://www.careerlauncher.com/favicon.ico",
    color: "#E31E24",
    website: "https://www.careerlauncher.com",
  },
  {
    slug: "physics-wallah",
    label: "Physics Wallah",
    shortLabel: "PW",
    tagline: "Affordable JEE & NEET coaching",
    logoUrl: "https://www.pw.live/favicon.ico",
    color: "#FF6B00",
    website: "https://www.pw.live",
  },
  {
    slug: "unacademy",
    label: "Unacademy",
    shortLabel: "Unacademy",
    tagline: "India's largest learning platform",
    logoUrl: "https://unacademy.com/favicon.ico",
    color: "#1A1A2E",
    website: "https://unacademy.com",
  },
  {
    slug: "apni-kaksha",
    label: "Apni Kaksha",
    shortLabel: "Apni Kaksha",
    tagline: "Free quality education for all",
    logoUrl: "https://apnikaksha.net/favicon.ico",
    color: "#2E7D32",
    website: "https://apnikaksha.net",
  },
  {
    slug: "vedantu",
    label: "Vedantu",
    shortLabel: "Vedantu",
    tagline: "Live online tutoring K–12 & JEE/NEET",
    logoUrl: "https://www.vedantu.com/favicon.ico",
    color: "#5B2D90",
    website: "https://www.vedantu.com",
  },
  {
    slug: "motion-iit",
    label: "Motion IIT-JEE",
    shortLabel: "Motion",
    tagline: "Kota's trusted IIT-JEE coaching",
    logoUrl: "https://www.motioniitjee.com/favicon.ico",
    color: "#C62828",
    website: "https://www.motioniitjee.com",
  },
  {
    slug: "fiitjee",
    label: "FIITJEE",
    shortLabel: "FIITJEE",
    tagline: "Pioneer in IIT-JEE training since 1992",
    logoUrl: "https://www.fiitjee.com/favicon.ico",
    color: "#0D47A1",
    website: "https://www.fiitjee.com",
  },
] as const;

// Official Telegram channel — replace with your real invite link
export const TELEGRAM_URL = "https://t.me/eduleak";

export const SUBJECTS = [
  "All in One",
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
