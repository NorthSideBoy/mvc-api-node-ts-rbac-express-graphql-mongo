import type { input } from "zod";
import type { updateUserUsernameCodec } from "../../../validation/codecs/user/input/update-user-username.codec";

export type UpdateUserUsername = input<typeof updateUserUsernameCodec>;
