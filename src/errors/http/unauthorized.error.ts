import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class UnauthorizedError extends HttpError {
	constructor(message = "Unauthorized") {
		super(message, 401, HttpErrorCode.Unauthorized);
	}
}
