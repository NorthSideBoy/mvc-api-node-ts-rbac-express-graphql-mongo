import type { Request } from "express";

export function clientIp(request: Pick<Request, "headers" | "ip">): string {
	const forwarded = request.headers["x-forwarded-for"];
	const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
	const firstForwardedIp = forwardedIp?.split(",")[0]?.trim();

	return firstForwardedIp || request.ip || "unknown";
}
