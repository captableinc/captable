import { z } from "zod";

const apiKeyMutation = z.object({
  keyId: z.string(),
});

export type TApiKeyMutationSchema = z.infer<typeof apiKeyMutation>;
