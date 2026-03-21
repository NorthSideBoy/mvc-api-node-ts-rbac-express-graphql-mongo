import type ExecutionContext from "../src/context/execution-context";
import { context } from "../src/utils/context.util";

export default abstract class BaseScript {
	abstract readonly name: string;
	abstract readonly description: string;
	public abstract run(): Promise<void>;
	protected get ctx(): ExecutionContext {
		return context.get();
	}
}
