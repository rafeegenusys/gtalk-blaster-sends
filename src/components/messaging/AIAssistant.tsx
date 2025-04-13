
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateAIResponse, generateSmartReplySuggestions } from "@/utils/ai";
import { Message } from "./MessageThread";
import { Contact } from "./ContactList";
import { Skeleton } from "@/components/ui/skeleton";

interface AIAssistantProps {
  messages: Message[];
  activeContact: Contact | null;
  onSelectSuggestion: (text: string) => void;
}

export function AIAssistant({ messages, activeContact, onSelectSuggestion }: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Get the last incoming message to generate suggestions for
    const lastIncomingMessage = [...messages]
      .reverse()
      .find(message => message.type === 'incoming');
      
    if (!lastIncomingMessage) return;
    
    generateSuggestions(lastIncomingMessage.content);
  }, [messages]);
  
  const generateSuggestions = async (messageContent: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to get AI-generated suggestions
      const messageHistory = buildMessageHistory();
      
      const aiResponse = await generateAIResponse(messageHistory);
      
      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }
      
      // Parse the AI response to get suggestions
      // Format expected: Multiple suggestions separated by double newlines
      if (aiResponse.response) {
        const parsedSuggestions = aiResponse.response.split('\n\n')
          .map(s => s.trim())
          .filter(s => s.length > 0);
          
        if (parsedSuggestions.length > 0) {
          setSuggestions(parsedSuggestions);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to pre-generated suggestions if AI fails or returns empty
      throw new Error("No usable AI suggestions generated");
      
    } catch (error) {
      console.log("Falling back to pre-defined suggestions");
      // Fallback to local suggestions
      setSuggestions(generateSmartReplySuggestions(
        messageContent, 
        activeContact?.name
      ));
    } finally {
      setLoading(false);
    }
  };
  
  const buildMessageHistory = () => {
    const history = [
      {
        role: 'system' as const,
        content: `You are an AI assistant helping a customer support agent respond to messages. 
        Generate 3 concise, professional, and helpful response options based on the conversation history. 
        Each suggestion should be less than 100 characters if possible. 
        Separate each suggestion with a double newline.`
      }
    ];
    
    // Add conversation history
    const lastMessages = messages.slice(-10); // Take last 10 messages for context
    lastMessages.forEach(message => {
      history.push({
        role: message.type === 'incoming' ? 'user' as const : 'assistant' as const,
        content: message.content
      });
    });
    
    return history;
  };
  
  const handleRefresh = () => {
    // Get the last incoming message
    const lastIncomingMessage = [...messages]
      .reverse()
      .find(message => message.type === 'incoming');
      
    if (lastIncomingMessage) {
      generateSuggestions(lastIncomingMessage.content);
    }
  };
  
  return (
    <div className="border rounded-md shadow-sm">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      
      <div className="p-3">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
            <Skeleton className="h-8 w-4/6" />
          </div>
        ) : error ? (
          <div className="text-center py-3">
            <AlertCircle className="h-5 w-5 text-destructive mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              className="mt-2" 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-36">
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors text-sm"
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
              
              {suggestions.length === 0 && (
                <div className="text-center py-3">
                  <p className="text-sm text-muted-foreground">No suggestions available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
