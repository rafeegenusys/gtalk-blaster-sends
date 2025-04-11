
CREATE OR REPLACE FUNCTION public.deduct_credits(business_id UUID, amount INTEGER)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.businesses
  SET credits_balance = GREATEST(credits_balance - amount, 0)
  WHERE id = business_id;
$$;
