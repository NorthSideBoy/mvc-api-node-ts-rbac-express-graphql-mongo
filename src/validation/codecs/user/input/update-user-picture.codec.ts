import z from "zod";
import { imageSchema } from "../../../schemas/file.schemas";

export const updateUserPictureCodec = z
	.object({
		picture: imageSchema,
	})
	.strict();
