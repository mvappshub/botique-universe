import { Bot, ChatHistory } from './types';

const BOTS_KEY = 'chat-bots';
const HISTORY_KEY = 'chat-history';

export const saveBots = (bots: Bot[]) => {
  localStorage.setItem(BOTS_KEY, JSON.stringify(bots));
};

export const loadBots = (): Bot[] => {
  const stored = localStorage.getItem(BOTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveHistory = (history: ChatHistory[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const loadHistory = (): ChatHistory[] => {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};