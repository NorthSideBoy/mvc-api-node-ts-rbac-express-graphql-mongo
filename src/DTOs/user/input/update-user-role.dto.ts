import type { input } from "zod";
import type { updateUserRoleCodec } from "../../../validation/codecs/user/input/update-user-role.codec";

export type UpdateUserRole = input<typeof updateUserRoleCodec>;
