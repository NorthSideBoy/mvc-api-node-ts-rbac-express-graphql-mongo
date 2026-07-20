import type { z } from "zod";
import type { identityCodec } from "../validation/codecs/user/common/identity.codec";

export type Identity = z.infer<typeof identityCodec>;
