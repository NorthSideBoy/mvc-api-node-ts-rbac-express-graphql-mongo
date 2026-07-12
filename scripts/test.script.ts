import { logger } from "../src/utils/logger.util";
import BaseScript from "./base.script";

export default class Test extends BaseScript {
	readonly name = "test";
	readonly description = "Print hello world";

	async run(): Promise<void> {
		logger.info("Hello world");
	}
}
