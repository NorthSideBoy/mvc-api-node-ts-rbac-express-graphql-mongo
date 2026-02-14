export enum ApplicationErrorCode {
	UserNotFound = "USER_NOT_FOUND",
	UserAlreadyExists = "USER_ALREADY_EXISTS",
	InvalidCredentials = "INVALID_CREDENTIALS",
	TokenExpired = "TOKEN_EXPIRED",
	TokenTampered = "TOKEN_TAMPERED",
	TokenBefore = "TOKEN_BEFORE",
	InternalError = "INTERNAL_ERROR",
}
