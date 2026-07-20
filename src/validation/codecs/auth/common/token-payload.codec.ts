import z from "zod";
import { tokenSignCodec } from "./token-sign.codec";

export const tokenPayloadCodec = z.object({
	...tokenSignCodec.shape,
	iat: z.number().int().nonnegative(),
	exp: z.number().int().positive(),
});
