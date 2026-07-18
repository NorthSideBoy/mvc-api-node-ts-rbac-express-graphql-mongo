import type { GraphQLFormattedError } from "graphql";
import { HttpErrorCode } from "../../../enums/http-error-code.enum";
import {
	isCoreError,
	isGraphQLError,
	isZodError,
} from "../../../guards/error.guard";
import { logger } from "../../../utils/logger.util";

export const formatGraphQLError = (
	_formatted: GraphQLFormattedError,
	error: unknown,
) => {
	logger.error({ error }, "[GraphQL] error");

	if (isGraphQLError(error)) {
		if (isZodError(error.originalError)) {
			return {
				message: error.originalError.issues
					.map((issue) =>
						issue.path.length > 0
							? `${issue.path.join(".")}: ${issue.message}`
							: issue.message,
					)
					.join("; "),
				code: HttpErrorCode.UnprocessableEntity,
				metadata: error.originalError.issues,
			};
		}

		return {
			message: error.message,
			code: isCoreError(error.originalError)
				? error.originalError.code
				: error?.extensions?.code || "GRAPHQL_ERROR",
			metadata: isCoreError(error.originalError)
				? error.originalError.metadata
				: error.extensions?.metadata,
		};
	}

	return {
		message: "Internal server error",
		code: HttpErrorCode.InternalError,
	};
};
