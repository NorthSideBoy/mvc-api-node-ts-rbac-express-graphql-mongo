import type { MiddlewareFn } from "type-graphql";
import type { ExtendedRequest } from "../../types/extended-request.type";
import { contextualize } from "../common/context.common";

export function contextMiddleware(): MiddlewareFn<ExtendedRequest> {
	return async ({ context }, next) => {
		const ctx = contextualize(context.access);
		context.context = ctx;
		return await next();
	};
}
