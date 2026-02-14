import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import type { ApplicationErrorOptions } from "../application-error";
import { ApplicationError } from "../application-error";

export class TokenTamperedError extends ApplicationError {
	constructor(
		message = "Token is invalid",
		options: ApplicationErrorOptions = {},
	) {
		super(message, ApplicationErrorCode.TokenTampered, options);
	}
}
