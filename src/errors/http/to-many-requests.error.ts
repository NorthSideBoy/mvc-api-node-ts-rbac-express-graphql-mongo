import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class TooManyRequestsError extends HttpError {
	constructor(message = "Too Many Requests") {
		super(message, 429, HttpErrorCode.ToManyRequest);
	}
}
