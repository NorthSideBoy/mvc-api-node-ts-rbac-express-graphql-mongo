import { RateLimiterMemory } from "rate-limiter-flexible";
import type { MiddlewareFn } from "type-graphql";
import { config } from "../../../configs/env.config";
import TooManyRequestsError from "../../../errors/http/too-many-requests.error";
import type { GraphQLContext } from "../types/graphql-context.type";

const rateLimiter = new RateLimiterMemory({
	points: 5,
	duration: config.rateLimit.windowMs * 60,
	blockDuration: config.rateLimit.windowMs * 60,
});

export function authLimiter(): MiddlewareFn<GraphQLContext> {
	return async ({ context }, next) => {
		const { req } = context;
		const clientIp = req.ip || "unknown";
		const current = await rateLimiter.get(clientIp);
		if (current && current.consumedPoints >= rateLimiter.points)
			throw new TooManyRequestsError();
		try {
			return await next();
		} catch (error) {
			await rateLimiter.consume(clientIp).catch(() => {
				throw new TooManyRequestsError();
			});
			throw error;
		}
	};
}
