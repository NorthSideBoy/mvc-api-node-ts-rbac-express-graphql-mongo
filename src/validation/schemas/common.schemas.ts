import { ObjectId } from "mongodb";
import z from "zod";

export const idSchema = z
	.string()
	.refine((val) => ObjectId.isValid(val), { message: "Invalid ID" });

export const urlSchema = z.url("Invalid url");

export const jwtSchema = z
	.string()
	.regex(
		/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
		"Invalid token (JWT)",
	);

const dateFormatMessage =
	"Invalid date format. Expected YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DDTHH:mm:ssZ, or YYYY-MM-DDTHH:mm:ss.sssZ";
const dateTimeSchema = z.union([
	z.iso.datetime({ precision: 0, offset: false, local: false }),
	z.iso.datetime({ precision: 3, offset: false, local: false }),
]);

function dateFromParts(year: number, month: number, day: number): Date | null {
	const date = new Date(Date.UTC(year, month - 1, day));
	const isValid =
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day;

	return isValid ? date : null;
}

function parseDateOnly(value: string): Date | null {
	const yearFirst = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(value);
	if (yearFirst) {
		const [, year, month, day] = yearFirst;

		return dateFromParts(Number(year), Number(month), Number(day));
	}

	const dayFirst = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(value);
	if (dayFirst) {
		const [, day, month, year] = dayFirst;

		return dateFromParts(Number(year), Number(month), Number(day));
	}

	return null;
}

function parseDateString(value: string): Date | null {
	const dateOnly = parseDateOnly(value);
	if (dateOnly) return dateOnly;
	if (!dateTimeSchema.safeParse(value).success) return null;

	return new Date(value);
}

const dateStringSchema = z
	.string()
	.trim()
	.refine((value) => parseDateString(value) !== null, {
		message: dateFormatMessage,
	});

export const dateSchema: z.ZodType<Date, string | Date> = z
	.union([dateStringSchema, z.date()])
	.transform((value) => {
		if (value instanceof Date) return value;

		return parseDateString(value) as Date;
	});

export const queryBooleanSchema = z.preprocess((val) => {
	if (typeof val !== "string") return val;
	const normalized = val.trim().toLowerCase();
	return normalized === "true" || normalized === "1"
		? true
		: normalized === "false" || normalized === "0"
			? false
			: val;
}, z.boolean());
