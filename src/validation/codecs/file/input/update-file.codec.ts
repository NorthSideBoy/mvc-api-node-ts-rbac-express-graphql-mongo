import { partialUpdateCodec } from "../../common/helpers.codec";
import { createFileCodec } from "./create-file.codec";

export const updateFileCodec = partialUpdateCodec(createFileCodec.shape);
