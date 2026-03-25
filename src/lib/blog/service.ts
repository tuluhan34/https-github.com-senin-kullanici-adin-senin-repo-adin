import { blogKeywords, BLOG_SCHEDULE_TIMES } from "@/lib/blog/keywords";
import { generateBlogPost } from "@/lib/blog/generator";
import { fetchUnsplashHero } from "@/lib/blog/unsplash";
import { injectHeroImageIntoContent } from "@/lib/blog/generator";
import {
  blogSlugExists,
  countPublishedBlogPosts,
  createBlogPost,
  ensureBlogStorage,
  getBlogPostBySlug,
  getBlogStorageMode,
  listLatestBlogPosts,
  listPublishedBlogPosts,
  readBlogSchedulerState,
  writeBlogSchedulerState,
} from "@/lib/blog/store";
import { type BlogListResult, type BlogPost } from "@/lib/blog/types";
import { createSeededRandom, hashString, sleep } from "@/lib/blog/utils";

export const BLOG_PAGE_SIZE = 6;

const INITIAL_BLOG_POST_COUNT = 3;

const pickKeywordForDate = async (publishedAt: Date) => {
  const state = await readBlogSchedulerState();
  const recentKeywords = new Set(state.recentKeywords.slice(-10));
  const availableKeywords = blogKeywords.filter((keyword) => !recentKeywords.has(keyword));
  const source = availableKeywords.length > 0 ? availableKeywords : [...blogKeywords];
  const random = createSeededRandom(hashString(`${publishedAt.toISOString()}-${state.completedRunKeys.length}`));
  const index = Math.floor(random() * source.length);

  return source[index];
};

const persistKeywordUsage = async (keyword: string) => {
  const state = await readBlogSchedulerState();
  state.recentKeywords.push(keyword);
  await writeBlogSchedulerState(state);
};

const createUniquePost = async (publishedAt: Date, keyword: string, sequence: number) => {
  const generated = generateBlogPost({ keyword, publishedAt, sequence });
  let nextPost = generated.post;
  const hero = await fetchUnsplashHero(keyword);

  if (hero) {
    nextPost = {
      ...nextPost,
      content: injectHeroImageIntoContent(nextPost.content, hero),
    };
  }

  let slugAttempt = nextPost.slug;
  let slugCounter = 1;

  while (await blogSlugExists(slugAttempt)) {
    slugCounter += 1;
    slugAttempt = `${generated.post.slug}-${slugCounter}`;
  }

  nextPost = {
    ...nextPost,
    slug: slugAttempt,
  };

  const createdPost = await createBlogPost(nextPost);
  await persistKeywordUsage(keyword);

  return createdPost;
};

export const ensureBlogBootstrap = async () => {
  await ensureBlogStorage();
  const totalPosts = await countPublishedBlogPosts();

  if (totalPosts > 0) {
    return;
  }

  const now = new Date();

  for (let index = 0; index < INITIAL_BLOG_POST_COUNT; index += 1) {
    const publishedAt = new Date(now.getTime() - (index + 1) * 6 * 60 * 60 * 1000);
    const keyword = blogKeywords[index % blogKeywords.length];
    await createUniquePost(publishedAt, keyword, index + 1);
  }
};

export const listBlogPosts = async (page: number, perPage = BLOG_PAGE_SIZE): Promise<BlogListResult> => {
  await ensureBlogBootstrap();
  const totalPosts = await countPublishedBlogPosts();
  const totalPages = Math.max(1, Math.ceil(totalPosts / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const posts = await listPublishedBlogPosts(currentPage, perPage);

  return {
    posts,
    page: currentPage,
    perPage,
    totalPosts,
    totalPages,
  };
};

export const getPublishedBlogPost = async (slug: string) => {
  await ensureBlogBootstrap();
  return getBlogPostBySlug(slug);
};

export const generateAndPublishBlogPost = async (publishedAt = new Date()) => {
  await ensureBlogStorage();
  const keyword = await pickKeywordForDate(publishedAt);
  const totalPosts = await countPublishedBlogPosts();
  return createUniquePost(publishedAt, keyword, totalPosts + 1);
};

export const generateAndPublishBlogPostWithRetry = async (publishedAt = new Date(), retryCount = 3) => {
  let latestError: unknown;

  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
    try {
      return await generateAndPublishBlogPost(publishedAt);
    } catch (error) {
      latestError = error;

      if (attempt < retryCount) {
        await sleep(attempt * 500);
      }
    }
  }

  throw latestError;
};

export const getBlogStatus = async () => {
  await ensureBlogBootstrap();

  return {
    schedule: [...BLOG_SCHEDULE_TIMES],
    storageMode: await getBlogStorageMode(),
    totalPosts: await countPublishedBlogPosts(),
    latestPosts: await listLatestBlogPosts(5),
  };
};

export const markSchedulerRun = async (runKey: string) => {
  const state = await readBlogSchedulerState();

  if (!state.completedRunKeys.includes(runKey)) {
    state.completedRunKeys.push(runKey);
    await writeBlogSchedulerState(state);
  }
};

export const hasSchedulerRun = async (runKey: string) => {
  const state = await readBlogSchedulerState();
  return state.completedRunKeys.includes(runKey);
};

export const listRecentBlogPosts = async (): Promise<BlogPost[]> => {
  await ensureBlogBootstrap();
  return listLatestBlogPosts(5);
};