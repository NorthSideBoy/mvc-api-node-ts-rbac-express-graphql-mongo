import z from "zod";
import {
	filenameSchema,
	fileSchema,
	pathSchema,
} from "../../../schemas/file.schemas";

export const saveFileCodec = z
	.object({
		file: fileSchema,
		filepath: pathSchema,
		filename: filenameSchema.optional(),
	})
	.strict();
