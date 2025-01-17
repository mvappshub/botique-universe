import { useState } from 'react';
import { Bot, ApiKeys, MODEL_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus, Settings, Cog } from 'lucide-react';
import { BotSettings } from './BotSettings';
import { ProviderSettings } from './ProviderSettings';
import { useToast } from './ui/use-toast';

interface BotListProps {
  bots: Bot[];
  selectedBot: Bot | null;
  onSelectBot: (bot: Bot) => void;
  onNewBot: () => void;
  onUpdateBot: (bot: Bot) => void;
}

export const BotList = ({ bots, selectedBot, onSelectBot, onNewBot, onUpdateBot }: BotListProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [providerSettingsOpen, setProviderSettingsOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const { toast } = useToast();
  
  // Load API keys from localStorage
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const savedKeys = localStorage.getItem('api_keys');
    return savedKeys ? JSON.parse(savedKeys) : {};
  });

  const handleEditBot = (bot: Bot) => {
    setEditingBot(bot);
    setSettingsOpen(true);
  };

  const handleNewBot = () => {
    setEditingBot(null);
    setSettingsOpen(true);
  };

  const handleSaveBot = (bot: Bot) => {
    const modelOption = MODEL_OPTIONS.find(m => m.value === bot.model);
    if (modelOption?.keyName && !apiKeys[modelOption.keyName]) {
      toast({
        title: "Missing API Key",
        description: `Please set the API key for ${modelOption.label} in provider settings.`,
        variant: "destructive",
      });
      return;
    }
    
    onUpdateBot(bot);
    setSettingsOpen(false);
    setEditingBot(null);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={handleNewBot}
        >
          <Plus className="h-4 w-4" />
          New Bot
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setProviderSettingsOpen(true)}
          className="ml-2"
        >
          <Cog className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {bots.map((bot) => (
          <div key={bot.id} className="flex items-center gap-2">
            <Button
              variant={selectedBot?.id === bot.id ? "secondary" : "ghost"}
              className="flex-1 justify-start gap-2"
              onClick={() => onSelectBot(bot)}
            >
              <MessageCircle 
                className="h-4 w-4" 
                style={{ color: bot.color }} 
              />
              {bot.name}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditBot(bot)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <BotSettings
        bot={editingBot}
        onSave={handleSaveBot}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <ProviderSettings
        open={providerSettingsOpen}
        onOpenChange={setProviderSettingsOpen}
      />
    </div>
  );
};