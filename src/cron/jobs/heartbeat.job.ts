import { logger } from "../../utils/logger.util";
import BaseJob from "./base.job";

export default class HeartbeatJob extends BaseJob {
	protected async execute() {
		logger.info("lup-dup");
	}
}
