import type ExecutionContext from "../../context/execution-context";
import { context } from "../../utils/context.util";
import { logger } from "../../utils/logger.util";
import type { CronJobRunContext } from "../types";

export default abstract class BaseJob {
	protected readonly ctx: ExecutionContext;

	constructor(ctx?: ExecutionContext) {
		this.ctx = ctx ?? context.get();
	}

	async run(runContext: CronJobRunContext): Promise<void> {
		const metadata = {
			actor: this.ctx.actor.audit,
			execution_id: runContext.executionId,
			scheduled_at: runContext.scheduledAt,
		};
		const name = runContext.key.replaceAll("-", " ");
		logger.info(metadata, `[Cron] ${name}`);

		try {
			await this.execute(runContext);
		} catch (error) {
			logger.error({ ...metadata, error }, `[Cron] ${name} failed`);
			throw error;
		}
	}

	protected async execute(_runContext: CronJobRunContext): Promise<void> {}
}
