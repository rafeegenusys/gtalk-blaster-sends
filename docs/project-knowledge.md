
# GTalk Project Knowledge Base

## Project Overview

GTalk is a messaging application that allows businesses to communicate with their contacts via SMS/MMS. The application includes features for managing contacts, sending messages, creating templates, scheduling messages, and analyzing messaging activity through reports.

## Core Features

1. **Authentication**
   - User sign-in and sign-up
   - Password reset functionality
   - Protected routes for authenticated users

2. **Messaging**
   - Send SMS/MMS to contacts
   - Message threading
   - AI-assisted messaging with smart replies
   - Internal team messaging

3. **Contact Management**
   - Create and manage contacts
   - Group contacts for bulk messaging
   - Tag contacts for organization

4. **Templates**
   - Create reusable message templates
   - Edit and manage templates

5. **Scheduling**
   - Schedule messages for future delivery
   - Calendar view of scheduled messages

6. **Reports**
   - Message delivery statistics
   - Cost analysis
   - Activity reports

7. **AI Integration**
   - Smart replies using AI models
   - Custom AI settings

8. **Credits System**
   - Track usage of messaging credits
   - Purchase additional credits

## Database Schema

### Tables

1. **businesses**
   - Core table for business entities
   - Tracks credit balance for messaging

2. **business_settings**
   - Stores API keys and configuration preferences
   - SMS provider settings
   - AI model preferences

3. **profiles**
   - User profiles linked to businesses
   - Stores user information and business association

4. **contacts**
   - Customer/recipient contact information
   - Supports tagging for organization

5. **groups**
   - Contact grouping for bulk messaging

6. **group_contacts**
   - Junction table linking contacts to groups

7. **messages**
   - Record of all messages sent
   - Includes scheduled messages and delivery status

8. **chat_messages**
   - Internal team chat functionality
   - Supports mentions and attachments

## Database Functions

1. **handle_new_user()**
   - Automatically creates business entity and profile when a new user registers
   - Sets default business name if not provided

2. **get_user_business_id()**
   - Utility function to retrieve the current user's associated business ID

3. **deduct_credits()**
   - Updates business credit balance when messages are sent

## Technology Stack

1. **Frontend**
   - React with TypeScript
   - Vite as build tool
   - Tailwind CSS for styling
   - shadcn/ui component library
   - Recharts for data visualization

2. **Backend**
   - Supabase for database and authentication
   - PostgreSQL database
   - Row-Level Security for data protection

3. **External Services**
   - OpenRouter for AI functionality
   - Twilio integration for SMS/MMS delivery (configured)

## Architecture

The application follows a modern React application structure with:

1. **Pages**
   - Main route components (Auth, Messaging, Contacts, etc.)

2. **Components**
   - Reusable UI components organized by feature

3. **Contexts**
   - AuthContext for authentication state management

4. **Utilities**
   - Helper functions for AI, file storage, etc.

5. **Integrations**
   - Supabase client configuration

## SQL Reference

### Table Creation

```sql
-- businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  credits_balance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- business_settings table
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses,
  sms_provider TEXT DEFAULT 'twilio',
  preferred_llm_model TEXT,
  openrouter_key TEXT,
  openphone_api_key TEXT,
  twilio_auth_token TEXT,
  twilio_sid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  business_id UUID REFERENCES public.businesses,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- group_contacts junction table
CREATE TABLE public.group_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups,
  contact_id UUID REFERENCES public.contacts,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses,
  sender_id UUID,
  recipient_id TEXT,
  recipient_type TEXT,
  type TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft',
  credits_used INTEGER DEFAULT 0,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID,
  receiver_id UUID,
  business_id UUID REFERENCES public.businesses,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  read_status BOOLEAN DEFAULT false,
  media_url TEXT,
  mentions TEXT[],
  reference_message_id UUID,
  reference_contact_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Functions

```sql
-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into businesses table with proper JSON handling
  INSERT INTO public.businesses (name)
  VALUES (
    CASE 
      WHEN new.raw_user_meta_data->>'business_name' IS NOT NULL AND new.raw_user_meta_data->>'business_name' != 'null' 
      THEN new.raw_user_meta_data->>'business_name' 
      ELSE 'My Business' 
    END
  )
  ON CONFLICT DO NOTHING;

  -- Insert into profiles with proper JSON handling
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    business_id
  )
  VALUES (
    new.id,
    CASE 
      WHEN new.raw_user_meta_data->>'full_name' IS NOT NULL AND new.raw_user_meta_data->>'full_name' != 'null' 
      THEN new.raw_user_meta_data->>'full_name' 
      ELSE split_part(new.email, '@', 1)
    END,
    new.email,
    (SELECT id FROM public.businesses WHERE name = 
      CASE 
        WHEN new.raw_user_meta_data->>'business_name' IS NOT NULL AND new.raw_user_meta_data->>'business_name' != 'null' 
        THEN new.raw_user_meta_data->>'business_name' 
        ELSE 'My Business' 
      END
    LIMIT 1)
  );
  
  RETURN new;
END;
$$;

-- Create trigger to execute the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to get the current user's business ID
CREATE OR REPLACE FUNCTION public.get_user_business_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT business_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Function to deduct credits when messages are sent
CREATE OR REPLACE FUNCTION public.deduct_credits(p_business_id UUID, p_amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.businesses
  SET credits_balance = GREATEST(credits_balance - p_amount, 0)
  WHERE id = p_business_id;
END;
$$;
```

## Authentication Flow

1. **Sign Up**
   - User provides email, password, business name, and optionally their full name
   - System creates a new user in auth.users
   - Trigger creates associated business and profile records
   - User is redirected to the dashboard

2. **Sign In**
   - User provides email and password
   - System authenticates and creates a session
   - User is redirected to the dashboard

3. **Password Reset**
   - User requests password reset via email
   - System sends reset instructions
   - User creates a new password

## Protected Routes

All application routes except `/auth` and `/reset-password` are protected and require authentication.

## Development Notes

1. The application uses React Router for navigation
2. Authentication state is managed through the AuthContext
3. Supabase client is configured in src/integrations/supabase/client.ts
4. AI integrations use the OpenRouter API
