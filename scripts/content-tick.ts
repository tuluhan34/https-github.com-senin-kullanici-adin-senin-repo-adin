import { BLOG_SCHEDULE_TIMES } from "../src/lib/blog/keywords";
import {
  ensureBlogBootstrap,
  generateAndPublishBlogPostWithRetry,
  hasSchedulerRun,
  markSchedulerRun,
} from "../src/lib/blog/service";
import { getIstanbulClock } from "../src/lib/blog/utils";

const forceRun = process.argv.includes("--force");

const run = async () => {
  await ensureBlogBootstrap();

  const now = new Date();
  const clock = getIstanbulClock(now);
  const isScheduledMinute = BLOG_SCHEDULE_TIMES.includes(
    clock.timeKey as (typeof BLOG_SCHEDULE_TIMES)[number],
  );

  if (!forceRun && !isScheduledMinute) {
    console.log(`SKIP: ${clock.timeKey} scheduled degil`);
    return;
  }

  const runKey = `${clock.dateKey}-${clock.timeKey}`;

  if (!forceRun && (await hasSchedulerRun(runKey))) {
    console.log(`SKIP: ${runKey} zaten calisti`);
    return;
  }

  const post = await generateAndPublishBlogPostWithRetry(now, 3);

  if (!forceRun) {
    await markSchedulerRun(runKey);
  }

  console.log(`OK: yeni blog yayinlandi -> ${post.slug}`);
};

run().catch((error) => {
  console.error("FAIL:", error);
  process.exitCode = 1;
});
