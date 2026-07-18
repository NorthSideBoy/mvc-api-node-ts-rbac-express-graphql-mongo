import z from "zod";
import {
	cronExpressionSchema,
	timezoneSchema,
} from "../../../schemas/cron-job.schemas";
import { partialUpdateCodec } from "../../common/helpers.codec";

export const configureCronJobCodec = partialUpdateCodec({
	expression: cronExpressionSchema,
	timezone: timezoneSchema,
	enabled: z.boolean(),
});
