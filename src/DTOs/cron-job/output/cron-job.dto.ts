import type { output } from "zod";
import type { cronJobCodec } from "../../../validation/codecs/cron-job/output/cron-job.codec";

export type CronJob = output<typeof cronJobCodec>;
