
-- GTalk Database Schema

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

-- Row Level Security policies would go here
-- Example:
-- ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own business" 
--   ON public.businesses 
--   FOR SELECT 
--   USING (id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
