import type { Operation } from "../types/operation.type";
import type { Scope } from "../types/scope.type";

export interface IPermission {
	operation: Operation;
	scope: Scope;
}
