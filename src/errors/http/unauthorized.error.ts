import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class UnauthorizedError extends HttpError {
	constructor(message = "Unauthorized.") {
		super(message, HttpErrorCode.Unauthorized, 401);
	}
}
