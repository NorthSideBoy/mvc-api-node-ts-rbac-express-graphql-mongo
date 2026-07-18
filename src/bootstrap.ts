import { config } from "./configs/env.config";
import { database } from "./configs/mongoose.config";
import { listeners } from "./listeners";
import { logger } from "./utils/logger.util";

export const bootstrap = async () => {
	logger.info(
		{ mode: config.server.nodeEnv, log_level: config.server.logLevel },
		"[APP] starting",
	);
	await database.connect();
	listeners.initialize();
};

export const shutdown = async () => {
	listeners.shutdown();
	await database.disconnect();
	logger.info("[APP] stopped");
};
