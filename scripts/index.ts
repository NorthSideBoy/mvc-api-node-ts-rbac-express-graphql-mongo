import { setTimeout } from "node:timers/promises";
import { bootstrap, shutdown } from "../src/bootstrap";
import ExecutionContext from "../src/context/execution-context";
import { isError, isZodError } from "../src/guards/error.guard";
import { context } from "../src/utils/context.util";
import { logger } from "../src/utils/logger.util";
import type Script from "./base.script.ts";
import CreateUser from "./create-user.script";
import Test from "./test.script";

type ScriptFactory = () => Script;

const scripts: Record<string, ScriptFactory> = {
	test: () => new Test(),
	"create-user": () => new CreateUser(),
};

function find(name: string): Script | undefined {
	const factory = scripts[name];
	return factory ? factory() : undefined;
}

function list(): void {
	logger.info("Available scripts:");

	for (const [name, factory] of Object.entries(scripts)) {
		const temp = factory();
		logger.info(`- ${name}: ${temp.description}`);
	}
}

async function main(): Promise<void> {
	const name = process.argv[2];
	try {
		if (!name || name === "-h" || name === "--help") {
			list();
			process.exitCode = name ? 0 : 1;
			return;
		}

		const script = find(name);

		if (!script) {
			logger.error(`Script "${name}" not found`);
			list();
			process.exitCode = 1;
			return;
		}

		await bootstrap();
		logger.info(`[Script] running: ${name}`);

		const ctx = ExecutionContext.system();

		await new Promise<void>((resolve, reject) => {
			context.run(ctx, async () => {
				try {
					await setTimeout();
					await script.run();
					resolve();
				} catch (error) {
					reject(error);
				}
			});
		});

		logger.info(`[Script] ${name} success`);

		await shutdown();
		process.exit(0);
	} catch (error) {
		if (isZodError(error)) {
			error.message = error.issues
				.map((i) =>
					i.path.length > 0
						? `${i.path.join(".")}: ${i.message}`
						: `${i.message}`,
				)
				.join("; ");
		}
		logger.error(
			{ error },
			`[Script] ${name} ${isError(error) ? error.name : "UnexpectedError"}`,
		);
		process.exit(1);
	}
}

main();
