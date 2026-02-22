import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class NotImplementedError extends HttpError {
	constructor(message = "Not implemented.") {
		super(message, HttpErrorCode.NotImplemented, 501);
	}
}
