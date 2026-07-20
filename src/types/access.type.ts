import type { Token } from "./token.type";
export namespace Access {
	export interface Claims {
		subject: string;
		issuedAt: number;
		expiresAt: number;
		raw: Token.Payload;
	}

	export type Grant = Claims;
}
