import { Bot, ChatHistory } from './types';

const BOTS_KEY = 'chat-bots';
const HISTORY_KEY = 'chat-history';

export const saveBots = (bots: Bot[]) => {
  localStorage.setItem(BOTS_KEY, JSON.stringify(bots));
};

export const loadBots = (): Bot[] => {
  const stored = localStorage.getItem(BOTS_KEY);
  if (!stored) {
    // Initialize with a default bot if no bots exist
    const defaultBot: Bot = {
      id: crypto.randomUUID(),
      name: "Default Bot",
      description: "A helpful assistant",
      systemPrompt: "You are a helpful assistant.",
      color: "#4F46E5",
      model: "openai", // Add default model
    };
    saveBots([defaultBot]);
    return [defaultBot];
  }
  return JSON.parse(stored);
};

export const saveHistory = (history: ChatHistory[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const loadHistory = (): ChatHistory[] => {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const clearStorage = () => {
  localStorage.removeItem(BOTS_KEY);
  localStorage.removeItem(HISTORY_KEY);
};

export const exportData = () => {
  const data = {
    bots: loadBots(),
    history: loadHistory(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chatbot-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = async (file: File) => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.bots && data.history) {
      saveBots(data.bots);
      saveHistory(data.history);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};