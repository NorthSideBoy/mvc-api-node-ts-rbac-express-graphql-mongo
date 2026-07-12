import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class TooManyRequestsError extends HttpError {
	constructor(message = "Too many attempts, please try again later.") {
		super(message, HttpErrorCode.TooManyRequest, 429);
	}
}
