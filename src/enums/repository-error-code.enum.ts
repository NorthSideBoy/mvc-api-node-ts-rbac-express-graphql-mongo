export enum RepositoryErrorCode {
	NotFound = "REPO_NOT_FOUND",
	UniqueConstraint = "REPO_UNIQUE_CONSTRAINT",
	ForeignKey = "REPO_FOREIGN_KEY",
	Unknown = "REPO_UNKNOWN",

	ConnectionFailed = "REPO_CONNECTION_FAILED",
	ConnectionTimeout = "REPO_CONNECTION_TIMEOUT",
	DatabaseNotFound = "REPO_DATABASE_NOT_FOUND",
	AuthenticationFailed = "REPO_AUTH_FAILED",

	ValueTooLong = "REPO_VALUE_TOO_LONG",
	NotNullViolation = "REPO_NOT_NULL",
	InvalidFieldType = "REPO_INVALID_FIELD_TYPE",
	InvalidValue = "REPO_INVALID_VALUE",
	MissingRequiredField = "REPO_MISSING_REQUIRED_FIELD",
	MissingArgument = "REPO_MISSING_ARGUMENT",
	ValueOutOfRange = "REPO_VALUE_OUT_OF_RANGE",

	RequiredRelationNotFound = "REPO_REQUIRED_RELATION_NOT_FOUND",
	RecordsNotConnected = "REPO_RECORDS_NOT_CONNECTED",
	ChildRecordsNotFound = "REPO_CHILD_RECORDS_NOT_FOUND",
	InconsistentData = "REPO_INCONSISTENT_DATA",

	TableNotFound = "REPO_TABLE_NOT_FOUND",
	ColumnNotFound = "REPO_COLUMN_NOT_FOUND",

	InvalidQuery = "REPO_INVALID_QUERY",
	QueryTimeout = "REPO_QUERY_TIMEOUT",
	RawQueryFailed = "REPO_RAW_QUERY_FAILED",

	TransactionFailed = "REPO_TRANSACTION_FAILED",

	MigrationFailed = "REPO_MIGRATION_FAILED",
	MigrationHistoryError = "REPO_MIGRATION_HISTORY_ERROR",

	ClientInitializationFailed = "REPO_CLIENT_INIT_FAILED",
	ClientVersionMismatch = "REPO_CLIENT_VERSION_MISMATCH",
}
