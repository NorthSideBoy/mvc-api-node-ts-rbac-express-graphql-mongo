import { setTimeout as delay } from "node:timers/promises";
import type { TaskContext } from "node-cron";
import ExecutionContext from "../context/execution-context";
import type { CronJobKey } from "../enums/cron-job-key.enum";
import { context } from "../utils/context.util";
import { logger } from "../utils/logger.util";
import type BaseJob from "./jobs/base.job";
import type { CronJobDefinition } from "./types";

export default class CronJobExecutor {
	private readonly running = new Map<CronJobKey, Promise<void>>();

	async execute(
		definition: CronJobDefinition,
		taskContext: TaskContext,
	): Promise<boolean> {
		if (this.running.has(definition.key)) {
			logger.warn(
				{ job: definition.key },
				"[Cron] execution skipped because the job is already running",
			);
			return false;
		}

		const execution = Promise.resolve().then(() =>
			this.run(definition, taskContext),
		);
		this.running.set(definition.key, execution);
		try {
			await execution;
			return true;
		} finally {
			if (this.running.get(definition.key) === execution)
				this.running.delete(definition.key);
		}
	}

	async waitForIdle(timeoutMs: number): Promise<boolean> {
		const executions = Array.from(this.running.values());
		if (executions.length === 0) return true;
		if (timeoutMs <= 0) return false;

		return await Promise.race([
			Promise.allSettled(executions).then(() => true),
			delay(timeoutMs, false, { ref: false }),
		]);
	}

	private async run(
		definition: CronJobDefinition,
		taskContext: TaskContext,
	): Promise<void> {
		const systemContext = ExecutionContext.system();
		await context.runAsync(systemContext, async () => {
			const job = this.createJob(definition);
			await job.run({
				key: definition.key,
				executionId: taskContext.execution?.id,
				scheduledAt: taskContext.date,
			});
		});
	}

	private createJob(definition: CronJobDefinition): BaseJob {
		try {
			return definition.factory();
		} catch (error) {
			logger.error(
				{ error, job: definition.key },
				"[Cron] failed to create job",
			);
			throw error;
		}
	}
}
