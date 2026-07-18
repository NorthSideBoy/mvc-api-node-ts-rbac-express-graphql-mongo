import {
	Body,
	Get,
	Middlewares,
	OperationId,
	Path,
	Put,
	Response,
	Route,
	Security,
	SuccessResponse,
	Tags,
} from "tsoa";
import type { ConfigureCronJob } from "../../../DTOs/cron-job/input/configure-cron-job.dto";
import type { CronJob } from "../../../DTOs/cron-job/output/cron-job.dto";
import type { CronJobKey } from "../../../enums/cron-job-key.enum";
import { Role } from "../../../enums/role.enum";
import CronJobService from "../../../services/cron-job.service";
import { contextMiddleware } from "../middlewares/context.middleware";
import { BaseController } from "./base.controller";

@Route("cron-jobs")
@Tags("Cron jobs")
export class CronJobController extends BaseController {
	private readonly cronJobService = new CronJobService();

	/**
	 * @summary Get cron job configurations
	 */
	@Get("/")
	@OperationId("CronJobsFindAll")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(403, "Forbidden")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.ADMIN])
	@Middlewares([contextMiddleware])
	async findAll(): Promise<CronJob[]> {
		return await this.cronJobService.findAll();
	}

	/**
	 * @summary Get a cron job configuration
	 */
	@Get("/{key}")
	@OperationId("CronJobsFindByKey")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(403, "Forbidden")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.ADMIN])
	@Middlewares([contextMiddleware])
	async findByKey(@Path() key: CronJobKey): Promise<CronJob | null> {
		return await this.cronJobService.findByKey(key);
	}

	/**
	 * @summary Configure and enable or disable a cron job
	 */
	@Put("/{key}")
	@OperationId("CronJobsConfigure")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(403, "Forbidden")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.ADMIN])
	@Middlewares([contextMiddleware])
	async configure(
		@Path() key: CronJobKey,
		@Body() body: ConfigureCronJob,
	): Promise<CronJob> {
		return await this.cronJobService.configure(key, body);
	}
}
