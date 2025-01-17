import { Bot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus } from 'lucide-react';

interface BotListProps {
  bots: Bot[];
  selectedBot: Bot | null;
  onSelectBot: (bot: Bot) => void;
  onNewBot: () => void;
}

export const BotList = ({ bots, selectedBot, onSelectBot, onNewBot }: BotListProps) => {
  return (
    <div className="space-y-2 p-4">
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2" 
        onClick={onNewBot}
      >
        <Plus className="h-4 w-4" />
        New Bot
      </Button>
      <div className="space-y-1">
        {bots.map((bot) => (
          <Button
            key={bot.id}
            variant={selectedBot?.id === bot.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => onSelectBot(bot)}
          >
            <MessageCircle 
              className="h-4 w-4" 
              style={{ color: bot.color }} 
            />
            {bot.name}
          </Button>
        ))}
      </div>
    </div>
  );
};