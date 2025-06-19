import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  try {
    const cartItems = await req.json();

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'inr', // ✅ INR for Indian Rupees
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.net_price * 100), // ✅ 234 INR → 23400 paisa
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/successPay',
      cancel_url: 'http://localhost:3000/',
    });

    return Response.json({ id: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


