export interface Bot {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  color: string;
  model: string;
  provider?: string;
  baseUrl?: string;
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

export interface Provider {
  id: string;
  name: string;
  models: string[];
  requiresApiKey: boolean;
  supportsCustomUrl: boolean;
  baseUrl?: string;
}

export interface ApiKeys {
  [key: string]: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-3.5-turbo'],
    requiresApiKey: true,
    supportsCustomUrl: false
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-3-opus', 'claude-3-sonnet'],
    requiresApiKey: true,
    supportsCustomUrl: false
  },
  {
    id: 'ollama',
    name: 'Ollama',
    models: ['llama2', 'mistral'],
    requiresApiKey: false,
    supportsCustomUrl: true,
    baseUrl: 'http://localhost:11434'
  },
  {
    id: 'groq',
    name: 'Groq',
    models: ['mixtral-8x7b', 'llama2-70b'],
    requiresApiKey: true,
    supportsCustomUrl: false
  },
  {
    id: 'mistral',
    name: 'Mistral',
    models: ['mistral-tiny', 'mistral-small', 'mistral-medium'],
    requiresApiKey: true,
    supportsCustomUrl: false
  }
];

export const MODEL_OPTIONS = PROVIDERS.flatMap(provider => 
  provider.models.map(model => ({
    value: model,
    label: `${provider.name} - ${model}`,
    provider: provider.id,
    keyName: provider.requiresApiKey ? provider.id : undefined
  }))
);