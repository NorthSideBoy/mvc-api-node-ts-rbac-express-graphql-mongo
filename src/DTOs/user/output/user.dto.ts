import type { output } from "zod";
import type { userCodec } from "../../../validation/codecs/user/output/user.codec";

export type User = output<typeof userCodec>;
