import { EVENTS } from "../events/constants/events.constants";
import { BaseListener } from "./base.listener";

export default class UserListener extends BaseListener {
	setup(): number {
		this.listen(EVENTS.USER.READ, async (_event, _context) => {});

		return this.counter;
	}
}
