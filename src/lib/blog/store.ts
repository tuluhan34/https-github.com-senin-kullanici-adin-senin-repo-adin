import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { type BlogPost, type BlogPostInput, type BlogSchedulerState } from "@/lib/blog/types";

type StorageMode = "sqlite" | "json";

type BlogAdapter = {
  initialize: () => Promise<void>;
  getMode: () => StorageMode;
  listPublished: (page: number, perPage: number) => Promise<BlogPost[]>;
  countPublished: () => Promise<number>;
  getBySlug: (slug: string) => Promise<BlogPost | null>;
  create: (post: BlogPostInput) => Promise<BlogPost>;
  existsBySlug: (slug: string) => Promise<boolean>;
  listLatest: (limit: number) => Promise<BlogPost[]>;
};

type JsonStore = {
  posts: BlogPost[];
};

type SqliteStatement = {
  all: (...params: unknown[]) => unknown;
  get: (...params: unknown[]) => unknown;
  run: (...params: unknown[]) => unknown;
};

type SqliteDatabase = {
  exec: (query: string) => void;
  prepare: (query: string) => SqliteStatement;
};

type SqliteModule = {
  DatabaseSync: new (filePath: string) => SqliteDatabase;
};

const blogDataDirectory = path.join(process.cwd(), "data", "blog");
const jsonDatabasePath = path.join(blogDataDirectory, "blog-posts.json");
const sqliteDatabasePath = path.join(blogDataDirectory, "blog.sqlite");
const schedulerStatePath = path.join(blogDataDirectory, "scheduler-state.json");
const schemaPath = path.join(process.cwd(), "src", "lib", "blog", "schema.sql");

let adapterPromise: Promise<BlogAdapter> | undefined;

const dynamicImport = async (specifier: string) => import(specifier);

const ensureBlogDirectory = async () => {
  await mkdir(blogDataDirectory, { recursive: true });
};

const emptySchedulerState = (): BlogSchedulerState => ({
  completedRunKeys: [],
  recentKeywords: [],
});

const normalizePost = (value: Record<string, unknown>): BlogPost => ({
  id: Number(value.id),
  title: String(value.title),
  slug: String(value.slug),
  content: String(value.content),
  metaTitle: String(value.metaTitle),
  metaDescription: String(value.metaDescription),
  createdAt: String(value.createdAt),
  publishedAt: String(value.publishedAt),
});

const readJsonStore = async (): Promise<JsonStore> => {
  try {
    const file = await readFile(jsonDatabasePath, "utf8");
    const parsed = JSON.parse(file) as JsonStore;

    return {
      posts: (parsed.posts ?? []).map((post) => normalizePost(post as unknown as Record<string, unknown>)),
    };
  } catch {
    return { posts: [] };
  }
};

const writeJsonStore = async (store: JsonStore) => {
  await ensureBlogDirectory();
  await writeFile(jsonDatabasePath, JSON.stringify(store, null, 2), "utf8");
};

const createJsonAdapter = async (): Promise<BlogAdapter> => {
  await ensureBlogDirectory();

  return {
    initialize: async () => {
      const store = await readJsonStore();

      if (!Array.isArray(store.posts)) {
        await writeJsonStore({ posts: [] });
      }
    },
    getMode: () => "json",
    listPublished: async (page, perPage) => {
      const store = await readJsonStore();
      const offset = (page - 1) * perPage;

      return store.posts
        .filter((post) => Boolean(post.publishedAt))
        .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
        .slice(offset, offset + perPage);
    },
    countPublished: async () => {
      const store = await readJsonStore();
      return store.posts.filter((post) => Boolean(post.publishedAt)).length;
    },
    getBySlug: async (slug) => {
      const store = await readJsonStore();
      return store.posts.find((post) => post.slug === slug) ?? null;
    },
    create: async (post) => {
      const store = await readJsonStore();
      const nextId = store.posts.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
      const nextPost = {
        id: nextId,
        ...post,
      };

      store.posts.push(nextPost);
      await writeJsonStore(store);

      return nextPost;
    },
    existsBySlug: async (slug) => {
      const store = await readJsonStore();
      return store.posts.some((post) => post.slug === slug);
    },
    listLatest: async (limit) => {
      const store = await readJsonStore();
      return store.posts
        .filter((post) => Boolean(post.publishedAt))
        .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
        .slice(0, limit);
    },
  };
};

const createSqliteAdapter = async (sqliteModule: SqliteModule): Promise<BlogAdapter> => {
  await ensureBlogDirectory();
  const schema = await readFile(schemaPath, "utf8");
  const database = new sqliteModule.DatabaseSync(sqliteDatabasePath);

  database.exec(schema);

  const selectColumns = "id, title, slug, content, metaTitle, metaDescription, createdAt, publishedAt";

  return {
    initialize: async () => undefined,
    getMode: () => "sqlite",
    listPublished: async (page, perPage) => {
      const offset = (page - 1) * perPage;
      const rows = database
        .prepare(
          `SELECT ${selectColumns} FROM blog_posts WHERE publishedAt IS NOT NULL ORDER BY publishedAt DESC LIMIT ? OFFSET ?`,
        )
        .all(perPage, offset) as Record<string, unknown>[];

      return rows.map(normalizePost);
    },
    countPublished: async () => {
      const row = database
        .prepare("SELECT COUNT(*) AS count FROM blog_posts WHERE publishedAt IS NOT NULL")
        .get() as { count: number | bigint };

      return Number(row.count);
    },
    getBySlug: async (slug) => {
      const row = database
        .prepare(`SELECT ${selectColumns} FROM blog_posts WHERE slug = ? LIMIT 1`)
        .get(slug) as Record<string, unknown> | undefined;

      return row ? normalizePost(row) : null;
    },
    create: async (post) => {
      const result = database
        .prepare(
          "INSERT INTO blog_posts (title, slug, content, metaTitle, metaDescription, createdAt, publishedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
        .run(
          post.title,
          post.slug,
          post.content,
          post.metaTitle,
          post.metaDescription,
          post.createdAt,
          post.publishedAt,
        ) as { lastInsertRowid: number | bigint };

      const row = database
        .prepare(`SELECT ${selectColumns} FROM blog_posts WHERE id = ? LIMIT 1`)
        .get(Number(result.lastInsertRowid)) as Record<string, unknown>;

      return normalizePost(row);
    },
    existsBySlug: async (slug) => {
      const row = database.prepare("SELECT 1 AS present FROM blog_posts WHERE slug = ? LIMIT 1").get(slug) as
        | { present: number }
        | undefined;

      return Boolean(row?.present);
    },
    listLatest: async (limit) => {
      const rows = database
        .prepare(`SELECT ${selectColumns} FROM blog_posts WHERE publishedAt IS NOT NULL ORDER BY publishedAt DESC LIMIT ?`)
        .all(limit) as Record<string, unknown>[];

      return rows.map(normalizePost);
    },
  };
};

const loadAdapter = async (): Promise<BlogAdapter> => {
  if (!adapterPromise) {
    adapterPromise = (async () => {
      try {
        const sqliteModule = (await dynamicImport("node:sqlite")) as Partial<SqliteModule>;

        if (sqliteModule.DatabaseSync) {
          return createSqliteAdapter(sqliteModule as SqliteModule);
        }
      } catch {
      }

      return createJsonAdapter();
    })();
  }

  return adapterPromise;
};

export const ensureBlogStorage = async () => {
  const adapter = await loadAdapter();
  await adapter.initialize();
};

export const getBlogStorageMode = async (): Promise<StorageMode> => {
  const adapter = await loadAdapter();
  return adapter.getMode();
};

export const listPublishedBlogPosts = async (page: number, perPage: number) => {
  const adapter = await loadAdapter();
  return adapter.listPublished(page, perPage);
};

export const countPublishedBlogPosts = async () => {
  const adapter = await loadAdapter();
  return adapter.countPublished();
};

export const getBlogPostBySlug = async (slug: string) => {
  const adapter = await loadAdapter();
  return adapter.getBySlug(slug);
};

export const createBlogPost = async (post: BlogPostInput) => {
  const adapter = await loadAdapter();
  return adapter.create(post);
};

export const blogSlugExists = async (slug: string) => {
  const adapter = await loadAdapter();
  return adapter.existsBySlug(slug);
};

export const listLatestBlogPosts = async (limit: number) => {
  const adapter = await loadAdapter();
  return adapter.listLatest(limit);
};

export const readBlogSchedulerState = async (): Promise<BlogSchedulerState> => {
  try {
    const file = await readFile(schedulerStatePath, "utf8");
    const parsed = JSON.parse(file) as BlogSchedulerState;

    return {
      completedRunKeys: parsed.completedRunKeys ?? [],
      recentKeywords: parsed.recentKeywords ?? [],
    };
  } catch {
    return emptySchedulerState();
  }
};

export const writeBlogSchedulerState = async (state: BlogSchedulerState) => {
  await ensureBlogDirectory();
  await writeFile(
    schedulerStatePath,
    JSON.stringify(
      {
        completedRunKeys: state.completedRunKeys.slice(-120),
        recentKeywords: state.recentKeywords.slice(-20),
      },
      null,
      2,
    ),
    "utf8",
  );
};