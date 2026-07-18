import { Field, InputType } from "type-graphql";
import type { ConfigureCronJob } from "../../../../../DTOs/cron-job/input/configure-cron-job.dto";

@InputType("ConfigureCronJob")
export default class ConfigureCronJobGQL implements ConfigureCronJob {
	@Field({ nullable: true })
	expression?: string;

	@Field({ nullable: true })
	timezone?: string;

	@Field({ nullable: true })
	enabled?: boolean;
}
