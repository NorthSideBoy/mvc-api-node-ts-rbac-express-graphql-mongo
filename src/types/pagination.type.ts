import type { z } from "zod";
import type { paginationCodec } from "../validation/codecs/common/pagination.codec";

export type Pagination = z.infer<typeof paginationCodec>;
