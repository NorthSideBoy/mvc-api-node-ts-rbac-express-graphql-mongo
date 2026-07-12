import type { output } from "zod";
import type { fileCodec } from "../../../validation/codecs/file/output/file.codec";

export type File = output<typeof fileCodec>;
