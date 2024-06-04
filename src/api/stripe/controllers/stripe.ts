// todo: give this to env variable, important
// const stripe = require('stripe')('sk_test_51MWvwTJCZOkBLZhGvWuWQWGjoqZsXt9JWBEyw4Qs27A9CB9BRGsJwcnPpAqxyGbFEJJdNULllALM07A3UJyBmldW004wXY9pG8');
const stripe = require('stripe')(process.env.STRIPE_INSTANCE_API_KEY);
const unparsed = require('koa-body/unparsed.js');

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
      success_url: `${process.env.CAPABOOST_URL}/app/order/success`,
      cancel_url: `${process.env.CAPABOOST_URL}/app/order/failed`,
      metadata: {
        orderId: 'todo: orderId',
      }
    });


    ctx.body = {
      id: session.id
    }
  },
  webhook: async (ctx, next) => {
    const sig = ctx.request.headers['stripe-signature'];
    // Signing secret in stripe admin, todo: make it .env variable
    // const webhookSecret = 'whsec_RS43PqSLkI0lxAFNW4PlkK8LhxpjjjwL';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    try {
      const rawBody = ctx.request.body[unparsed];
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      ctx.status = 200;
      ctx.body = {
        message: 'Webhook call success!',
      };
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err.message);
      ctx.status = 400;
      ctx.body = `Webhook Error: ${err.message}`;
      return;
    }

    // todo: call a service afterwards so we can try catch and get api response properly
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('WEBHOOK stripe session: ', session);

      // get orderId
      const orderId = session.metadata.orderId;
      console.log('what is my orderId:, ', orderId);
      
      // Najdi a aktualizuj objednávku ve Strapi
      // todo: update user order by orderId from NEW to PAID
      /*await strapi.db.query('api::order.order').update({
        where: { id: orderId },
        data: { status: 'paid' },
      });*/

      // console.log(`Order ${orderId} has been updated to paid.`);
    }
  }
};
