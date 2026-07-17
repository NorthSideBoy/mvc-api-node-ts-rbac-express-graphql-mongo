import { Role } from "../enums/role.enum";
import { Subject } from "./policy";
import { ROLE_DEFINITIONS } from "./role-definitions";
import type { AbilityRule, RoleDefinition } from "./types";

function assertPolicy(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(`Invalid RBAC policy: ${message}`);
}

function validateUniqueRoles(definitions: readonly RoleDefinition[]): void {
	const seen = new Set<Role>();

	for (const definition of definitions) {
		assertPolicy(
			!seen.has(definition.role),
			`Duplicate role ${definition.role}.`,
		);
		seen.add(definition.role);
	}

	for (const role of Object.values(Role)) {
		assertPolicy(seen.has(role), `Missing definition for role ${role}.`);
	}
}

function validateIncludes(
	definitions: readonly RoleDefinition[],
	definitionByRole: ReadonlyMap<Role, RoleDefinition>,
): void {
	for (const definition of definitions) {
		for (const included of definition.includes ?? []) {
			assertPolicy(
				definitionByRole.has(included),
				`${definition.role} includes unknown role ${included}.`,
			);
		}
	}
}

function validateCycles(
	definitionByRole: ReadonlyMap<Role, RoleDefinition>,
): void {
	const visited = new Set<Role>();
	const visiting = new Set<Role>();

	const visit = (role: Role, path: Role[]): void => {
		if (visiting.has(role)) {
			const cycle = [...path, role].join(" -> ");
			throw new Error(`Invalid RBAC policy: Role inheritance cycle ${cycle}.`);
		}
		if (visited.has(role)) return;

		visiting.add(role);
		const definition = definitionByRole.get(role);
		for (const included of definition?.includes ?? []) {
			visit(included, [...path, role]);
		}
		visiting.delete(role);
		visited.add(role);
	};

	for (const role of definitionByRole.keys()) visit(role, []);
}

function validateRule(rule: AbilityRule): void {
	assertPolicy(
		Object.values(Subject).includes(rule.permission.subject),
		`Permission ${rule.permission.action} uses unknown subject ${rule.permission.subject}.`,
	);
	assertPolicy(
		rule.permission.subject === Subject.User || !rule.access,
		`${rule.permission.action} cannot use access scopes.`,
	);
}

function validateRoleDefinitions(
	definitions: readonly RoleDefinition[],
): Map<Role, RoleDefinition> {
	validateUniqueRoles(definitions);
	const definitionByRole = new Map<Role, RoleDefinition>(
		definitions.map((definition) => [definition.role, definition]),
	);
	validateIncludes(definitions, definitionByRole);
	validateCycles(definitionByRole);
	for (const definition of definitions) {
		for (const rule of definition.rules) validateRule(rule);
	}

	return definitionByRole;
}

const definitionByRole = validateRoleDefinitions(ROLE_DEFINITIONS);

export function includedRoles(role: Role): Role[] {
	const result = new Set<Role>([role]);
	const definition = definitionByRole.get(role);

	for (const included of definition?.includes ?? []) {
		result.add(included);
		for (const nested of includedRoles(included)) result.add(nested);
	}

	return Array.from(result);
}

export function rulesForRole(role: Role): AbilityRule[] {
	return includedRoles(role).flatMap(
		(included) => definitionByRole.get(included)?.rules ?? [],
	);
}
