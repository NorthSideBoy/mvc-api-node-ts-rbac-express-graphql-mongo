import type { input } from "zod";
import type { createFileCodec } from "../../../validation/codecs/file/input/create-file.codec";

export type CreateFile = input<typeof createFileCodec>;
