// todo: give this to env variable, important
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
    const webhookSecret = 'whsec_RS43PqSLkI0lxAFNW4PlkK8LhxpjjjwL';

    let event: any;

    console.log('TRYING TO EXECUTE WEBHOOK');
    try {
      // event = stripe.webhooks.constructEvent(JSON.parse(ctx.request.body), sig, webhookSecret);
      // event = stripe.webhooks.constructEvent(ctx.request.body, sig, webhookSecret);
      // event = stripe.webhooks.constructEvent(ctx.req.rawBody, sig, webhookSecret);

         // Získání raw body
         const chunks: Uint8Array[] = [];
         ctx.req.on('data', (chunk) => {
           chunks.push(chunk);
         });
   
         await new Promise((resolve) => ctx.req.on('end', resolve));
   
         const rawBody = Buffer.concat(chunks).toString();
   
         event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

         // todo: POKUD SE UŽ DOSTANU TADY, TAK TADY BYCH MĚL VRÁTIT 200 A SUCCESS AŤ TO POCHOPÍ I STRIPE
         ctx.status = 200;
         ctx.body = {
           message: 'Order has been changed - webook is working tacabro!',
         };

    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err.message);
      ctx.status = 400;
      ctx.body = `Webhook Error: ${err.message}`;
      return;
    }



    // AFTERWORK WILL BE DONE HERE
    // Zpracování různých typů událostí až když vrátím webhook že je ok
    console.log('FINAL STRIPE EVENT: ', event);
    if (event.type === 'checkout.session.completed') {
      console.log('BORAT GREAT SUCCESS');
      const session = event.data.object;

      // get orderId
      const orderId = session.metadata.orderId;
      
      // Najdi a aktualizuj objednávku ve Strapi
      // todo: update user order by orderId from NEW to PAID
      /*await strapi.db.query('api::order.order').update({
        where: { id: orderId },
        data: { status: 'paid' },
      });*/

      console.log(`Order ${orderId} has been updated to paid.`);
    }
  }
};
