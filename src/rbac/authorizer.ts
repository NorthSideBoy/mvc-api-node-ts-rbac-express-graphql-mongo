import { PermissionDeniedError } from "../errors/application/permission-denied.error";
import type BaseActor from "../security/actor";
import type { AppAction, AppSubject } from "./types";

export class Authorizer {
	constructor(private readonly actor: BaseActor) {}

	can(action: AppAction, subject: AppSubject): boolean {
		return this.actor.ability.can(action, subject);
	}

	authorize(action: AppAction, subject: AppSubject, message?: string): void {
		if (!this.can(action, subject)) throw new PermissionDeniedError(message);
	}
}
