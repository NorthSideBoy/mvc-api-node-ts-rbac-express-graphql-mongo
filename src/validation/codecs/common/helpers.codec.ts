import z from "zod";
import { entityCodec } from "./entity.codec";
import { queryCodec } from "./query.codec";

const atLeastOneField = (data: Record<string, unknown>): boolean =>
	Object.values(data).some((value) => value !== undefined);

export const entityOutputCodec = <TShape extends z.ZodRawShape>(
	shape: TShape,
) =>
	z
		.object({
			...entityCodec.shape,
			...shape,
		})
		.strict();

export const queryInputCodec = <TShape extends z.ZodRawShape>(shape: TShape) =>
	z
		.object({
			...queryCodec.shape,
			...shape,
		})
		.strict();

export const partialUpdateCodec = <TShape extends z.ZodRawShape>(
	shape: TShape,
) =>
	z
		.object(shape)
		.partial()
		.strict()
		.refine(atLeastOneField, "At least one field must be provided");
