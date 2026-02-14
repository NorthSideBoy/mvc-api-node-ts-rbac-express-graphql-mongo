import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class UnprocessableEntityError extends HttpError {
	constructor(message = "Unprocessable Entity") {
		super(message, 422, HttpErrorCode.UnprocessableEntity);
	}
}
