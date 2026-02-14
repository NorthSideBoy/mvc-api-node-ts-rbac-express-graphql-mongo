import { Role } from "./role";
import { ROLE_DEFINITIONS } from "./role-definitions";

type RoleEdge = {
	includes: Set<Role>;
};

export default class RoleGraph {
	private readonly graph: Map<Role, RoleEdge>;

	private constructor(graph: Map<Role, RoleEdge>) {
		this.graph = graph;
	}

	public static create(): RoleGraph {
		const graph = new Map<Role, RoleEdge>();

		for (const definition of ROLE_DEFINITIONS) {
			graph.set(definition.name, {
				includes: new Set(definition.includes ?? []),
			});
		}

		for (const role of Object.values(Role)) {
			if (!graph.has(role)) {
				graph.set(role, { includes: new Set() });
			}
		}

		return new RoleGraph(graph);
	}

	public getAllIncludedRoles(role: Role): Role[] {
		return this.resolveRoles(role);
	}

	public includesRole(role: Role, target: Role): boolean {
		const includedRoles = this.resolveRoles(role);
		return includedRoles.includes(target);
	}

	public getParentRoles(role: Role): Role[] {
		const parents: Role[] = [];

		for (const [potentialParent, edge] of this.graph.entries()) {
			if (
				potentialParent !== role &&
				this.includesRole(potentialParent, role)
			) {
				parents.push(potentialParent);
			}
		}

		return parents;
	}

	public getDirectParents(role: Role): Role[] {
		const directParents: Role[] = [];

		for (const [potentialParent, edge] of this.graph.entries()) {
			if (edge.includes.has(role)) {
				directParents.push(potentialParent);
			}
		}

		return directParents;
	}

	public getDirectChildren(role: Role): Role[] {
		const edge = this.graph.get(role);
		return edge ? Array.from(edge.includes) : [];
	}

	public getAllRoles(): Role[] {
		return Array.from(this.graph.keys());
	}

	public hasRole(role: Role): boolean {
		return this.graph.has(role);
	}

	private resolveRoles(role: Role): Role[] {
		const visited = new Set<Role>();
		const stack = [role];

		while (stack.length > 0) {
			const current = stack.pop();
			if (!current || visited.has(current)) continue;

			visited.add(current);
			const edge = this.graph.get(current);

			if (edge) {
				for (const included of edge.includes) {
					if (!visited.has(included)) {
						stack.push(included);
					}
				}
			}
		}

		return Array.from(visited);
	}

	public getDepth(role: Role): number {
		const parents = this.getParentRoles(role);
		if (parents.length === 0) return 0;

		let maxDepth = 0;
		for (const parent of parents) {
			maxDepth = Math.max(maxDepth, this.getDepth(parent) + 1);
		}

		return maxDepth;
	}
}
