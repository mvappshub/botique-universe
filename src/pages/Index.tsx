import { useState, useEffect } from 'react';
import { Bot, Message, ChatHistory } from '@/lib/types';
import { loadBots, saveBots, loadHistory, saveHistory, exportData, importData } from '@/lib/storage';
import { BotList } from '@/components/BotList';
import { ChatInterface } from '@/components/ChatInterface';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload } from 'lucide-react';

const Index = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadedBots = loadBots();
    const loadedHistory = loadHistory();
    setBots(loadedBots);
    setHistory(loadedHistory);
    if (loadedBots.length > 0) {
      setSelectedBot(loadedBots[0]);
    }
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
    
    toast({
      title: "Bot Created",
      description: "New bot has been created successfully.",
    });
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

  const handleExport = () => {
    exportData();
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const success = await importData(file);
    if (success) {
      const loadedBots = loadBots();
      const loadedHistory = loadHistory();
      setBots(loadedBots);
      setHistory(loadedHistory);
      if (loadedBots.length > 0) {
        setSelectedBot(loadedBots[0]);
      }
      toast({
        title: "Data Imported",
        description: "Your data has been imported successfully.",
      });
    } else {
      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const currentMessages = history.find(h => h.botId === selectedBot?.id)?.messages || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarContent>
            <div className="space-y-4">
              <BotList
                bots={bots}
                selectedBot={selectedBot}
                onSelectBot={setSelectedBot}
                onNewBot={handleNewBot}
              />
              <div className="px-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="w-[calc(50%-0.25rem)]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-file')?.click()}
                  className="w-[calc(50%-0.25rem)]"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </div>
            </div>
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