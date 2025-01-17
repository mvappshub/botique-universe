export interface Bot {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  color: string;
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