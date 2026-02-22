import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class TooManyRequestsError extends HttpError {
	constructor(message = "Too many requests.") {
		super(message, HttpErrorCode.ToManyRequest, 429);
	}
}
