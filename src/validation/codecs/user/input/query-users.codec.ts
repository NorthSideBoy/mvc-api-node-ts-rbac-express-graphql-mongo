import { queryBooleanSchema } from "../../../schemas/common.schemas";
import {
	firstnameSchema,
	lastnameSchema,
} from "../../../schemas/person.schemas";
import {
	emailSchema,
	roleSchema,
	usernameSchema,
} from "../../../schemas/user.schemas";
import { queryInputCodec } from "../../common/helpers.codec";

export const queryUsersCodec = queryInputCodec({
	firstname: firstnameSchema.optional(),
	lastname: lastnameSchema.optional(),
	username: usernameSchema.optional(),
	email: emailSchema.optional(),
	role: roleSchema.optional(),
	enable: queryBooleanSchema.optional(),
});
