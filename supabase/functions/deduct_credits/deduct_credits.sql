
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
