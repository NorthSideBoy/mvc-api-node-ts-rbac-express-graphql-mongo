import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../application-error";

export class InvalidCredentialsError extends ApplicationError {
	constructor(message = "Invalid credentials") {
		super(message, ApplicationErrorCode.InvalidCredentials);
	}
}
