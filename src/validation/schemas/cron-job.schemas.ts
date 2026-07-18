import cron from "node-cron";
import z from "zod";
import { CronJobKey } from "../../enums/cron-job-key.enum";

export const cronJobKeySchema = z.enum(CronJobKey);

export const cronExpressionSchema = z
	.string()
	.trim()
	.min(1)
	.refine((value) => cron.validate(value), "Invalid cron expression");

export const timezoneSchema = z
	.string()
	.trim()
	.min(1)
	.refine((value) => {
		try {
			new Intl.DateTimeFormat("en-US", { timeZone: value });
			return true;
		} catch {
			return false;
		}
	}, "Invalid IANA timezone");

export const cronJobScheduleSchema = z.object({
	expression: cronExpressionSchema,
	timezone: timezoneSchema,
});
