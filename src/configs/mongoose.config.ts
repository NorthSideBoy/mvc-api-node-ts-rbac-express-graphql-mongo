import mongoose from "mongoose";
import { logger } from "../utils/logger.util";
import { config } from "./env.config";

export const database = {
	async connect() {
		try {
			await mongoose.connect(config.database.connection.uri);

			logger.info(
				{ URI: config.database.connection.maskedUri },
				"[MongoDB] connected",
			);
		} catch (error) {
			logger.error("[MongoDB] connection error");
			throw error;
		}
	},

	async disconnect() {
		await mongoose.disconnect();
		logger.info("[MongoDB] disconnected");
	},
};
