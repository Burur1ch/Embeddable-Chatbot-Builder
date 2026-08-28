// AI Configuration
export const AI_CONFIG = {
  PROVIDER: (process.env.AI_PROVIDER || "openai") as
    | "openai"
    | "gemini"
    | "groq"
    | "lyceum",
  EMBEDDINGS_MODEL: "text-embedding-3-small",
  CHAT_MODEL: "gpt-4o-mini",
  GROQ_CHAT_MODEL: process.env.GROQ_CHAT_MODEL || "llama-3.1-8b-instant",
  LYCEUM_CHAT_MODEL: process.env.LYCEUM_CHAT_MODEL || "z-ai/glm-5.2-instant",
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || "gemini-3.6-flash",
  GEMINI_EMBEDDINGS_MODEL:
    process.env.GEMINI_EMBEDDINGS_MODEL || "gemini-embedding-2",
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
} as const;
