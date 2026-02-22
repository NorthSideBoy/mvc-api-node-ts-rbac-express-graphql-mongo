import type { Action } from "./action.type";
import type { Resource } from "./resource.type";

export type Operation = `${Resource}:${Action}`;
