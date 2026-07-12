import type { z } from "zod";
import type { resultCodec } from "../validation/codecs/common/result.codec";

export type Result<T = unknown> = z.infer<typeof resultCodec> & {
	meta?: T;
};
