import type { output } from "zod";
import type { authenticatedUserCodec } from "../../../validation/codecs/auth/output/authenticated-user.codec";

export type AuthenticatedUser = output<typeof authenticatedUserCodec>;
