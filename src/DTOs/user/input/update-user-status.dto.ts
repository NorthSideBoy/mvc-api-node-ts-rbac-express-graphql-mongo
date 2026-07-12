import type { input } from "zod";
import type { updateUserStatusCodec } from "../../../validation/codecs/user/input/update-user-status.codec";

export type UpdateUserStatus = input<typeof updateUserStatusCodec>;
