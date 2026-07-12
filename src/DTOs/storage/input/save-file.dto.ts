import type { input } from "zod";
import type { saveFileCodec } from "../../../validation/codecs/storage/input/save-file.codec";

export type SaveFile = input<typeof saveFileCodec>;
