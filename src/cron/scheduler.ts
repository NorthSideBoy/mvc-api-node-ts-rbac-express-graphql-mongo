import cron, { type ScheduledTask } from "node-cron";
import type { CronJobKey } from "../enums/cron-job-key.enum";
import CronJob, {
	type CronJob as CronJobConfigEntity,
} from "../models/cron-job.model";
import { logger } from "../utils/logger.util";
import { cronJobScheduleSchema } from "../validation/schemas/cron-job.schemas";
import { cronJobCatalog } from "./catalog";
import CronJobExecutor from "./executor";
import type { CronJobDefinition } from "./types";

const SHUTDOWN_TIMEOUT_MS = 30_000;

export class CronScheduler {
	private readonly tasks = new Map<CronJobKey, ScheduledTask>();
	private readonly pendingReloads = new Map<CronJobKey, Promise<void>>();
	private readonly executor = new CronJobExecutor();
	private initialized = false;

	async initialize(): Promise<number> {
		if (this.initialized) {
			logger.info("[Cron] scheduler already initialized");
			return this.tasks.size;
		}

		this.configureLogger();
		await this.seedConfigurations();
		const configurations = await CronJob.find();

		try {
			for (const configuration of configurations) {
				await this.applyConfiguration(configuration, false);
			}
			this.initialized = true;
		} catch (error) {
			await this.destroyAllTasks();
			throw error;
		}

		logger.info({ tasks: this.tasks.size }, "[Cron] scheduler initialized");
		return this.tasks.size;
	}

	async reload(key: CronJobKey) {
		const previous = this.pendingReloads.get(key) ?? Promise.resolve();
		const current = previous
			.catch(() => undefined)
			.then(() => this.reloadConfiguration(key));
		this.pendingReloads.set(key, current);

		try {
			await current;
		} finally {
			if (this.pendingReloads.get(key) === current)
				this.pendingReloads.delete(key);
		}
	}

	async shutdown() {
		if (!this.initialized && this.tasks.size === 0) return;

		this.initialized = false;
		logger.info("[Cron] scheduler shutting down");
		await Promise.allSettled(this.pendingReloads.values());
		const deadline = Date.now() + SHUTDOWN_TIMEOUT_MS;
		await cron.shutdown(Math.max(0, deadline - Date.now()));
		const idle = await this.executor.waitForIdle(
			Math.max(0, deadline - Date.now()),
		);
		if (!idle)
			logger.warn(
				{ timeout_ms: SHUTDOWN_TIMEOUT_MS },
				"[Cron] shutdown timed out with active executions",
			);
		this.tasks.clear();
		this.pendingReloads.clear();
		logger.info("[Cron] scheduler stopped");
	}

	private configureLogger() {
		cron.setLogger({
			info: (message) => logger.info(message),
			warn: (message) => logger.warn(message),
			error: (message, error) => {
				if (typeof message === "string") {
					logger.error({ error }, message);
					return;
				}

				logger.error({ error: error ?? message }, "[Cron] internal error");
			},
			debug: (message) => logger.debug(message),
		});
	}

	private async seedConfigurations() {
		const existingKeys = new Set(await CronJob.distinct("key"));
		const configurations = cronJobCatalog
			.all()
			.filter((definition) => !existingKeys.has(definition.key))
			.map((definition) => ({
				key: definition.key,
				expression: definition.defaultExpression,
				timezone: definition.defaultTimezone,
				enabled: false,
			}));

		if (configurations.length > 0) await CronJob.create(configurations);
	}

	private async reloadConfiguration(key: CronJobKey) {
		if (!this.initialized) return;

		const configuration = await CronJob.findOne({ key });
		if (configuration) await this.applyConfiguration(configuration, true);
		else await this.removeTask(key);
	}

	private async applyConfiguration(
		configuration: CronJobConfigEntity,
		throwOnInvalid: boolean,
	) {
		if (!configuration.enabled) {
			await this.removeTask(configuration.key);
			return;
		}

		let definition: CronJobDefinition;
		try {
			definition = cronJobCatalog.get(configuration.key);
		} catch (error) {
			logger.error(
				{ error, job: configuration.key },
				"[Cron] unregistered job configuration ignored",
			);
			if (throwOnInvalid) throw error;
			return;
		}

		const schedule = cronJobScheduleSchema.safeParse(configuration);
		if (!schedule.success) {
			logger.error(
				{ job: configuration.key, issues: schedule.error.issues },
				"[Cron] invalid persisted configuration; existing schedule unchanged",
			);
			if (throwOnInvalid) throw schedule.error;
			return;
		}

		const previous = this.tasks.get(configuration.key);
		const task = cron.createTask(
			schedule.data.expression,
			(taskContext) => this.executor.execute(definition, taskContext),
			{
				name: configuration.key,
				timezone: schedule.data.timezone,
				noOverlap: true,
			},
		);
		this.observeTask(configuration.key, task);
		try {
			await task.start();
		} catch (error) {
			await task.destroy();
			throw error;
		}

		this.tasks.set(configuration.key, task);
		if (previous) await previous.destroy();
	}

	private async removeTask(key: CronJobKey) {
		const task = this.tasks.get(key);
		if (!task) return;

		await task.destroy();
		this.tasks.delete(key);
	}

	private observeTask(key: CronJobKey, task: ScheduledTask) {
		task.on("execution:overlap", () => {
			logger.warn({ job: key }, "[Cron] overlapping execution skipped");
		});
		task.on("execution:missed", (taskContext) => {
			logger.warn(
				{ job: key, scheduled_at: taskContext.date },
				"[Cron] execution missed",
			);
		});
	}

	private async destroyAllTasks() {
		for (const task of this.tasks.values()) {
			await task.destroy();
		}
		this.tasks.clear();
	}
}

export const cronScheduler = new CronScheduler();
