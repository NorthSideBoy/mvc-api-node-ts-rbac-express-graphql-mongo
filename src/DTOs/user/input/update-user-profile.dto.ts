import type { input } from "zod";
import type { updateUserProfileCodec } from "../../../validation/codecs/user/input/update-user-profile.codec";

export type UpdateUserProfile = input<typeof updateUserProfileCodec>;
