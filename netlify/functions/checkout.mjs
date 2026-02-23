import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {

  const origin = event.headers?.origin || event.headers?.Origin

  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  const allowedOrigins = ["https://www.hedesigns.cymru", "http://localhost:8888"];

  if (!origin || !allowedOrigins.includes(origin)) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: `Origin ${origin} Not allowed` }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, Allow: "POST, OPTIONS" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
    };
  }

  let payload

  try {
    payload = event.body ? JSON.parse(event.body) : {}
  } catch (error) {
    console.error("checkout:invalid-json", error)
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }
  
  const { amount = 0 } = payload
  const amountParsed = Number(amount)

  if (!Number.isFinite(amountParsed) || amountParsed <= 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid amount" }),
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "gbp",
      amount: Math.round(amountParsed),
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (error) {
    console.error("checkout:stripe-error", error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
}