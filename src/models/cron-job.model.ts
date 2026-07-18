import {
	type DocumentType,
	getModelForClass,
	prop,
} from "@typegoose/typegoose";
import { Expose } from "class-transformer";
import type { CronJob as DTO } from "../DTOs/cron-job/output/cron-job.dto";
import { CronJobKey } from "../enums/cron-job-key.enum";
import { mapper } from "../utils/mapper.util";
import { cronJobCodec } from "../validation/codecs/cron-job/output/cron-job.codec";
import type { EntityModelType } from "./entity.model";
import { Entity } from "./entity.model";

type CronJobModel = EntityModelType<typeof CronJob>;

export class CronJob extends Entity {
	@Expose()
	@prop({ required: true, enum: CronJobKey, unique: true, immutable: true })
	key: CronJobKey;

	@Expose()
	@prop({ required: true, trim: true })
	expression: string;

	@Expose()
	@prop({ required: true, trim: true, default: "UTC" })
	timezone: string;

	@Expose()
	@prop({ required: true, default: false })
	enabled: boolean;

	public dto(this: DocumentType<CronJob>): DTO {
		return mapper.toDto(CronJob, this, cronJobCodec);
	}
}

const cronJobModel = getModelForClass(CronJob) as CronJobModel;

export default cronJobModel;
