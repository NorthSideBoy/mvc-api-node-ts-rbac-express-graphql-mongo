import type { input } from "zod";
import type { updateUserPictureCodec } from "../../../validation/codecs/user/input/update-user-picture.codec";

export type UpdateUserPicture = input<typeof updateUserPictureCodec>;
