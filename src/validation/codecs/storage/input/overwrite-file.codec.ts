import z from "zod";
import { filenameSchema, fileSchema } from "../../../schemas/file.schemas";
import { readFileCodec } from "./read-file.codec";

export const overwriteFileCodec = z
	.object({
		...readFileCodec.shape,
		file: fileSchema,
		newFilename: filenameSchema.optional(),
	})
	.strict();
