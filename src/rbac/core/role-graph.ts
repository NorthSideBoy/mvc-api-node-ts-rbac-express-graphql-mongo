import { ROLE_DEFINITIONS } from "../constants/role-definitions.constant";
import type { IEdge } from "../contracts/edge.contract";
import { Role } from "../enums/role.enum";
import type { Permission } from "../types/permission.type";

export default class RoleGraph {
	private readonly graph: Map<Role, IEdge>;
	private readonly includedRoles: Map<Role, Set<Role>>;
	private readonly permissions: Map<Role, Set<Permission>>;
	private readonly depths: Map<Role, number>;

	private constructor(graph: Map<Role, IEdge>) {
		this.graph = graph;
		this.includedRoles = new Map();
		this.permissions = new Map();
		this.depths = new Map();
		this.computeTransitiveClosures();
	}

	static create(): RoleGraph {
		const graph = new Map<Role, IEdge>();

		ROLE_DEFINITIONS.forEach(({ name, includes = [], permissions = [] }) => {
			graph.set(name, {
				includes: new Set(includes),
				permissions: new Set(permissions),
			});
		});

		Object.values(Role).forEach((role) => {
			if (!graph.has(role)) {
				graph.set(role, { includes: new Set(), permissions: new Set() });
			}
		});

		return new RoleGraph(graph);
	}

	private computeTransitiveClosures(): void {
		const visited = new Map<Role, Set<Role>>();
		const dfs = (role: Role): Set<Role> => {
			const cached = visited.get(role);
			if (cached !== undefined) return cached;

			const result = new Set<Role>([role]);
			const edge = this.graph.get(role);
			if (edge) {
				for (const inc of edge.includes) {
					const sub = dfs(inc);
					sub.forEach((r) => {
						result.add(r);
					});
				}
			}
			visited.set(role, result);
			return result;
		};
		for (const role of this.graph.keys()) dfs(role);
		visited.forEach((v, k) => {
			this.includedRoles.set(k, v);
		});

		for (const [role, included] of this.includedRoles.entries()) {
			const perms = new Set<Permission>();
			for (const r of included) {
				const edge = this.graph.get(r);
				edge?.permissions.forEach((p) => {
					perms.add(p);
				});
			}
			this.permissions.set(role, perms);
		}

		const depthMemo = new Map<Role, number>();
		const computeDepth = (role: Role): number => {
			const cached = depthMemo.get(role);
			if (cached !== undefined) return cached;

			const parents = this.getDirectParents(role);
			if (parents.length === 0) return 0;
			const maxParent = Math.max(...parents.map((p) => computeDepth(p)));
			const depth = maxParent + 1;
			depthMemo.set(role, depth);
			return depth;
		};
		for (const role of this.graph.keys()) computeDepth(role);
		depthMemo.forEach((v, k) => {
			this.depths.set(k, v);
		});
	}

	includesRole(role: Role, target: Role): boolean {
		return this.includedRoles.get(role)?.has(target) ?? false;
	}

	getAllIncludedRoles(role: Role): Role[] {
		return Array.from(this.includedRoles.get(role) ?? []);
	}

	hasPermission(role: Role, permission: Permission): boolean {
		return this.permissions.get(role)?.has(permission) ?? false;
	}

	getAllPermissions(role: Role): Permission[] {
		return Array.from(this.permissions.get(role) ?? []);
	}

	getDepth(role: Role): number {
		return this.depths.get(role) ?? 0;
	}

	getAllRoles(): Role[] {
		return Array.from(this.graph.keys());
	}

	hasRole(role: Role): boolean {
		return this.graph.has(role);
	}

	getDirectChildren(role: Role): Role[] {
		return Array.from(this.graph.get(role)?.includes ?? []);
	}

	getDirectParents(role: Role): Role[] {
		return Array.from(this.graph.entries())
			.filter(([_, edge]) => edge.includes.has(role))
			.map(([parent]) => parent);
	}

	getParentRoles(role: Role): Role[] {
		return this.getAllRoles().filter(
			(r) => r !== role && this.includesRole(r, role),
		);
	}
}
