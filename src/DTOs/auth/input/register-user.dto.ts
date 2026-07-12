import type { input } from "zod";
import type { registerUserCodec } from "../../../validation/codecs/auth/input/register-user.codec";

export type RegisterUser = input<typeof registerUserCodec>;
