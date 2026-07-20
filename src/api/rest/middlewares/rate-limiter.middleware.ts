import rateLimit from "express-rate-limit";
import { config } from "../../../configs/env.config";
import TooManyRequestsError from "../../../errors/http/too-many-requests.error";

export const generalLimiter = rateLimit({
	windowMs: config.rateLimit.windowMs * 60 * 1000,
	max: config.rateLimit.max,
	standardHeaders: true,
	legacyHeaders: false,
	handler: () => {
		throw new TooManyRequestsError();
	},
});

export const authLimiter = rateLimit({
	windowMs: config.rateLimit.windowMs * 60 * 1000,
	max: 5,
	skipSuccessfulRequests: true,
	handler: () => {
		throw new TooManyRequestsError();
	},
});
