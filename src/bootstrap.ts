import { config } from "./configs/env.config";
import { Database } from "./configs/mongoose.config";
import { logger } from "./utils/logger.util";

export const bootstrap = async (): Promise<void> => {
	logger.info(
		{ mode: config.server.nodeEnv, log_level: config.server.logLevel },
		"[APP] starting",
	);
	await Database.connect();
};

export const shutdown = async (): Promise<void> => {
	await Database.disconnect();
	logger.info("[APP] stopped");
};
