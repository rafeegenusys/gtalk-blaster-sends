
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

interface RequestData {
  business_id: string;
  amount: number;
}

serve(async (req) => {
  // Create a Supabase client with the Auth context of the logged in user
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  // Get the request data
  const requestData: RequestData = await req.json();
  const { business_id, amount } = requestData;

  // Skip if no business ID or amount
  if (!business_id || !amount) {
    return new Response(
      JSON.stringify({ error: 'business_id and amount are required' }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }

  try {
    // Update the credits in the business table
    const { error } = await supabaseClient.rpc('deduct_credits', {
      business_id,
      amount,
    })

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
