import { CronJobKey } from "../enums/cron-job-key.enum";
import HeartbeatJob from "./jobs/heartbeat.job";
import type { CronJobDefinition } from "./types";

const definitions: readonly CronJobDefinition[] = [
	{
		key: CronJobKey.Heartbeat,
		defaultExpression: "0 * * * *",
		defaultTimezone: "UTC",
		factory: () => new HeartbeatJob(),
	},
];

const byKey = new Map(
	definitions.map((definition) => [definition.key, definition]),
);

export const cronJobCatalog = {
	all(): readonly CronJobDefinition[] {
		return definitions;
	},

	get(key: CronJobKey): CronJobDefinition {
		const definition = byKey.get(key);
		if (!definition)
			throw new Error(`Cron job handler '${key}' is not registered.`);

		return definition;
	},
};
