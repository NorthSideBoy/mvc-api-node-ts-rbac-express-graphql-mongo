import type z from "zod";

export function parseSchema(schema: z.ZodSchema) {
	return (value: unknown): string | true => {
		const result = schema.safeParse(value);
		if (result.success) return true;
		const errors = result.error.issues.map((err) => err.message).join(", ");
		return errors;
	};
}
