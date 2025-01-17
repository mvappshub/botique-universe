export interface Bot {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  color: string;
  model: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatHistory {
  botId: string;
  messages: Message[];
}

export type ModelType = 'openai' | 'anthropic' | 'groq';

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  groq?: string;
}

export const MODEL_OPTIONS = [
  { value: 'openai', label: 'OpenAI', keyName: 'openai' },
  { value: 'anthropic', label: 'Anthropic', keyName: 'anthropic' },
  { value: 'groq', label: 'GROQ', keyName: 'groq' },
] as const;