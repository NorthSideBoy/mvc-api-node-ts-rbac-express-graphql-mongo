import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class MethodNotAllowedError extends HttpError {
	constructor(message = "Method Not Allowed") {
		super(message, 405, HttpErrorCode.MethodNotAllowed);
	}
}
