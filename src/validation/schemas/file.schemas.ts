import z from "zod";
import { Mimetype } from "../../enums/mimetype.enum";

export const multerFileSchema = z
	.object({
		fieldname: z.string(),
		originalname: z.string(),
		encoding: z.string(),
		mimetype: z.enum(Object.values(Mimetype) as [string, ...string[]]),
		buffer: z.instanceof(Buffer),
		size: z
			.number()
			.min(1)
			.max(1024 * 1024),
	})
	.loose();

export const multerFilesSchema = z.array(multerFileSchema).min(1).max(10);

export const filenameSchema = z
	.string()
	.nonempty("Filename is required")
	.min(1, "Filename must be at least 1 character")
	.max(255, "Filename cannot exceed 255 characters")
	.refine(
		(val) => {
			return (
				/^[a-zA-Z0-9!\-_.*'() ]+$/.test(val) &&
				!val.includes("..") &&
				!val.startsWith(".") &&
				!val.includes("/") &&
				!val.includes("\\") &&
				!val.includes(":")
			);
		},
		{
			message:
				"Filename contains invalid characters. Allowed: letters, numbers, spaces, and characters: ! - _ . * ' ( )",
		},
	)
	.transform((val) => val.trim());
