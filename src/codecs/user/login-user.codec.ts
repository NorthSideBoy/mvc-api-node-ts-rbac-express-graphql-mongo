import { z } from "zod";
import { emailSchema, passwordSchema } from "./fields.schema";

export const loginUserCodec = z
	.object({
		email: emailSchema,
		password: passwordSchema,
	})
	.strict();
