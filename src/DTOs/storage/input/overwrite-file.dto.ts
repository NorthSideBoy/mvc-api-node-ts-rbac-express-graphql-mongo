import type { input } from "zod";
import type { overwriteFileCodec } from "../../../validation/codecs/storage/input/overwrite-file.codec";

export type OverwriteFile = input<typeof overwriteFileCodec>;
