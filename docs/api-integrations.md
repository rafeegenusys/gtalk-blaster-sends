
# API Integrations in GTalk

## Supabase Integration

GTalk uses Supabase for authentication, database, and backend functionality.

### Authentication

The application uses Supabase Auth for user management:

- Sign-up: Creates a new user in Supabase Auth
- Sign-in: Authenticates existing users
- Password reset: Handles password recovery flow

### Database

Supabase PostgreSQL database is used for data storage with the following tables:
- businesses
- business_settings
- profiles
- contacts
- groups
- group_contacts
- messages
- chat_messages

### Configuration

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://acuhjfxobafthcjbjzro.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdWhqZnhvYmFmdGhjamJqenJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODc4NzIsImV4cCI6MjA1OTk2Mzg3Mn0.ES5S1bhanI2L3Mxj7S7Yl_98j7eIuuvWfJu5icfu-6Q";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);
```

## OpenRouter AI Integration

GTalk integrates with OpenRouter to provide AI-powered features:

### AI Response Generation

```typescript
// src/utils/ai.ts
export async function generateAIResponse(
  messageHistory: { role: 'user' | 'assistant' | 'system', content: string }[], 
  model: AIModel = 'gpt-3.5-turbo'
): Promise<AIResponse> {
  // Implementation to fetch OpenRouter API key from business settings
  // and make API call to OpenRouter
}
```

### Smart Reply Suggestions

```typescript
// src/utils/ai.ts
export function generateSmartReplySuggestions(
  messageContent: string,
  contactName?: string
): string[] {
  // Implementation for generating quick reply suggestions
}
```

## Twilio Integration (Configured)

The application is configured to use Twilio for SMS/MMS delivery:

### Configuration

Twilio credentials are stored in the `business_settings` table:
- `twilio_sid`
- `twilio_auth_token`

### API Usage

The application is set up to use these credentials for sending messages, though the actual implementation of message sending is not fully visible in the current codebase snapshot.

## Potential Future Integrations

1. **Payment Processing**
   - For purchasing message credits

2. **Analytics Services**
   - For enhanced reporting capabilities

3. **CRM Integrations**
   - For importing/exporting contacts

4. **Calendar Services**
   - For enhanced scheduling capabilities
