import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const cartItems = await req.json();

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.net_price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SUCCESS_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CANCEL_URL}`,
    });

    return Response.json({ id: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
