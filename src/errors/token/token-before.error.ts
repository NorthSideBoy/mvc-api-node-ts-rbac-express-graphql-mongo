import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import type { ApplicationErrorOptions } from "../application-error";
import { ApplicationError } from "../application-error";

export class TokenBeforeError extends ApplicationError {
	constructor(
		message = "Token not active yet",
		options: ApplicationErrorOptions = {},
	) {
		super(message, ApplicationErrorCode.TokenBefore, options);
	}
}
