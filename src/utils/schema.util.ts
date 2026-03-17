import type z from "zod";

export const schema = {
	parse:
		(schema: z.ZodSchema) =>
		(value: unknown): string | true => {
			const result = schema.safeParse(value);
			if (result.success) return true;
			const errors = result.error.issues.map((err) => err.message).join(", ");
			return errors;
		},
} as const;
