import z from "zod";
import { cronJobKeySchema } from "../../../schemas/cron-job.schemas";
import { entityOutputCodec } from "../../common/helpers.codec";

export const cronJobCodec = entityOutputCodec({
	key: cronJobKeySchema,
	expression: z.string(),
	timezone: z.string(),
	enabled: z.boolean(),
});
