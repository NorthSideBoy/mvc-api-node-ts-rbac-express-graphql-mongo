import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class NotImplementedError extends HttpError {
	constructor(message = "Not Implemented") {
		super(message, 501, HttpErrorCode.NotImplemented);
	}
}
