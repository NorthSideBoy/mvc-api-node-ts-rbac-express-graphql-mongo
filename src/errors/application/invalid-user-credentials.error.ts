import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../core/application-error";

export class InvalidUserCredentialsError extends ApplicationError {
	constructor(message = "Invalid credentials.") {
		super(message, ApplicationErrorCode.InvalidCredentials);
	}
}
