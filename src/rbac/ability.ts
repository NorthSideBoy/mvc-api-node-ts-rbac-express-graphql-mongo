import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Kind } from "../enums/kind.enum";
import { AccessScope, Permission, Subject } from "./policy";
import { ANONYMOUS_RULES, SYSTEM_RULES } from "./role-definitions";
import { includedRoles, rulesForRole } from "./role-hierarchy";
import type { AbilityActor, AppAbility } from "./types";

export function defineAbilityFor(actor: AbilityActor): AppAbility {
	const { can, cannot, build } = new AbilityBuilder<AppAbility>(
		createMongoAbility,
	);
	const rules =
		actor.kind === Kind.SYSTEM
			? SYSTEM_RULES
			: actor.kind === Kind.ANONYMOUS
				? ANONYMOUS_RULES
				: actor.role
					? rulesForRole(actor.role)
					: [];

	for (const rule of rules) {
		const grant = rule.effect === "deny" ? cannot : can;
		const { permission } = rule;
		const ruleSubject = permission.subject;
		let conditions: Record<string, unknown> | undefined;

		if (rule.access) {
			if (ruleSubject !== Subject.User) {
				throw new Error(
					`RBAC access scope '${rule.access}' is not implemented for permission '${permission.action}'.`,
				);
			}

			if (rule.access === AccessScope.Own) {
				conditions = { id: actor.id };
			} else if (actor.role) {
				const roles = includedRoles(actor.role).filter(
					(role) => rule.access !== AccessScope.Managed || role !== actor.role,
				);

				conditions =
					permission.action === Permission.User.UpdateRole.action
						? { role: { $in: roles }, assignedRole: { $in: roles } }
						: { role: { $in: roles } };
			}
		}

		if (conditions) {
			grant(permission.action, ruleSubject, conditions);
			continue;
		}

		grant(permission.action, ruleSubject);
	}

	return build({
		anyAction: Permission.All.Wildcard.action,
		anySubjectType: Subject.All,
	});
}
