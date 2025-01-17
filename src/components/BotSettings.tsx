import { useState, useEffect } from 'react';
import { Bot, MODEL_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BotSettingsProps {
  bot: Bot | null;
  onSave: (bot: Bot) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BotSettings = ({ bot, onSave, open, onOpenChange }: BotSettingsProps) => {
  const [name, setName] = useState(bot?.name || '');
  const [description, setDescription] = useState(bot?.description || '');
  const [systemPrompt, setSystemPrompt] = useState(bot?.systemPrompt || '');
  const [color, setColor] = useState(bot?.color || '#4F46E5');
  const [model, setModel] = useState(bot?.model || MODEL_OPTIONS[0].value);

  useEffect(() => {
    if (bot) {
      setName(bot.name);
      setDescription(bot.description);
      setSystemPrompt(bot.systemPrompt);
      setColor(bot.color);
      setModel(bot.model || MODEL_OPTIONS[0].value);
    } else {
      setName('');
      setDescription('');
      setSystemPrompt('');
      setColor('#4F46E5');
      setModel(MODEL_OPTIONS[0].value);
    }
  }, [bot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: bot?.id || crypto.randomUUID(),
      name,
      description,
      systemPrompt,
      color,
      model,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{bot ? 'Edit Bot' : 'New Bot'}</SheetTitle>
          <SheetDescription>
            Configure your bot's personality and behavior
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bot name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the bot"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Define how the bot should behave..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-20"
            />
          </div>
          <Button type="submit" className="w-full">
            Save Bot
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};