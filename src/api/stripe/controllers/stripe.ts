const stripe = require('stripe')(process.env.STRIPE_INSTANCE_API_KEY);
const unparsed = require('koa-body/unparsed.js');

export default {
  createCheckoutSession: async (ctx: any, next: any) => {
    // todo:
    // + maybe registration email to prefill the form?
    const { productName, price, orderId } = ctx.request.body;

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
      success_url: `${process.env.CAPABOOST_URL}/app/order/success`,
      cancel_url: `${process.env.CAPABOOST_URL}/app/order/failed`,
      metadata: {
        orderId,
      }
    });


    ctx.body = {
      id: session.id
    }
  },
  webhook: async (ctx, next) => {
    const sig = ctx.request.headers['stripe-signature'];
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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      try {
        await strapi.entityService.update('api::user-order.user-order', orderId, {
          data: {
            status: 'SHIPPED',
          },
        });
        console.log(`Order ${orderId} has been updated to SHIPPED.`);
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  }
};
