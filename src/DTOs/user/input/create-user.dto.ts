import type { input } from "zod";
import type { createUserCodec } from "../../../validation/codecs/user/input/create-user.codec";

export type CreateUser = input<typeof createUserCodec>;
