import { useState } from 'react';
import { PROVIDERS, Provider, ApiKeys } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Search, Edit2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ProviderSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProviderSettings = ({ open, onOpenChange }: ProviderSettingsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Load API keys from localStorage
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const savedKeys = localStorage.getItem('api_keys');
    return savedKeys ? JSON.parse(savedKeys) : {};
  });

  // Load custom URLs from localStorage
  const [customUrls, setCustomUrls] = useState<Record<string, string>>(() => {
    const savedUrls = localStorage.getItem('provider_urls');
    return savedUrls ? JSON.parse(savedUrls) : {};
  });

  const handleApiKeyChange = (providerId: string, value: string) => {
    const newKeys = { ...apiKeys, [providerId]: value };
    setApiKeys(newKeys);
    localStorage.setItem('api_keys', JSON.stringify(newKeys));
    
    toast({
      title: "API Key Updated",
      description: `${providerId.toUpperCase()} API key has been updated.`,
    });
  };

  const handleCustomUrlChange = (providerId: string, value: string) => {
    const newUrls = { ...customUrls, [providerId]: value };
    setCustomUrls(newUrls);
    localStorage.setItem('provider_urls', JSON.stringify(newUrls));
    
    toast({
      title: "Base URL Updated",
      description: `${providerId.toUpperCase()} base URL has been updated.`,
    });
  };

  const filteredProviders = PROVIDERS.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Provider Settings</SheetTitle>
          <SheetDescription>
            Configure your AI providers and API keys
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="space-y-6">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">{provider.name}</Label>
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </div>
                
                {provider.requiresApiKey && (
                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-key`}>API Key</Label>
                    <Input
                      id={`${provider.id}-key`}
                      type="password"
                      value={apiKeys[provider.id] || ''}
                      onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                      placeholder={`Enter your ${provider.name} API key`}
                    />
                  </div>
                )}
                
                {provider.supportsCustomUrl && (
                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-url`}>Base URL</Label>
                    <Input
                      id={`${provider.id}-url`}
                      type="text"
                      value={customUrls[provider.id] || provider.baseUrl || ''}
                      onChange={(e) => handleCustomUrlChange(provider.id, e.target.value)}
                      placeholder="Enter custom base URL"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};