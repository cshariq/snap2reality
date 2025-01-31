import { logger } from "gadget-server";
import type { Server } from "gadget-server";

function isValidGroqApiKey(key: string | undefined): boolean {
  if (!key) return false;
  return key.startsWith("gsk_") && key.length > 4;
}

export default async function plugin(server: Server) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    logger.warn(
      "GROQ_API_KEY environment variable is not set. The generate action will not work correctly."
    );
    return;
  }

  if (!isValidGroqApiKey(apiKey)) {
    logger.warn(
      "GROQ_API_KEY environment variable is invalid. It should start with 'gsk_'. The generate action will not work correctly."
    );
    return;
  }
}