import { EVENTS } from "../events/constants/events.constants";
import { BaseListener } from "./base.listener";

export default class AuthListener extends BaseListener {
	setup(): number {
		this.listen(EVENTS.AUTH.ACCOUNT_REGISTERED, async (_event, _context) => {});

		this.listen(EVENTS.AUTH.ACCOUNT_LOGGED_IN, async (_event, _context) => {});

		return this.counter;
	}
}
