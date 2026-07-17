import type { ForcedSubject, MongoAbility } from "@casl/ability";
import type { Kind } from "../enums/kind.enum";
import type { Role } from "../enums/role.enum";
import type { AccessScope, Permission, RuleEffect, Subject } from "./policy";

type ValueOf<T> = T[keyof T];
type PermissionDescriptor = {
	action: string;
	subject: AppSubjectName;
};
type DeepPermissionValue<T> = T extends PermissionDescriptor
	? T
	: T extends Record<string, unknown>
		? DeepPermissionValue<ValueOf<T>>
		: never;

export type AppSubjectName = ValueOf<typeof Subject>;
export type AppPermission = DeepPermissionValue<typeof Permission>;
export type AppAction = AppPermission["action"];
export type RuleAccess = ValueOf<typeof AccessScope>;
export type RuleEffectValue = ValueOf<typeof RuleEffect>;

export type SubjectPermissionMap<
	TActions extends Record<string, string>,
	TSubject extends AppSubjectName,
> = {
	readonly [TKey in keyof TActions]: {
		readonly action: TActions[TKey];
		readonly subject: TSubject;
	};
};

export type AbilityRule = {
	permission: AppPermission;
	access?: RuleAccess;
	effect?: RuleEffectValue;
};

export type RoleDefinition = {
	role: Role;
	includes?: readonly Role[];
	rules: readonly AbilityRule[];
};

export type UserAuthorizationTarget = {
	id?: string;
	role: Role;
	assignedRole?: Role;
};

export type UserSubject = ForcedSubject<typeof Subject.User> &
	UserAuthorizationTarget;
export type AppSubject = AppSubjectName | UserSubject;
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

export type AbilityActor = {
	id: string;
	kind: Kind;
	role: Role | null;
};
