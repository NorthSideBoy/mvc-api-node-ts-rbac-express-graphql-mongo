import type { RequestHandler } from "express";
import type { ExtendedRequest } from "../../../types/extended-request.type";
import { context } from "../../../utils/context.util";
import { contextualize } from "../../common/context.common";

export const contextMiddleware: RequestHandler = (
	request: ExtendedRequest,
	_response,
	next,
) => {
	const ctx = contextualize(request.access);
	request.context = ctx;
	context.run(ctx, () => {
		next();
	});
};
