import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../core/application-error";

export class TokenTamperedError extends ApplicationError {
	constructor(
		message: string,
		cause: unknown,
		metadata?: Record<string, unknown>,
	) {
		super(message, ApplicationErrorCode.TokenTampered, cause, metadata);
	}
}
