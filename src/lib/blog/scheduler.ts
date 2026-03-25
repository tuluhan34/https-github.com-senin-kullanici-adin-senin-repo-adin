import { BLOG_SCHEDULE_TIMES } from "@/lib/blog/keywords";
import { ensureBlogBootstrap, generateAndPublishBlogPostWithRetry, hasSchedulerRun, markSchedulerRun } from "@/lib/blog/service";
import { getIstanbulClock } from "@/lib/blog/utils";

declare global {
  var __blogSchedulerStarted__: boolean | undefined;
  var __blogSchedulerTicking__: boolean | undefined;
  var __blogSchedulerInterval__: NodeJS.Timeout | undefined;
}

const tryScheduledGeneration = async () => {
  if (globalThis.__blogSchedulerTicking__) {
    return;
  }

  globalThis.__blogSchedulerTicking__ = true;

  try {
    await ensureBlogBootstrap();
    const now = new Date();
    const clock = getIstanbulClock(now);

    if (!BLOG_SCHEDULE_TIMES.includes(clock.timeKey as (typeof BLOG_SCHEDULE_TIMES)[number])) {
      return;
    }

    const runKey = `${clock.dateKey}-${clock.timeKey}`;

    if (await hasSchedulerRun(runKey)) {
      return;
    }

    await generateAndPublishBlogPostWithRetry(now, 3);
    await markSchedulerRun(runKey);
  } finally {
    globalThis.__blogSchedulerTicking__ = false;
  }
};

export const startBlogScheduler = () => {
  if (globalThis.__blogSchedulerStarted__) {
    return;
  }

  globalThis.__blogSchedulerStarted__ = true;
  void tryScheduledGeneration();
  globalThis.__blogSchedulerInterval__ = setInterval(() => {
    void tryScheduledGeneration();
  }, 60 * 1000);
};