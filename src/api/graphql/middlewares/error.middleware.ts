import type { GraphQLFormattedError } from "graphql";
import { HttpErrorCode } from "../../../enums/http-error-code.enum";
import {
	isCoreError,
	isGraphQLError,
	isZodError,
} from "../../../guards/error.guard";
import { isString } from "../../../guards/string.guard";
import { logger } from "../../../utils/logger.util";

const SAFE_GRAPHQL_ERROR_CODES = new Set([
	"BAD_USER_INPUT",
	"GRAPHQL_PARSE_FAILED",
	"GRAPHQL_VALIDATION_FAILED",
]);

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

		if (isCoreError(error.originalError)) {
			return {
				message: error.originalError.message,
				code: error.originalError.code,
				metadata: error.originalError.metadata,
			};
		}

		const code = error.extensions?.code;
		if (isString(code) && SAFE_GRAPHQL_ERROR_CODES.has(code)) {
			return { message: error.message, code };
		}
	}

	return {
		message: "Internal server error",
		code: HttpErrorCode.InternalError,
	};
};
