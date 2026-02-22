import {
	JsonWebTokenError as JwtJsonWebTokenError,
	NotBeforeError as JwtNotBeforeError,
	TokenExpiredError as JwtTokenExpiredError,
	type SignOptions,
	sign,
	verify,
} from "jsonwebtoken";
import { env } from "../configs/env.config";
import { TokenBeforeError as AppTokenBeforeError } from "../errors/token/token-before.error";
import { TokenExpiredError as AppTokenExpiredError } from "../errors/token/token-expired.error";
import { TokenTamperedError as AppTokenTamperedError } from "../errors/token/token-tampered.error";
import type { Token } from "../types/token.type";

class Tokenizer {
	sign(payload: Token.Sign, options: SignOptions = {}): string {
		const { expiresIn = env.JWT.EXPIRES_IN, ...rest } = options;
		return sign(payload, env.JWT.SECRET, {
			...(rest as SignOptions),
			expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]>,
		});
	}

	verify(token: string): Token.Payload {
		try {
			return verify(token, env.JWT.SECRET) as Token.Payload;
		} catch (error) {
			if (error instanceof JwtTokenExpiredError) {
				throw new AppTokenExpiredError("Token expired", error, {
					expiredAt: error.expiredAt,
				});
			}

			if (error instanceof JwtNotBeforeError) {
				throw new AppTokenBeforeError("Token not active yet", error, {
					date: error.date,
				});
			}

			if (error instanceof JwtJsonWebTokenError) {
				throw new AppTokenTamperedError("Token is invalid", error, {
					message: error.message,
				});
			}

			throw error;
		}
	}
}

export const tokenizer = new Tokenizer();
