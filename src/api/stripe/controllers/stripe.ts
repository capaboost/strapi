// todo: give this to env variable
const stripe = require('stripe')('sk_test_51MWvwTJCZOkBLZhGvWuWQWGjoqZsXt9JWBEyw4Qs27A9CB9BRGsJwcnPpAqxyGbFEJJdNULllALM07A3UJyBmldW004wXY9pG8');

export default {
  createCheckoutSession: async (ctx: any, next: any) => {
    const { productName, price } = ctx.request.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'czk',
            product_data: {
              name: productName,
              description: 'Todo: Lorem ipsum dolor sit amet'
            },
            unit_amount: price*100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      // success_url: `${process.env.CAPABOOST_URL}/app/order/success`,
      // cancel_url: `${process.env.CAPABOOST_URL}/app/order/failed`,
      success_url: 'http://localhost:1234/app/order/success',
      cancel_url: 'http://localhost:1234/app/order/failed'
    });


    ctx.body = {
      id: session.id
    }
  },
  webhook: async (ctx, next) => {
    try {
      ctx.body = 'ok - strapi webhook';
    } catch (err) {
      ctx.body = err;
    }
  }
};
