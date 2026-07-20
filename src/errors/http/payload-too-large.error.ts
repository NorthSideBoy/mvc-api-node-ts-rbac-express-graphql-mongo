import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class PayloadTooLargeError extends HttpError {
	constructor(message = "Request payload is too large.", cause?: unknown) {
		super(message, HttpErrorCode.PayloadTooLarge, 413, cause);
	}
}
