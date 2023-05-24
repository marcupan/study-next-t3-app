import { z } from "zod";

import { POST_MAX_LEnGTH, POST_MIN_LEnGTH } from "~/constants";

export const postSchema = z.object({
  input: z
    .string({
      required_error: "Tweet text is required",
    })
    .min(POST_MIN_LEnGTH, "Text too small")
    .max(POST_MAX_LEnGTH, "Text too large"),
});
