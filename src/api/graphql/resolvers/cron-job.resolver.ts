import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { CronJobKey } from "../../../enums/cron-job-key.enum";
import { Role } from "../../../enums/role.enum";
import CronJobService from "../../../services/cron-job.service";
import { mapper } from "../../../utils/mapper.util";
import { authGuard } from "../middlewares/auth.middleware";
import { contextMiddleware } from "../middlewares/context.middleware";
// biome-ignore lint: GQL schemas should not be type
import ConfigureCronJobGQL from "../schemas/cron-job/input/configure-cron-job.schema";
import CronJobGQL from "../schemas/cron-job/output/cron-job.schema";
import type { GraphQLContext } from "../types/graphql-context.type";

@Resolver()
export default class CronJobResolver {
	private cronJobService(ctx: GraphQLContext): CronJobService {
		return new CronJobService(ctx.req.context);
	}

	@Query(() => [CronJobGQL])
	@UseMiddleware([authGuard("Bearer", [Role.ADMIN]), contextMiddleware()])
	async cronJobs(@Ctx() ctx: GraphQLContext): Promise<CronJobGQL[]> {
		const result = await this.cronJobService(ctx).findAll();

		return result.map((item) => mapper.toClass(CronJobGQL, item));
	}

	@Query(() => CronJobGQL, { nullable: true })
	@UseMiddleware([authGuard("Bearer", [Role.ADMIN]), contextMiddleware()])
	async cronJob(
		@Ctx() ctx: GraphQLContext,
		@Arg("key", () => CronJobKey) key: CronJobKey,
	): Promise<CronJobGQL | null> {
		const result = await this.cronJobService(ctx).findByKey(key);

		return result ? mapper.toClass(CronJobGQL, result) : null;
	}

	@Mutation(() => CronJobGQL)
	@UseMiddleware([authGuard("Bearer", [Role.ADMIN]), contextMiddleware()])
	async configureCronJob(
		@Ctx() ctx: GraphQLContext,
		@Arg("key", () => CronJobKey) key: CronJobKey,
		@Arg("data") data: ConfigureCronJobGQL,
	): Promise<CronJobGQL> {
		const result = await this.cronJobService(ctx).configure(key, data);

		return mapper.toClass(CronJobGQL, result);
	}
}
