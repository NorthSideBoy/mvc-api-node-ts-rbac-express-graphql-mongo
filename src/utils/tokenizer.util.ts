import {
	JsonWebTokenError as JwtJsonWebTokenError,
	NotBeforeError as JwtNotBeforeError,
	TokenExpiredError as JwtTokenExpiredError,
	type SignOptions,
	sign,
	verify,
} from "jsonwebtoken";
import { config } from "../configs/env.config";
import { TokenBeforeError as AppTokenBeforeError } from "../errors/application/token-before.error";
import { TokenExpiredError as AppTokenExpiredError } from "../errors/application/token-expired.error";
import { TokenTamperedError as AppTokenTamperedError } from "../errors/application/token-tampered.error";
import type { Token } from "../types/token.type";

class Tokenizer {
	sign(payload: Token.Sign, options: SignOptions = {}): string {
		const { expiresIn = config.jwt.expiresIn, ...rest } = options;
		return sign(payload, config.jwt.secret, {
			...(rest as SignOptions),
			expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]>,
		});
	}

	verify(token: string): Token.Payload {
		try {
			return verify(token, config.jwt.secret) as Token.Payload;
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
