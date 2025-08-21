import { z } from "zod";

export const MessageScheme = z.object({
  fileId: z.string(),
  message: z.string(),
});
