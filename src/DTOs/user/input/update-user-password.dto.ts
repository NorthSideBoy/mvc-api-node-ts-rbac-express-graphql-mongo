import type { input } from "zod";
import type { updateUserPasswordCodec } from "../../../validation/codecs/user/input/update-user-password.codec";

export type UpdateUserPassword = input<typeof updateUserPasswordCodec>;
