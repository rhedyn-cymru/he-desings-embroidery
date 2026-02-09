import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY' })
    }
  }

  let payload

  try {
    payload = event.body ? JSON.parse(event.body) : {}
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    }
  }

  const {
    lineItems = [],
  } = payload

  const origin = event.headers?.origin || event.headers?.Origin
  const defaultSuccessUrl = origin ? `${origin}/checkout?success=1` : undefined
  const defaultCancelUrl = origin ? `${origin}/checkout?canceled=1` : undefined

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://example.com/success',
      line_items: [
        {
          price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
          quantity: 2,
        },
      ],
      mode: 'payment',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url, clientSecret: session.client_secret })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}