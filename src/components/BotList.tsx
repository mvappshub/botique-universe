import { useState } from 'react';
import { Bot, ApiKeys, MODEL_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus, Settings } from 'lucide-react';
import { BotSettings } from './BotSettings';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
    // Check if the required API key is set for the selected model
    const requiredKey = MODEL_OPTIONS.find(m => m.value === bot.model)?.keyName;
    if (requiredKey && !apiKeys[requiredKey]) {
      toast({
        title: "Missing API Key",
        description: `Please set the API key for ${bot.model} before creating a bot using this model.`,
        variant: "destructive",
      });
      return;
    }
    
    onUpdateBot(bot);
    setSettingsOpen(false);
    setEditingBot(null);
  };

  const handleApiKeyChange = (model: string, value: string) => {
    const newKeys = { ...apiKeys, [model]: value };
    setApiKeys(newKeys);
    localStorage.setItem('api_keys', JSON.stringify(newKeys));
    
    toast({
      title: "API Key Updated",
      description: `${model.toUpperCase()} API key has been updated.`,
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        {MODEL_OPTIONS.map((model) => (
          <div key={model.value} className="space-y-2">
            <Label htmlFor={`${model.value}Key`}>{model.label} API Key</Label>
            <Input
              id={`${model.value}Key`}
              type="password"
              value={apiKeys[model.value] || ''}
              onChange={(e) => handleApiKeyChange(model.value, e.target.value)}
              placeholder={`Enter your ${model.label} API key`}
            />
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2" 
        onClick={handleNewBot}
      >
        <Plus className="h-4 w-4" />
        New Bot
      </Button>

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
    </div>
  );
};