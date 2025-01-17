import { useState } from 'react';
import { Bot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus, Settings } from 'lucide-react';
import { BotSettings } from './BotSettings';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key') || '');

  const handleEditBot = (bot: Bot) => {
    setEditingBot(bot);
    setSettingsOpen(true);
  };

  const handleNewBot = () => {
    setEditingBot(null);
    setSettingsOpen(true);
  };

  const handleSaveBot = (bot: Bot) => {
    onUpdateBot(bot);
    setSettingsOpen(false);
    setEditingBot(null);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('api_key', newKey);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your API key"
        />
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