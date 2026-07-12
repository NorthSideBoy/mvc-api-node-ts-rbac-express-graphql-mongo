import z from "zod";
import { dateSchema } from "../../../schemas/common.schemas";
import { imageSchema } from "../../../schemas/file.schemas";
import {
	emailSchema,
	passwordSchema,
	usernameSchema,
} from "../../../schemas/user.schemas";
import { personCodec } from "../../common/person.codec";

export const registerUserCodec = z
	.object({
		...personCodec.shape,
		username: usernameSchema,
		email: emailSchema,
		picture: imageSchema.optional(),
		password: passwordSchema,
		birthday: dateSchema,
		enable: z.boolean().default(true),
	})
	.strict();
