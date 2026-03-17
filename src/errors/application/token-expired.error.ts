import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../core/application-error";

export class TokenExpiredError extends ApplicationError {
	constructor(
		message: string,
		cause: unknown,
		metadata?: Record<string, unknown>,
	) {
		super(message, ApplicationErrorCode.TokenExpired, cause, metadata);
	}
}
