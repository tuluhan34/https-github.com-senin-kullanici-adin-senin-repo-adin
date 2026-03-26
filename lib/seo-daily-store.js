import fs from "node:fs";
import path from "node:path";

const STORE_PATH = path.join(process.cwd(), "data", "blog", "seo-daily-posts.json");

export const readSeoDailyStore = () => {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const posts = Array.isArray(parsed.posts) ? parsed.posts : [];
    return posts.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  } catch {
    return [];
  }
};

export const getSeoPostBySlug = (slug) => {
  const posts = readSeoDailyStore();
  return posts.find((item) => item.slug === slug) || null;
};
