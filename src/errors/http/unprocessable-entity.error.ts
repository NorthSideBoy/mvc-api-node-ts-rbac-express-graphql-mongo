import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class UnprocessableEntityError extends HttpError {
	constructor(message = "Unprocessable entity.") {
		super(message, HttpErrorCode.UnprocessableEntity, 422);
	}
}
