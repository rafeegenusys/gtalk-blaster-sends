
import { supabase } from "@/integrations/supabase/client";

type AIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'anthropic/claude-instant-v1' | 'anthropic/claude-2' | 'google/palm-2-chat-bison' | string;

interface AIResponse {
  response: string;
  error?: string;
}

export async function generateAIResponse(
  messageHistory: { role: 'user' | 'assistant' | 'system', content: string }[], 
  model: AIModel = 'gpt-3.5-turbo'
): Promise<AIResponse> {
  try {
    // Get the API key from business settings
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) {
      throw new Error("User not authenticated");
    }
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('id', userData.user.id)
      .single();
      
    if (!profileData?.business_id) {
      throw new Error("Business not found");
    }
    
    const { data: settings } = await supabase
      .from('business_settings')
      .select('openrouter_key')
      .eq('business_id', profileData.business_id)
      .single();
    
    const apiKey = settings?.openrouter_key;
    if (!apiKey) {
      throw new Error("OpenRouter API key not found in business settings");
    }
    
    // Make API call to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'GTalk Messaging App'
      },
      body: JSON.stringify({
        model: model,
        messages: messageHistory,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "Unknown API error");
    }
    
    return { 
      response: data.choices[0].message.content 
    };
  } catch (error: any) {
    console.error("AI generation error:", error);
    return { 
      response: "",
      error: error.message || "Failed to generate AI response" 
    };
  }
}

export function generateSmartReplySuggestions(
  messageContent: string,
  contactName?: string
): string[] {
  // This is a fallback function that returns predefined responses
  // when the AI API is not available or fails
  
  if (messageContent.toLowerCase().includes('price') || messageContent.toLowerCase().includes('cost')) {
    return [
      "Our pricing is competitive and flexible. I'd be happy to send you our full price list.",
      "We offer different pricing tiers based on your needs. Would you like me to go over them with you?",
      "Let me get you our current pricing information. One moment please."
    ];
  }
  
  if (messageContent.toLowerCase().includes('time') || messageContent.toLowerCase().includes('when')) {
    return [
      "We're available Monday-Friday, 9am-6pm. Does that work for you?",
      "I can schedule that for you. When would be a good time?",
      "Let me check our availability and get back to you shortly."
    ];
  }
  
  if (messageContent.toLowerCase().includes('help') || messageContent.toLowerCase().includes('support')) {
    return [
      "I'd be happy to help you with that. Could you provide more details?",
      "Let me see what we can do to resolve this for you.",
      "Our support team is ready to assist. What specific help do you need?"
    ];
  }
  
  // Default responses
  return [
    "Thank you for your message. I'll get back to you shortly.",
    `Hi${contactName ? ` ${contactName}` : ''}, I appreciate your inquiry. Let me check and respond ASAP.`,
    "Thanks for reaching out. How else can I assist you today?"
  ];
}
