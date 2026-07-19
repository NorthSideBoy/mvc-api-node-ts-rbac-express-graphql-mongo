import { partialUpdateCodec } from "../../common/helpers.codec";
import { personCodec } from "../../common/person.codec";

export const updateUserProfileCodec = partialUpdateCodec(personCodec.shape);
