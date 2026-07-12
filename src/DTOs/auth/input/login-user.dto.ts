import type { input } from "zod";
import type { loginUserCodec } from "../../../validation/codecs/auth/input/login-user.codec";

export type LoginUser = input<typeof loginUserCodec>;
