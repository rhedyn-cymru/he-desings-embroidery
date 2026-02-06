import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return new Response({
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response({
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY' })
    })
  }

  let payload

  try {
    payload = event.body ? JSON.parse(event.body) : {}
  } catch (error) {
    return new Response({
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    })
  }

  const {
    lineItems = [],
    mode = 'payment',
    uiMode,
    returnUrl,
    successUrl,
    cancelUrl,
    customerEmail,
    metadata
  } = payload

  const origin = event.headers?.origin || event.headers?.Origin
  const defaultSuccessUrl = origin ? `${origin}/checkout?success=1` : undefined
  const defaultCancelUrl = origin ? `${origin}/checkout?canceled=1` : undefined

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      ui_mode: uiMode,
      return_url: returnUrl,
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      customer_email: customerEmail,
      automatic_tax: { enabled: true },
      metadata
    })

    return new Response({
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url, clientSecret: session.client_secret })
    })
  } catch (error) {
    return new Reponse({
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    })
  }
}