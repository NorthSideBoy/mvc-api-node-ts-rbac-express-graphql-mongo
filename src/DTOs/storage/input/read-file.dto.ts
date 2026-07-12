import type { input } from "zod";
import type { readFileCodec } from "../../../validation/codecs/storage/input/read-file.codec";

export type ReadFile = input<typeof readFileCodec>;
