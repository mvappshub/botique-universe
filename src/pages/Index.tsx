import { useState, useEffect } from 'react';
import { Bot, Message, ChatHistory } from '@/lib/types';
import { loadBots, saveBots, loadHistory, saveHistory } from '@/lib/storage';
import { BotList } from '@/components/BotList';
import { ChatInterface } from '@/components/ChatInterface';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [history, setHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    setBots(loadBots());
    setHistory(loadHistory());
  }, []);

  const handleNewBot = () => {
    const newBot: Bot = {
      id: crypto.randomUUID(),
      name: "New Bot",
      description: "A helpful assistant",
      systemPrompt: "You are a helpful assistant.",
      color: "#4F46E5",
    };
    
    const updatedBots = [...bots, newBot];
    setBots(updatedBots);
    saveBots(updatedBots);
    setSelectedBot(newBot);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedBot) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    const botResponse: Message = {
      id: crypto.randomUUID(),
      content: "I'm a demo bot. Connect an AI model to get real responses!",
      role: 'assistant',
      timestamp: Date.now(),
    };

    const botHistory = history.find(h => h.botId === selectedBot.id);
    const newHistory = botHistory
      ? history.map(h => h.botId === selectedBot.id
          ? { ...h, messages: [...h.messages, newMessage, botResponse] }
          : h)
      : [...history, { botId: selectedBot.id, messages: [newMessage, botResponse] }];

    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const currentMessages = history.find(h => h.botId === selectedBot?.id)?.messages || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarContent>
            <BotList
              bots={bots}
              selectedBot={selectedBot}
              onSelectBot={setSelectedBot}
              onNewBot={handleNewBot}
            />
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <SidebarTrigger />
          {selectedBot ? (
            <ChatInterface
              bot={selectedBot}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-screen flex items-center justify-center text-muted-foreground">
              Select or create a bot to start chatting
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;