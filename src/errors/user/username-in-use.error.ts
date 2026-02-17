import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../application-error";

export class UsernameInUseError extends ApplicationError {
	constructor(username: string) {
		super(
			`The username '${username}' is already in use.`,
			ApplicationErrorCode.UsernameInUse,
		);
	}
}
