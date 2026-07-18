import { cronJobCatalog } from "../cron/catalog";
import { cronScheduler } from "../cron/scheduler";
import type { ConfigureCronJob } from "../DTOs/cron-job/input/configure-cron-job.dto";
import type { CronJob as DTO } from "../DTOs/cron-job/output/cron-job.dto";
import type { CronJobKey } from "../enums/cron-job-key.enum";
import { EVENTS } from "../events/constants/events.constants";
import CronJob from "../models/cron-job.model";
import { Permission } from "../rbac";
import { decode } from "../utils/validator.util";
import { configureCronJobCodec } from "../validation/codecs/cron-job/input/configure-cron-job.codec";
import { cronJobKeySchema } from "../validation/schemas/cron-job.schemas";
import BaseService from "./base.service";

export default class CronJobService extends BaseService {
	private async findOrBuildConfiguration(key: CronJobKey) {
		const configuration = await CronJob.findOne({ key });
		if (configuration) return configuration;
		const definition = cronJobCatalog.get(key);
		return new CronJob({
			key,
			expression: definition.defaultExpression,
			timezone: definition.defaultTimezone,
			enabled: false,
		});
	}

	async findAll(): Promise<DTO[]> {
		this.authorize(Permission.CronJob.Read);
		const configurations = await CronJob.find().sort({ key: 1 });
		return configurations.map((configuration) => configuration.dto());
	}

	async findByKey(key: CronJobKey): Promise<DTO | null> {
		this.authorize(Permission.CronJob.Read);
		const decodedKey = decode(cronJobKeySchema, key);
		const configuration = await CronJob.findOne({ key: decodedKey });

		return configuration?.dto() || null;
	}

	async configure(key: CronJobKey, input: ConfigureCronJob): Promise<DTO> {
		const decodedKey = decode(cronJobKeySchema, key);
		const decoded = decode(configureCronJobCodec, input);
		this.authorize(Permission.CronJob.Configure);
		const configuration = await this.findOrBuildConfiguration(decodedKey);
		configuration.set(decoded);
		if (!configuration.isNew) configuration.increment();
		await configuration.save();
		await cronScheduler.reload(decodedKey);
		this.emit(EVENTS.CRON_JOB.CONFIGURED, {
			key: decodedKey,
			enabled: configuration.enabled,
			expression: configuration.expression,
			timezone: configuration.timezone,
		});

		return configuration.dto();
	}
}
