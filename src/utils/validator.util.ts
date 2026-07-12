import type { output as Output, ZodType } from "zod";

export const valid =
	(schema: ZodType) =>
	(value: unknown): string | true => {
		const result = schema.safeParse(value);
		if (result.success) return true;

		return result.error.issues.map((err) => err.message).join(", ");
	};

export const decode = <TCodec extends ZodType>(
	codec: TCodec,
	input: unknown,
): Output<TCodec> => {
	const result = codec.safeParse(input);

	if (!result.success) throw result.error;

	return result.data;
};
