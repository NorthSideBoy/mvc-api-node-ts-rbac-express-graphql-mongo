import type ExecutionContext from "../src/context/execution-context";
import { context } from "../src/utils/context.util";
import { logger } from "../src/utils/logger.util";
import BaseScript from "./base.script";

export default class Test extends BaseScript {
	readonly name = "test";
	readonly description = "Print hello world";

	get ctx(): ExecutionContext {
		return context.get();
	}

	async run(): Promise<void> {
		logger.info("Hello world");
	}
}
