import z from "zod";
import { FILE_SIZE_LIMITS } from "../../constants/file.constant";
import { FileVisibility } from "../../enums/file-visibility.enum";
import { Mimetype } from "../../enums/mimetype.enum";

export const fileSchema = z
	.file()
	.min(1)
	.max(FILE_SIZE_LIMITS.default)
	.mime(Object.values(Mimetype));

export const imageSchema = z
	.file()
	.min(1)
	.max(FILE_SIZE_LIMITS.image)
	.mime([Mimetype.JPEG, Mimetype.PNG]);

export const altSchema = z.string().nonempty().min(1).max(255).trim();

export const filenameSchema = z
	.string()
	.trim()
	.nonempty()
	.min(1)
	.max(255)
	.refine((value) => !/[\\/]/.test(value) && value !== "..", {
		message: "Filename cannot contain path separators or traversal segments",
	});

export const sizeSchema = z.number().max(FILE_SIZE_LIMITS.default);

export const mimetypeSchema = z.enum(Mimetype);

export const extSchema = z.string().min(1).max(10);

export const pathSchema = z
	.string()
	.trim()
	.min(1)
	.max(512)
	.regex(/^[a-zA-Z0-9\-_./\\]+$/)
	.refine((value) => !/^(?:[a-zA-Z]:)?[\\/]/.test(value), {
		message: "Path must be relative",
	})
	.refine(
		(value) =>
			value
				.split(/[\\/]+/)
				.filter(Boolean)
				.every((segment) => segment !== ".."),
		{ message: "Path cannot contain traversal segments" },
	);

export const visibilitySchema = z.enum(FileVisibility);
