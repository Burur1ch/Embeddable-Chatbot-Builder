import { OpenAI } from 'openai';
import { AI_CONFIG } from './config';

let clientInstance: OpenAI | null = null;
let chatClientInstance: OpenAI | null = null;
let geminiClientInstance: OpenAI | null = null;

function getClient(): OpenAI {
  if (clientInstance) {
    return clientInstance;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key');
  }

  clientInstance = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return clientInstance;
}

function getChatClient(): OpenAI {
  if (AI_CONFIG.PROVIDER === 'groq' || AI_CONFIG.PROVIDER === 'lyceum' || AI_CONFIG.PROVIDER === 'gemini') {
    if (chatClientInstance) return chatClientInstance;
    const apiKey =
      AI_CONFIG.PROVIDER === 'gemini'
        ? process.env.GEMINI_API_KEY
        : AI_CONFIG.PROVIDER === 'lyceum'
          ? process.env.LYCEUM_API_KEY
          : process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error(`Missing ${AI_CONFIG.PROVIDER === 'gemini' ? 'Gemini' : AI_CONFIG.PROVIDER === 'lyceum' ? 'Lyceum' : 'Groq'} API key`);
    chatClientInstance = new OpenAI({
      apiKey,
      baseURL:
        AI_CONFIG.PROVIDER === 'gemini'
          ? 'https://generativelanguage.googleapis.com/v1beta/openai/'
          : AI_CONFIG.PROVIDER === 'lyceum'
          ? 'https://api.lyceum.technology/openai/v1'
          : 'https://api.groq.com/openai/v1',
    });
    return chatClientInstance;
  }
  return getClient();
}

function getGeminiClient(): OpenAI {
  if (geminiClientInstance) return geminiClientInstance;
  if (!process.env.GEMINI_API_KEY) throw new Error('Missing Gemini API key');
  geminiClientInstance = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });
  return geminiClientInstance;
}

export function getAIErrorMessage(error: unknown): string {
  const candidate = error as {
    status?: number;
    code?: string | number;
    error?: { code?: string | number; message?: string };
    detail?: string;
    message?: string;
  };
  const code = candidate?.code || candidate?.error?.code;

  if (candidate?.status === 429 || code === 'insufficient_quota') {
    if (AI_CONFIG.PROVIDER === 'gemini') {
      return 'Gemini free-tier limit reached. Please wait and try again later.';
    }
    if (AI_CONFIG.PROVIDER === 'lyceum') {
      return 'Lyceum credit or rate limit reached. Check your Lyceum account and try again.';
    }
    if (AI_CONFIG.PROVIDER === 'groq') {
      return 'Groq free-tier limit reached. Please wait and try again later.';
    }
    return 'OpenAI quota is exhausted. Add billing/credits to your OpenAI project, then try again.';
  }

  if (candidate?.status === 402 || code === 'payment_required_error') {
    return `${AI_CONFIG.PROVIDER === 'lyceum' ? 'Lyceum' : 'AI provider'} credits are exhausted. Add credits, then try again.`;
  }

  if (candidate?.status === 401) {
    return `The ${AI_CONFIG.PROVIDER === 'gemini' ? 'Gemini' : AI_CONFIG.PROVIDER === 'lyceum' ? 'Lyceum' : AI_CONFIG.PROVIDER === 'groq' ? 'Groq' : 'OpenAI'} API key is invalid or expired.`;
  }

  if (candidate?.detail) {
    return candidate.detail;
  }

  if (candidate?.error?.message || candidate?.message) {
    return candidate.error?.message || candidate.message || 'The AI service returned an error.';
  }

  return 'The AI service is temporarily unavailable. Please try again.';
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = AI_CONFIG.PROVIDER === 'gemini' ? getGeminiClient() : getClient();
  const response = await client.embeddings.create({
    model: AI_CONFIG.PROVIDER === 'gemini' ? AI_CONFIG.GEMINI_EMBEDDINGS_MODEL : AI_CONFIG.EMBEDDINGS_MODEL,
    input: text,
    ...(AI_CONFIG.PROVIDER === 'gemini' ? { dimensions: 1536 } : {}),
  });

  return response.data[0].embedding;
}

export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  temperature: number = AI_CONFIG.TEMPERATURE
): Promise<string> {
  const client = getChatClient();
  const response = await client.chat.completions.create({
    model:
      AI_CONFIG.PROVIDER === 'gemini'
        ? AI_CONFIG.GEMINI_CHAT_MODEL
        : AI_CONFIG.PROVIDER === 'lyceum'
        ? AI_CONFIG.LYCEUM_CHAT_MODEL
        : AI_CONFIG.PROVIDER === 'groq'
          ? AI_CONFIG.GROQ_CHAT_MODEL
          : AI_CONFIG.CHAT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature,
    max_tokens: AI_CONFIG.MAX_TOKENS,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error(`No response from ${AI_CONFIG.PROVIDER}`);

  return content;
}

export async function* streamChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  temperature: number = AI_CONFIG.TEMPERATURE
) {
  const client = getChatClient();
  const stream = await client.chat.completions.create({
    model:
      AI_CONFIG.PROVIDER === 'gemini'
        ? AI_CONFIG.GEMINI_CHAT_MODEL
        : AI_CONFIG.PROVIDER === 'lyceum'
        ? AI_CONFIG.LYCEUM_CHAT_MODEL
        : AI_CONFIG.PROVIDER === 'groq'
          ? AI_CONFIG.GROQ_CHAT_MODEL
          : AI_CONFIG.CHAT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature,
    max_tokens: AI_CONFIG.MAX_TOKENS,
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      yield chunk.choices[0].delta.content;
    }
  }
}
