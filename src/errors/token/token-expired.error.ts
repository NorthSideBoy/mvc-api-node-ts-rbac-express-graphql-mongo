import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import type { ApplicationErrorOptions } from "../application-error";
import { ApplicationError } from "../application-error";

export class TokenExpiredError extends ApplicationError {
	constructor(
		message = "Token expired",
		options: ApplicationErrorOptions = {},
	) {
		super(message, ApplicationErrorCode.TokenExpired, options);
	}
}
