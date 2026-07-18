import type { input } from "zod";
import type { configureCronJobCodec } from "../../../validation/codecs/cron-job/input/configure-cron-job.codec";

export type ConfigureCronJob = input<typeof configureCronJobCodec>;
