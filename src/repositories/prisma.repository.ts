import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import Database from "../configs/prisma.config";
import { RepositoryErrorCode } from "../enums/repository-error-code.enum";
import { RepositoryError } from "../errors/repository-error";

type PrismaModel<T extends keyof PrismaClient = keyof PrismaClient> =
	PrismaClient[T];

const ERROR_MESSAGE_FILTERS = {
	stackTracePatterns: [/^at /, /^\d+\s/, /in \//],
	messagePatterns: ["invocation in", "Invalid `", "→"],
} as const;

function cleanPrismaErrorMessage(message: string): string {
	const lines = message.split("\n").map((line) => line.trim());
	for (let i = lines.length - 1; i >= 0; i--) {
		const line = lines[i];
		if (!line) continue;
		if (
			ERROR_MESSAGE_FILTERS.stackTracePatterns.some((pattern) =>
				pattern.test(line),
			)
		)
			continue;
		if (
			ERROR_MESSAGE_FILTERS.messagePatterns.some((pattern) =>
				line.includes(pattern),
			)
		)
			continue;
		return line;
	}
	return message;
}

const PRISMA_ERROR_MAP: Record<string, RepositoryErrorCode> = {
	P1000: RepositoryErrorCode.AuthenticationFailed,
	P1001: RepositoryErrorCode.ConnectionFailed,
	P1002: RepositoryErrorCode.ConnectionTimeout,
	P1003: RepositoryErrorCode.DatabaseNotFound,
	P1008: RepositoryErrorCode.ConnectionTimeout,

	P2000: RepositoryErrorCode.ValueTooLong,
	P2001: RepositoryErrorCode.NotFound,
	P2002: RepositoryErrorCode.UniqueConstraint,
	P2003: RepositoryErrorCode.ForeignKey,
	P2004: RepositoryErrorCode.InconsistentData,
	P2005: RepositoryErrorCode.InvalidFieldType,
	P2006: RepositoryErrorCode.InvalidValue,
	P2007: RepositoryErrorCode.InvalidValue,
	P2008: RepositoryErrorCode.InvalidQuery,
	P2009: RepositoryErrorCode.InvalidQuery,
	P2010: RepositoryErrorCode.RawQueryFailed,
	P2011: RepositoryErrorCode.NotNullViolation,
	P2012: RepositoryErrorCode.MissingRequiredField,
	P2013: RepositoryErrorCode.MissingArgument,
	P2014: RepositoryErrorCode.RequiredRelationNotFound,
	P2015: RepositoryErrorCode.NotFound,
	P2016: RepositoryErrorCode.InvalidQuery,
	P2017: RepositoryErrorCode.RecordsNotConnected,
	P2018: RepositoryErrorCode.ChildRecordsNotFound,
	P2019: RepositoryErrorCode.InvalidValue,
	P2020: RepositoryErrorCode.ValueOutOfRange,
	P2021: RepositoryErrorCode.TableNotFound,
	P2022: RepositoryErrorCode.ColumnNotFound,
	P2023: RepositoryErrorCode.InconsistentData,
	P2024: RepositoryErrorCode.QueryTimeout,
	P2025: RepositoryErrorCode.NotFound,

	P3000: RepositoryErrorCode.MigrationFailed,
	P3001: RepositoryErrorCode.MigrationFailed,
	P3002: RepositoryErrorCode.MigrationFailed,
	P3003: RepositoryErrorCode.MigrationFailed,
	P3004: RepositoryErrorCode.MigrationFailed,
	P3005: RepositoryErrorCode.MigrationFailed,
	P3006: RepositoryErrorCode.MigrationFailed,

	P7000: RepositoryErrorCode.ClientInitializationFailed,
	P7001: RepositoryErrorCode.ClientInitializationFailed,
	P7002: RepositoryErrorCode.ClientVersionMismatch,
	P7003: RepositoryErrorCode.ClientInitializationFailed,
	P7004: RepositoryErrorCode.ClientInitializationFailed,
	P7005: RepositoryErrorCode.TransactionFailed,

	P8000: RepositoryErrorCode.MigrationHistoryError,
	P8001: RepositoryErrorCode.MigrationHistoryError,
	P8002: RepositoryErrorCode.MigrationHistoryError,
	P8003: RepositoryErrorCode.MigrationFailed,
	P8004: RepositoryErrorCode.MigrationFailed,
} as const;

export abstract class PrismaRepository<
	TModel extends keyof PrismaClient = keyof PrismaClient,
> {
	protected readonly client = Database.client;
	protected abstract readonly model: PrismaModel<TModel>;
	protected readonly reason: Readonly<Record<string, RepositoryErrorCode>> =
		PRISMA_ERROR_MAP;

	protected handlePrismaError(error: unknown): never {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const reason = this.reason[error.code];
			const message = cleanPrismaErrorMessage(error.message);
			if (reason) throw new RepositoryError(message, reason);
			throw new RepositoryError(message, RepositoryErrorCode.Unknown, {
				cause: error,
			});
		}
		const message = error instanceof Error ? error.message : "Repository error";
		throw new RepositoryError(message, RepositoryErrorCode.Unknown, {
			cause: error,
		});
	}
	protected async execute<T>(operation: () => Promise<T>): Promise<T> {
		try {
			return await operation();
		} catch (error) {
			this.handlePrismaError(error);
		}
	}
}
