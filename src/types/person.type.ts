import type { z } from "zod";
import type { personCodec } from "../validation/codecs/common/person.codec";

export type Person = z.infer<typeof personCodec>;
