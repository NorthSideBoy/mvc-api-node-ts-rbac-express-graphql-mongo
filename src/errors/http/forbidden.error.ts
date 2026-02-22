import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class ForbiddenError extends HttpError {
	constructor(message = "Forbidden.") {
		super(message, HttpErrorCode.Forbbidden, 403);
	}
}
