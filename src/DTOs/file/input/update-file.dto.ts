import type { input } from "zod";
import type { updateFileCodec } from "../../../validation/codecs/file/input/update-file.codec";

export type UpdateFile = input<typeof updateFileCodec>;
