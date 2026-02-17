import { z } from "zod";
import { updateRoleSchema } from "./fields.schema";

export const updateUserRoleCodec = z
	.object({
		role: updateRoleSchema,
	})
	.strict();
