import z from "zod";
import { filenameSchema, multerFileSchema } from "../../schemas/file.schemas";

export const uploadFileCodec = z
	.object({
		filename: filenameSchema,
		file: multerFileSchema,
	})
	.strict();
