import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import type { CronJob } from "../../../../../DTOs/cron-job/output/cron-job.dto";
import { CronJobKey } from "../../../../../enums/cron-job-key.enum";

registerEnumType(CronJobKey, {
	name: "CronJobKey",
	description: "Registered cron job handlers",
});

@ObjectType("CronJob")
export default class CronJobGQL implements CronJob {
	@Field(() => ID)
	id!: string;

	@Field(() => CronJobKey)
	key!: CronJobKey;

	@Field()
	expression!: string;

	@Field()
	timezone!: string;

	@Field()
	enabled!: boolean;

	@Field()
	createdAt!: Date;

	@Field()
	updatedAt!: Date;
}
