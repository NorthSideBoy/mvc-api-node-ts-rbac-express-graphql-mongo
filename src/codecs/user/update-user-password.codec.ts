import { z } from "zod";
import { passwordSchema } from "./fields.schema";

export const updateUserPasswordCodec = z
	.object({
		password: passwordSchema,
	})
	.strict();
