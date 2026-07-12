import type { input } from "zod";
import type { queryUsersCodec } from "../../../validation/codecs/user/input/query-users.codec";

export type QueryUsers = input<typeof queryUsersCodec>;
