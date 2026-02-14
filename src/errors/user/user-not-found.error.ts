import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../application-error";

export class UserNotFoundError extends ApplicationError {
	constructor(message = "User not found") {
		super(message, ApplicationErrorCode.UserNotFound);
	}
}
