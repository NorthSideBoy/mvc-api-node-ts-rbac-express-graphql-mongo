import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../core/application-error";

export class EmailInUseError extends ApplicationError {
	constructor(email: string) {
		super(
			`The email address '${email}' is already in use.`,
			ApplicationErrorCode.EmailInUse,
		);
	}
}
