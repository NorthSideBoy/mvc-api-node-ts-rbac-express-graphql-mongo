import { GraphQLError } from "graphql";
import { ZodError } from "zod";
import { ApplicationError } from "../errors/core/application-error";
import CoreError from "../errors/core/core.error";
import HttpError from "../errors/core/http.error";

export function isError(error: unknown): error is Error {
	return error instanceof Error;
}

export function isCoreError(error: unknown): error is CoreError {
	return error instanceof CoreError;
}

export function isApplicationError(error: unknown): error is ApplicationError {
	return error instanceof ApplicationError;
}

export function isHttpError(error: unknown): error is HttpError {
	return error instanceof HttpError;
}

export function isZodError(error: unknown): error is ZodError {
	return error instanceof ZodError;
}

export function isGraphQLError(error: unknown): error is GraphQLError {
	return error instanceof GraphQLError;
}

export function isSyntaxError(error: unknown): error is SyntaxError {
	return error instanceof SyntaxError;
}
