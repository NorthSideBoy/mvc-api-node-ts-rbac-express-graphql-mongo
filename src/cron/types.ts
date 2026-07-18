import type { CronJobKey } from "../enums/cron-job-key.enum";
import type BaseJob from "./jobs/base.job";

export type CronJobRunContext = {
	key: CronJobKey;
	executionId?: string;
	scheduledAt: Date;
};

export type CronJobDefinition = {
	key: CronJobKey;
	defaultExpression: string;
	defaultTimezone: string;
	factory: () => BaseJob;
};
