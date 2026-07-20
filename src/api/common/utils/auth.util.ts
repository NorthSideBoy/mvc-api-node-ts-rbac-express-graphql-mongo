import type { Role } from "../../../enums/role.enum";
import MethodNotAllowedError from "../../../errors/http/method-not-allowed.error";
import UnauthorizedError from "../../../errors/http/unauthorized.error";
import User from "../../../models/user.model";
import { AccessClaims } from "../../../security/access-claims";
import { AccessGrant } from "../../../security/access-grant";
import { UserActor } from "../../../security/actor";
import { tokenizer } from "../../../utils/tokenizer.util";
import type { AuthStrategy } from "../types/auth-strategy.type";

const authStrategies = new Map<string, AuthStrategy>([
	[
		"Bearer",
		async (authHeader, allowedRoles) => {
			const [scheme, token] = authHeader.trim().split(/\s+/);
			if (!token || scheme !== "Bearer")
				throw new UnauthorizedError("Invalid Bearer token format");

			const payload = tokenizer.verify(token);
			const claims = AccessClaims.fromPayload(payload);
			const user = await User.findById(claims.subject);
			if (!user)
				throw new UnauthorizedError("Authentication subject not found");
			const actor = UserActor.fromIdentity(user.identity, claims);
			const grant = AccessGrant.issue(claims, actor, allowedRoles);

			return grant;
		},
	],
]);

export async function authorize(
	authorization: string | undefined,
	securityName: string,
	allowedRoles: ReadonlyArray<Role>,
): Promise<AccessGrant> {
	const strategy = authStrategies.get(securityName);
	if (!strategy)
		throw new MethodNotAllowedError(
			`Authentication method '${securityName}' not allowed`,
		);
	if (!authorization)
		throw new UnauthorizedError("Missing authorization headers");

	return await strategy(authorization, allowedRoles);
}
