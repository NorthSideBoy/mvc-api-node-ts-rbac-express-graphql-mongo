import type { Role } from "./role";
import RoleGraph from "./role-graph";

export default class RolePolicy {
	private readonly graph: RoleGraph;

	private constructor(graph: RoleGraph) {
		this.graph = graph;
	}

	public static create(): RolePolicy {
		return new RolePolicy(RoleGraph.create());
	}

	public canAccess(
		received: ReadonlyArray<Role> | Role,
		allowed: ReadonlyArray<Role>,
	): boolean {
		if (allowed.length === 0) return false;

		const receivedRoles = Array.isArray(received) ? received : [received];

		return receivedRoles.some((role) =>
			allowed.some(
				(allowedRole) =>
					role === allowedRole || this.graph.includesRole(role, allowedRole),
			),
		);
	}

	public includes(role: Role, target: Role): boolean {
		return this.graph.includesRole(role, target);
	}

	public getIncluded(role: Role): Role[] {
		return this.graph.getAllIncludedRoles(role);
	}

	public getParents(role: Role): Role[] {
		return this.graph.getDirectParents(role);
	}

	public getChildren(role: Role): Role[] {
		return this.graph.getDirectChildren(role);
	}

	public getAll(): Role[] {
		return this.graph.getAllRoles();
	}

	public exists(role: Role): boolean {
		return this.graph.hasRole(role);
	}

	public depth(role: Role): number {
		return this.graph.getDepth(role);
	}

	public roots(): Role[] {
		return this.getAll().filter((role) => this.getParents(role).length === 0);
	}
}
