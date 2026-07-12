import { dateSchema } from "../../../schemas/common.schemas";
import { partialUpdateCodec } from "../../common/helpers.codec";
import { personCodec } from "../../common/person.codec";

export const updateUserProfileCodec = partialUpdateCodec({
	...personCodec.shape,
	birthday: dateSchema,
});
