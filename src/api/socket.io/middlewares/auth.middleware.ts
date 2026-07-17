import type { Role } from "../../../enums/role.enum";
import { authorize } from "../../common/utils/auth.util";
import type { SocketEventMiddleware } from "../types/socket-event-middleware.type";

export function authMiddleware(
	allowedRoles: Role[],
	securityName = "Bearer",
): SocketEventMiddleware {
	return async (ctx, next) => {
		const authorization =
			securityName === "Bearer"
				? ctx.socket.handshake.auth.token
					? ctx.socket.handshake.auth.token
					: ctx.socket.handshake.headers.authorization
				: ctx.socket.handshake.headers.authorization;
		const access = await authorize(authorization, securityName, allowedRoles);
		ctx.access = access;
		ctx.socket.data.access = access;
		await next();
	};
}
