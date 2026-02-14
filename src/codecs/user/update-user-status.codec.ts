import { z } from "zod";
import { enableSchema } from "./fields.schema";

export const updateUserStatusCodec = z
	.object({
		enable: enableSchema,
	})
	.strict();
