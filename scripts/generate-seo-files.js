const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SITE_URL = "https://www.34motokuryeistanbul.com";

const slugifyTr = (value) =>
  String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const toIsoDate = (value) => {
  const dt = value ? new Date(value) : new Date();
  return Number.isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
};

const readJson = (filePath, fallback) => {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const listStaticPageRoutes = () => {
  const pagesDir = path.join(ROOT, "pages");
  const routes = new Set();

  const walk = (dir, prefix = "") => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, `${prefix}/${entry.name}`);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".js")) {
        continue;
      }

      const baseName = entry.name.replace(/\.js$/, "");
      if (baseName.startsWith("_") || baseName.includes("[")) {
        continue;
      }

      let route = `${prefix}/${baseName}`.replace(/\/index$/, "/");
      if (route === "/") {
        routes.add("/");
      } else {
        routes.add(`${route.replace(/\/+$/, "")}/`);
      }
    }
  };

  walk(pagesDir, "");
  return routes;
};

const listServiceRoutes = () => {
  const filePath = path.join(ROOT, "lib", "services-catalog.js");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return [];
  }

  const slugs = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  return Array.from(new Set(slugs)).map((slug) => `/hizmetler/${slug}/`);
};

const listNeighborhoodRoutes = () => {
  const addressesPath = path.join(ROOT, "clean-upload", "addresses.json");
  const addresses = readJson(addressesPath, []);
  const unique = new Set();

  for (const row of addresses) {
    if (!row || !row.district || !row.neighborhood) {
      continue;
    }
    const districtSlug = slugifyTr(row.district);
    const neighborhoodSlug = slugifyTr(row.neighborhood);
    if (!districtSlug || !neighborhoodSlug) {
      continue;
    }
    unique.add(`/ilceler/${districtSlug}/${neighborhoodSlug}/`);
  }

  return Array.from(unique);
};

const listSeoPostRoutes = () => {
  const storePath = path.join(ROOT, "data", "blog", "seo-daily-posts.json");
  const store = readJson(storePath, { posts: [] });
  const posts = Array.isArray(store.posts) ? store.posts : [];

  return posts
    .filter((item) => item && typeof item.slug === "string" && item.slug.trim())
    .map((item) => ({
      route: `/seo-icerikler/${item.slug.trim()}/`,
      lastmod: toIsoDate(item.updatedAt || item.createdAt),
    }));
};

const buildSitemapXml = (entries) => {
  const xmlEntries = entries
    .map((entry) => {
      const loc = `${SITE_URL}${entry.route === "/" ? "/" : entry.route}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${entry.lastmod}</lastmod>`,
        "    <changefreq>daily</changefreq>",
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    xmlEntries,
    "</urlset>",
    "",
  ].join("\n");
};

const buildRobotsTxt = () => {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "# Primary indexing targets",
    "Allow: /hizmetler/",
    "Allow: /ilceler/",
    "Allow: /seo-icerikler/",
    "",
    "# Crawlers can skip heavy framework internals",
    "Disallow: /_next/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL.replace("https://", "")}`,
    "",
  ].join("\n");
};

const run = () => {
  const generatedAt = toIsoDate();
  const routes = listStaticPageRoutes();

  for (const route of listServiceRoutes()) {
    routes.add(route);
  }

  for (const route of listNeighborhoodRoutes()) {
    routes.add(route);
  }

  const postRoutes = listSeoPostRoutes();

  const entries = Array.from(routes)
    .sort((a, b) => a.localeCompare(b))
    .map((route) => ({
      route,
      lastmod: generatedAt,
      priority: route === "/" ? "1.0" : route.startsWith("/hizmetler/") ? "0.9" : "0.8",
    }));

  for (const post of postRoutes) {
    entries.push({
      route: post.route,
      lastmod: post.lastmod,
      priority: "0.7",
    });
  }

  const uniqueByRoute = new Map();
  for (const entry of entries) {
    if (!uniqueByRoute.has(entry.route)) {
      uniqueByRoute.set(entry.route, entry);
    }
  }

  const finalEntries = Array.from(uniqueByRoute.values()).sort((a, b) => a.route.localeCompare(b.route));

  const publicDir = path.join(ROOT, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemapXml(finalEntries), "utf8");
  fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobotsTxt(), "utf8");

  console.log(`SEO files generated. sitemap urls=${finalEntries.length}`);
};

run();
