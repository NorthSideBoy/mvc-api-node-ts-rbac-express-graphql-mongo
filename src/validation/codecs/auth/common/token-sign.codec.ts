import z from "zod";
import { idSchema } from "../../../schemas/common.schemas";

export const tokenSignCodec = z.object({
	sub: idSchema,
});
