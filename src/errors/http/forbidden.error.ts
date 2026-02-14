import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class ForbiddenError extends HttpError {
	constructor(message = "Forbidden") {
		super(message, 403, HttpErrorCode.Forbbidden);
	}
}
