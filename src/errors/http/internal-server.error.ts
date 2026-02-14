import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class InternalServerError extends HttpError {
	constructor(message = "Internal Server Error") {
		super(message, 500, HttpErrorCode.InternalError);
	}
}
