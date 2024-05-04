import { TriggerClient } from "@trigger.dev/sdk";
import { env } from "./env";

const apiKey = env.TRIGGER_API_KEY;
const apiUrl = env.TRIGGER_API_URL;
const id = env.TRIGGER_API_ID;

const getClient = () =>
  new TriggerClient({
    id,
    apiKey,
    apiUrl,
  });

export const client = getClient();

export function getTriggerClient(): TriggerClient | null {
  if (!apiKey || !apiUrl || !id) {
    return null;
  }

  const client = getClient();

  return client;
}
