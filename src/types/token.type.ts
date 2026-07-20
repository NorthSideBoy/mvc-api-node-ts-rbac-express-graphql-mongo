import type { z } from "zod";
import type { tokenPayloadCodec } from "../validation/codecs/auth/common/token-payload.codec";
import type { tokenSignCodec } from "../validation/codecs/auth/common/token-sign.codec";

export namespace Token {
	export type Sign = z.infer<typeof tokenSignCodec>;

	export type Payload = z.infer<typeof tokenPayloadCodec>;
}
