import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.util";
import { env } from "./env.config";

export default class Database {
	private static instance: PrismaClient;

	private constructor() {}

	private static getInstance(): PrismaClient {
		if (!Database.instance) {
			Database.instance = new PrismaClient();
		}
		return Database.instance;
	}

	static async connect(): Promise<void> {
		const client = Database.getInstance();
		await client.$connect();
		await client.$runCommandRaw({ ping: 1 });
		logger.info(
			{ host: env.DB.HOST, port: env.DB.PORT, db: env.DB.NAME },
			"[Database] connected",
		);
	}

	static async disconnect(): Promise<void> {
		if (Database.instance) {
			await Database.instance.$disconnect();
			Database.instance = undefined as unknown as PrismaClient;
			logger.info("[Database] disconnected");
		}
	}

	public static get client(): PrismaClient {
		return Database.getInstance();
	}
}
