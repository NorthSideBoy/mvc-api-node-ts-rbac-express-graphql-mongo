import { subject } from "@casl/ability";
import type {
	AppPermission,
	AppSubject,
	SubjectPermissionMap,
	UserAuthorizationTarget,
	UserSubject,
} from "./types";

export const Subject = {
	All: "All",
	CronJob: "CronJob",
	User: "User",
} as const;

function definePermissions<
	const TActions extends Record<string, string>,
	const TSubject extends (typeof Subject)[keyof typeof Subject],
>(
	subjectName: TSubject,
	actions: TActions,
): SubjectPermissionMap<TActions, TSubject> {
	return Object.fromEntries(
		Object.entries(actions).map(([key, action]) => [
			key,
			{ action, subject: subjectName },
		]),
	) as SubjectPermissionMap<TActions, TSubject>;
}

export const Permission = {
	[Subject.All]: definePermissions(Subject.All, {
		Wildcard: "*",
	}),
	[Subject.CronJob]: definePermissions(Subject.CronJob, {
		Read: "cron-job.read",
		Configure: "cron-job.configure",
	}),
	[Subject.User]: definePermissions(Subject.User, {
		Create: "user.create",
		Read: "user.read",
		Delete: "user.delete",
		UpdateEmail: "user.update-email",
		UpdatePassword: "user.update-password",
		UpdateProfile: "user.update-profile",
		UpdateUsername: "user.update-username",
		UpdateRole: "user.update-role",
		UpdateStatus: "user.update-status",
		UpdatePicture: "user.update-picture",
		DeletePicture: "user.delete-picture",
	}),
} as const;

export const AccessScope = {
	Own: "own",
	Managed: "managed",
	Included: "included",
} as const;

export const RuleEffect = {
	Allow: "allow",
	Deny: "deny",
} as const;

export function userSubject(target?: UserAuthorizationTarget): AppSubject {
	if (!target) return Subject.User;

	return subject(Subject.User, {
		id: target.id,
		role: target.role,
		assignedRole: target.assignedRole,
	}) as UserSubject;
}

export function subjectForPermission(
	permission: AppPermission,
	target?: UserAuthorizationTarget,
): AppSubject {
	if (!target) return permission.subject;

	if (permission.subject === Subject.User) return userSubject(target);

	throw new Error(
		`RBAC authorization subject is not implemented for permission '${permission.action}'.`,
	);
}
