import type { Request } from "express";
import type { Token } from "./token.type";

export type ExtendedRequest = Request & { access: Token.Payload };
