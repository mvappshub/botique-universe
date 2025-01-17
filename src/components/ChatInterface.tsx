import { useState, useRef, useEffect } from 'react';
import { Bot, Message } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
  bot: Bot;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export const ChatInterface = ({ bot, messages, onSendMessage }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 chat-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble ${
              message.role === 'user' ? 'user-message' : 'bot-message'
            }`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-input">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};