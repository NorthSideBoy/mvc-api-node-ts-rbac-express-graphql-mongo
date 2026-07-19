import z from "zod";
import {
	emailSchema,
	roleSchema,
	usernameSchema,
} from "../../../schemas/user.schemas";
import { entityOutputCodec } from "../../common/helpers.codec";
import { personCodec } from "../../common/person.codec";
import { fileCodec } from "../../file/output/file.codec";

export const userCodec = entityOutputCodec({
	...personCodec.shape,
	username: usernameSchema,
	email: emailSchema,
	picture: fileCodec,
	enable: z.boolean().default(true),
	role: roleSchema,
});
