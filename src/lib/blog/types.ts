export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  publishedAt: string;
};

export type BlogPostInput = Omit<BlogPost, "id">;

export type BlogSchedulerState = {
  completedRunKeys: string[];
  recentKeywords: string[];
};

export type BlogGenerationResult = {
  keyword: string;
  post: BlogPostInput;
  wordCount: number;
};

export type BlogListResult = {
  posts: BlogPost[];
  page: number;
  perPage: number;
  totalPosts: number;
  totalPages: number;
};