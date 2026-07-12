import type { input } from "zod";
import type { updateUserEmailCodec } from "../../../validation/codecs/user/input/update-user-email.codec";

export type UpdateUserEmail = input<typeof updateUserEmailCodec>;
