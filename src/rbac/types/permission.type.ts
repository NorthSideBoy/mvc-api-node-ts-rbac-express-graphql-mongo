import type { Action } from "./action.type";
import type { Operation } from "./operation.type";
import type { Resource } from "./resource.type";
import type { Scope } from "./scope.type";

export type Permission = `${Resource}:${Action}:${Scope}` | Operation | "*:*";
