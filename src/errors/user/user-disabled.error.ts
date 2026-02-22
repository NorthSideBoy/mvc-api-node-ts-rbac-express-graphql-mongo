import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../core/application-error";

export class UserDisabledError extends ApplicationError {
	constructor(message = "User is disabled.") {
		super(message, ApplicationErrorCode.UserDisabled);
	}
}
