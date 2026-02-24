import type { MiddlewareFn } from "type-graphql";
import type { Role } from "../../enums/role.enum";
import type { ExtendedRequest } from "../../types/extended-request.type";
import { authorize } from "../common/auth.common";

export function authGuard(
	securityName: string,
	allowed: Role[],
): MiddlewareFn<ExtendedRequest> {
	return async ({ context }, next) => {
		context.access = await authorize(
			context.headers.authorization,
			securityName,
			allowed,
		);
		return await next();
	};
}
